import db, { mongoTransaction } from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const _id = getRouterParam(event, 'linkId');
  const quizId = getRouterParam(event, 'id');
  const query = { _id, quizId };

  const link = await db.QuizLink.exists(query);
  if (!link) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Link not found'
    });
  }

  await mongoTransaction(async session => {
    await db.QuizLink.deleteOne(query, { session });
    await db.MemberResponse.deleteMany({ linkId: _id }, { session });
  });

  return { ok: true };
};

export default defineEventHandler(userAuth(route));
