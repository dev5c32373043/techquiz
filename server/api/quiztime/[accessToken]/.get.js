import db from '~/server/db';
import { memberAuth } from '~/server/middlewares';

const route = async event => {
  const { currentLink } = event.context;
  const quiz = await db.Quiz.findOne({ _id: currentLink.quizId }).select('title introMessage attemptsCount').lean();
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const memberResponse = await db.MemberResponse.findOne({ quizId: currentLink.quizId, linkId: currentLink._id })
    .select('stats')
    .lean();
  const userAttemptsCount = memberResponse?.stats?.attempts?.length ?? 0;
  if (userAttemptsCount >= quiz.attemptsCount) {
    throw QuizNotFoundError();
  }

  return quiz;
};

export default defineEventHandler(memberAuth(route));
