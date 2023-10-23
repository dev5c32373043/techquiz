import db, { mongoose } from '~/server/db';
import { LinkUpdatePayload } from '~/dto/link';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const _id = getRouterParam(event, 'linkId');
  const quizId = getRouterParam(event, 'id');
  const payload = validatePayload(LinkUpdatePayload, await readBody(event));

  const updatedLink = await db.QuizLink.findOneAndUpdate({ _id, quizId }, payload, { new: true });
  if (!updatedLink) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Link not found'
    });
  }

  return updatedLink;
};

export default defineEventHandler(userAuth(route));
