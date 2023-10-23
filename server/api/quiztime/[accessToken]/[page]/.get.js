import dayjs from 'dayjs';
import db from '~/server/db';
import { memberAuth } from '~/server/middlewares';

const route = async event => {
  const { currentLink } = event.context;
  const page = parseInt(getRouterParam(event, 'page'), 10);

  const memberResponse = await db.MemberResponse.findOne({ linkId: currentLink._id }).lean();
  if (!memberResponse) {
    throw QuizNotFoundError();
  }

  const { latestAttempt } = memberResponse;
  const question = latestAttempt.questions.find(q => q.page === page);
  if (!question) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Question not found'
    });
  }

  const deadline = new Date(new Date(latestAttempt.startedAt).valueOf() + latestAttempt.timeLimitMs);
  if (Date.now() >= deadline) {
    const accessToken = getRouterParam(event, 'accessToken');

    throw createError({
      statusCode: 403,
      statusMessage: 'Quiz expired',
      data: {
        redirectPath: `/q/${accessToken}/result`
      }
    });
  }
  // Calculate and update the time spent on the previous question when a member goes back to a previous page.
  if (page !== latestAttempt.questions.length) {
    const prevQuestion = latestAttempt.questions.find(q => q.page === page + 1);

    if (prevQuestion.startedAt && dayjs(prevQuestion.startedAt).isValid()) {
      prevQuestion.timeSpentMs ||= 0;
      prevQuestion.timeSpentMs += Date.now() - new Date(prevQuestion.startedAt);
      prevQuestion.startedAt = null;
    }
  }

  question.startedAt = new Date().toISOString();
  await db.MemberResponse.updateOne({ _id: memberResponse._id }, { latestAttempt });

  const nextPage = latestAttempt.questions.find(q => q.page === page + 1)?.page;
  const limitedInfo = pick(question, ['_id', 'page', 'title', 'variant', 'code', 'options']);

  return {
    nextPage,
    question: limitedInfo,
    deadline: deadline.toISOString(),
    pagesCount: latestAttempt.questions.length
  };
};

export default defineEventHandler(memberAuth(route));
