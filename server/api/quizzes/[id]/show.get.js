import db from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const queryBuilder = new QueryBuilder(event);
  const _id = getRouterParam(event, 'id');
  const quiz = await db.Quiz.findOne(queryBuilder({ _id })).lean();
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const relQuery = { quizId: quiz._id };
  const links = await db.QuizLink.find(relQuery).lean();
  const responses = await db.MemberResponse.find(relQuery).lean();
  const responsesMap = new Map();
  responses.forEach(response => {
    responsesMap.set(response.linkId.toString(), response);
  });

  links.sort((linkA, linkB) => {
    // Find the most recent response for each link
    const responseA = responsesMap.get(linkA._id.toString());
    const responseB = responsesMap.get(linkB._id.toString());

    return new Date(responseB?.createdAt) - new Date(responseA?.createdAt);
  });

  for (const quizLink of links) {
    const memberResponse = responsesMap.get(quizLink._id.toString());
    quizLink.response = memberResponse;
  }

  quiz.links = links;

  db.Quiz.updateOne({ _id: quiz._id }, { unreadResponses: false }).catch(updateErr => {
    logger.error(updateErr);
  });

  return quiz;
};

export default defineEventHandler(userAuth(route));
