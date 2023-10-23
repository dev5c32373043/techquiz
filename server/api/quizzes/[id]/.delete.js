import db, { mongoTransaction } from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const _id = getRouterParam(event, 'id');
  const queryBuilder = new QueryBuilder(event);
  const query = queryBuilder({ _id });

  const quiz = await db.Quiz.exists(query);
  if (!quiz) {
    throw QuizNotFoundError();
  }

  await mongoTransaction(async session => {
    await db.Quiz.deleteOne(query, { session });

    const relQuery = { quizId: _id };
    await db.QuizQuestion.deleteMany(relQuery, { session });
    await db.QuizLink.deleteMany(relQuery, { session });
    await db.MemberResponse.deleteMany(relQuery, { session });
  });

  return { ok: true };
};

export default defineEventHandler(userAuth(route));
