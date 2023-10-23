import db, { mongoose } from '~/server/db';
import { QuizUpdatePayload } from '~/dto/quiz';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const queryBuilder = new QueryBuilder(event);
  const _id = getRouterParam(event, 'id');
  const payload = validatePayload(QuizUpdatePayload, await readBody(event));

  const updatedQuiz = await db.Quiz.findOneAndUpdate(queryBuilder({ _id }), payload, { new: true });
  if (!updatedQuiz) {
    throw QuizNotFoundError();
  }

  return updatedQuiz;
};

export default defineEventHandler(userAuth(route));
