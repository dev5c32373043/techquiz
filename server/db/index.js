import User from './user';
import Token from './token';
import Quiz from './quiz';
import QuizQuestion from './quiz-question';
import QuizLink from './quiz-link';
import MemberResponse from './member-response';

const db = { User, Token, Quiz, QuizQuestion, QuizLink, MemberResponse };

import mongoose from 'mongoose';

export async function mongoTransaction(fn) {
  const client = mongoose.connection.getClient();
  const session = client.startSession();
  session.startTransaction();

  const [transactionErr] = await to(fn(session));
  if (transactionErr) {
    await session.abortTransaction();
    session.endSession();
    throw transactionErr;
  }

  await session.commitTransaction();
  session.endSession();
}

export * as mongoose from 'mongoose';

export default db;
