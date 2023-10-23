import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';

const Token = defineMongooseModel('Token', {
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  idToken: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

export default Token;
