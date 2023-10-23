import db, { mongoose } from '~/server/db';
import { QuestionCreatePayload, QuestionUpdatePayload } from '~/dto/question';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const { ObjectId } = mongoose.Types;

  const quizId = new ObjectId(getRouterParam(event, 'id'));
  const body = await readBody(event);
  const queryBuilder = new QueryBuilder(event);

  const quiz = await db.Quiz.exists(queryBuilder({ _id: quizId }));
  if (!quiz) {
    throw QuizNotFoundError();
  }

  const result = { records: { created: 0, updated: 0, deleted: 0 }, errors: [] };

  const payloadAcceptable = ['added', 'updated', 'removed'].every(
    key => Array.isArray(body[key]) || !body.hasOwnProperty(key)
  );
  if (!payloadAcceptable) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' });
  }

  const { added = [], updated = [], removed = [] } = body;

  const bulk = db.QuizQuestion.collection.initializeUnorderedBulkOp();

  for (const payload of added) {
    const validationResult = validatePayload(QuestionCreatePayload, payload, false);
    if (!validationResult.success) {
      result.errors.push(validationResult.error);
      continue;
    }

    bulk.insert({ ...validationResult.data, quizId });
  }

  for (const payload of updated) {
    const validationResult = validatePayload(QuestionUpdatePayload, payload, false);
    if (!validationResult.success) {
      result.errors.push(validationResult.error);
      continue;
    }

    bulk.find({ _id: new ObjectId(payload._id) }).updateOne({ $set: validationResult.data });
  }

  for (const _id of removed) {
    bulk.find({ _id: new ObjectId(_id) }).deleteOne();
  }

  if (bulk.length === 0) return result;

  const bulkResult = await bulk.execute();

  result.records = {
    created: bulkResult.insertedCount,
    updated: bulkResult.modifiedCount,
    deleted: bulkResult.deletedCount
  };

  return result;
};

export default defineEventHandler(userAuth(route));
