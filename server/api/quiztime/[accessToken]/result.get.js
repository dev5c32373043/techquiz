import db, { mongoTransaction } from '~/server/db';
import { memberAuth } from '~/server/middlewares';
import { calculateQuizScore, notifyQuizOwner } from '~/server/services/quiz';

const route = async event => {
  const { currentLink } = event.context;

  const memberResponse = await db.MemberResponse.findOne({ linkId: currentLink._id })
    .select('stats latestAttempt')
    .lean();
  if (!memberResponse) {
    throw QuizNotFoundError();
  }

  const quiz = await db.Quiz.findOne({ _id: currentLink.quizId })
    .select('userId title outroMessage attemptsCount')
    .lean();
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const { latestAttempt, stats } = memberResponse;

  if (!latestAttempt.hasOwnProperty('score')) {
    latestAttempt.score = calculateQuizScore(latestAttempt.questions);
    latestAttempt.timeSpentMs = Date.now() - new Date(latestAttempt.startedAt);

    stats.finalScore ||= 0;

    if (latestAttempt.score >= stats.finalScore) {
      stats.finalScore = latestAttempt.score;
      stats.totalTimeMs = latestAttempt.timeSpentMs;
    }

    stats.attempts.unshift(latestAttempt);

    await mongoTransaction(async session => {
      await db.MemberResponse.updateOne({ _id: memberResponse._id }, { latestAttempt, stats }, { session });
      await db.Quiz.updateOne({ _id: quiz._id }, { unreadResponses: true }, { session });
    });

    notifyQuizOwner(quiz, currentLink, latestAttempt);
  }

  return {
    message: quiz.outroMessage,
    questionsCount: latestAttempt.questions.length,
    score: latestAttempt.score,
    hasNewAttempt: stats.attempts.length < quiz.attemptsCount
  };
};

export default defineEventHandler(memberAuth(route));
