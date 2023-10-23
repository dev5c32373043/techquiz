import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';
import { nanoid } from 'nanoid';
/*
Here's an example of what could be seen as a poor architectural choice.
While it might suffice for smaller quizzes, it could quickly reach the 16MB document limit when handling larger ones.
In an ideal scenario, we'd have a separate collection for member attempts and store specific version of questions for each attempt.
If you're interested in addressing these concerns, please feel free to do so 😉
*/

const questionSchema = {
  _id: String,
  page: Number,
  title: String,
  variant: String,
  startedAt: Date,
  timeSpentMs: Number,
  answerIds: [Number],
  code: {
    lang: String,
    content: String,
    timeSpentMs: Number,
    sample: Boolean
  },
  options: [{ _id: false, id: Number, value: String, isSelected: Boolean }]
};

const latestAttempt = {
  score: Number,
  startedAt: Date,
  timeSpentMs: Number,
  timeLimitMs: Number,
  questions: [questionSchema]
};

const stats = {
  finalScore: Number,
  totalTimeMs: Number,
  attempts: [
    {
      score: Number,
      timeSpentMs: Number,
      questions: [questionSchema]
    }
  ]
};

const MemberResponse = defineMongooseModel('MemberResponse', {
  quizId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  linkId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  stats,
  latestAttempt,
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

export default MemberResponse;
