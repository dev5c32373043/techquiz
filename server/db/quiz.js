import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';

const Quiz = defineMongooseModel('Quiz', {
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  introMessage: {
    type: String,
    required: true
  },
  outroMessage: {
    type: String,
    required: true
  },
  timeLimitMs: Number,
  attemptsCount: {
    type: Number,
    default: 1
  },
  randomize: {
    type: Boolean,
    default: true
  },
  unreadResponses: Boolean,
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

export default Quiz;
