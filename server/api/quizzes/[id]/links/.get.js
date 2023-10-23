import db from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const quizId = getRouterParam(event, 'id');
  const queryBuilder = new QueryBuilder(event);

  const quiz = await db.Quiz.exists(queryBuilder({ _id: quizId })).lean();
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const links = await db.QuizLink.find({ quizId }).lean();
  return links;
};

export default defineEventHandler(userAuth(route));
