import db from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const queryBuilder = new QueryBuilder(event);
  const _id = getRouterParam(event, 'id');
  const quiz = await db.Quiz.findOne(queryBuilder({ _id })).lean();
  if (!quiz) {
    throw QuizNotFoundError();
  }

  return quiz;
};

export default defineEventHandler(userAuth(route));
