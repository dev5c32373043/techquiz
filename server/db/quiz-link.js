import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';
import { nanoid } from 'nanoid';

const schema = {
  quizId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    unique: true
  },
  userDeviceId: String,
  metadata: [{ _id: false, id: Number, key: String, value: String }],
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
};

const QuizLink = defineMongooseModel({
  name: 'QuizLink',
  schema,
  hooks(schema) {
    schema.pre('save', function () {
      if (!this.isNew) return;
      this.accessToken = nanoid(12);
    });
  }
});

export default QuizLink;
