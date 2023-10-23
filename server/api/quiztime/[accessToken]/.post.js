import db, { mongoTransaction } from '~/server/db';
import { memberAuth } from '~/server/middlewares';

const route = async event => {
  const { currentLink } = event.context;
  const userDeviceId = getHeader(event, 'x-device-id');
  if (!userDeviceId) {
    throw QuizNotFoundError();
  }

  const memberResponse = await db.MemberResponse.findOneAndUpdate(
    { quizId: currentLink.quizId, linkId: currentLink._id },
    { $setOnInsert: { quizId: currentLink.quizId, linkId: currentLink._id } },
    { upsert: true, new: true }
  );

  const userAttemptsCount = memberResponse.stats?.attempts?.length ?? 0;
  const quiz = await db.Quiz.findOne({ _id: currentLink.quizId }).select('timeLimitMs attemptsCount randomize').lean();
  if (!quiz || userAttemptsCount >= quiz.attemptsCount) {
    throw QuizNotFoundError();
  }

  const questions = await db.QuizQuestion.find({ quizId: quiz._id }).lean();
  // randomize questions if needed
  const pages = quiz.randomize && shuffleArray(Array.from({ length: questions.length }, (_, idx) => idx + 1));
  // mapping essential info
  const questionsInfo = questions.map((question, index) => {
    const page = quiz.randomize ? pages.pop() : index + 1;
    const item = { ...pick(question, ['title', 'variant', 'code']), page, _id: question._id.toString() };

    if (['single', 'multi'].includes(question.variant)) {
      // randomize options if needed
      const optionsOrder = quiz.randomize && shuffleArray(Array.from({ length: question.options.length }, (_, i) => i));
      const result = question.options.reduce(
        (res, opt, idx) => {
          const position = quiz.randomize ? optionsOrder.pop() : idx;
          res.options[position] = { id: opt.id, value: opt.value };

          if (opt.isSelected) {
            res.answerIds.push(opt.id);
          }

          return res;
        },
        { options: [], answerIds: [] }
      );

      Object.assign(item, result);
    }

    return item;
  });

  const latestAttempt = {
    timeLimitMs: quiz.timeLimitMs,
    startedAt: new Date().toISOString(),
    questions: questionsInfo,
    answers: []
  };

  await mongoTransaction(async session => {
    await db.MemberResponse.updateOne({ _id: memberResponse._id }, { latestAttempt }, { session });
    await db.QuizLink.updateOne({ _id: currentLink._id }, { userDeviceId }, { session });
  });

  setCookie(event, 'userDeviceId', userDeviceId, {
    secure: true,
    httpOnly: true,
    sameSite: true,
    maxAge: 60 * 60 * 24 * 7
  });

  return { nextPage: 1 };
};

export default defineEventHandler(memberAuth(route));
