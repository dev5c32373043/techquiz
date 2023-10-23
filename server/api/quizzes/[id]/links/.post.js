import db, { mongoose } from '~/server/db';
import { LinkCreatePayload } from '~/dto/link';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const quizId = getRouterParam(event, 'id');
  const payload = validatePayload(LinkCreatePayload, await readBody(event));

  const queryBuilder = new QueryBuilder(event);
  const quiz = await db.Quiz.exists(queryBuilder({ _id: quizId }));
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const link = await db.QuizLink.create({ ...payload, quizId });
  return link;
};

export default defineEventHandler(userAuth(route));
