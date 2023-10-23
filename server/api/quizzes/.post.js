import db, { mongoose } from '~/server/db';
import { QuizCreatePayload } from '~/dto/quiz';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const data = validatePayload(QuizCreatePayload, await readBody(event));
  const { userId } = new QueryBuilder(event)();
  const payload = { ...data, userId };
  const quiz = await db.Quiz.create(payload);

  return quiz;
};

export default defineEventHandler(userAuth(route));
