import db from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  // TODO: add pagination, filtering, etc.
  const queryBuilder = new QueryBuilder(event);
  const quizzes = await db.Quiz.find(queryBuilder()).sort('-createdAt').lean();
  return quizzes;
};

export default defineEventHandler(userAuth(route));
