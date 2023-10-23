import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';

const QuizQuestion = defineMongooseModel('QuizQuestion', {
  quizId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    enum: ['single', 'multi', 'code'],
    required: true
  },
  code: {
    lang: String,
    content: String
  },
  options: [{ _id: false, id: Number, value: String, isSelected: Boolean }]
});

export default QuizQuestion;
