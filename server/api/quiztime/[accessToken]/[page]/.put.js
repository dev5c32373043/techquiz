import db from '~/server/db';
import { MemberResponsePayload } from '~/dto/member-response';
import { memberAuth } from '~/server/middlewares';

const route = async event => {
  const { currentLink } = event.context;
  const page = parseInt(getRouterParam(event, 'page'), 10);
  const { options, code } = validatePayload(MemberResponsePayload, await readBody(event));

  const memberResponse = await db.MemberResponse.findOne({ linkId: currentLink._id }).lean();
  if (!memberResponse) {
    throw QuizNotFoundError();
  }

  const { latestAttempt } = memberResponse;
  // getting the question info from the latest attempt
  const question = latestAttempt.questions.find(q => q.page === page);
  if (!question) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Question not found'
    });
  }

  // adding the answer to the latest attempt
  if (options?.length > 0) {
    question.options = options;
  }

  if (code) {
    const { content, timeSpentMs } = code;
    question.code.timeSpentMs ||= 0;
    question.code.timeSpentMs += timeSpentMs;
    question.code.content = content;
  }

  // updating the time spent on the question (based on the time when the question was fetched)
  question.timeSpentMs ||= 0;
  question.timeSpentMs += Date.now() - new Date(question.startedAt);
  question.startedAt = null;

  await db.MemberResponse.updateOne({ _id: memberResponse._id }, { latestAttempt });

  const nextPage = latestAttempt.questions.find(q => q.page === page + 1)?.page;
  return { nextPage };
};

export default defineEventHandler(memberAuth(route));
