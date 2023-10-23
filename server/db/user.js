import { defineMongooseModel } from '#nuxt/mongoose';
import { mongoose } from '~/server/db';

const User = defineMongooseModel('User', {
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  picture: String,
  settings: {
    quiz: {
      timeLimitMs: {
        type: Number,
        default: 60000
      },
      attemptsCount: {
        type: Number,
        default: 1
      },
      randomize: {
        type: Boolean,
        default: true
      }
    },
    integrations: {
      slack: {
        accessToken: {
          type: String
        },
        channels: [{ _id: false, id: String, name: String }]
      }
    },
    notifications: {
      slack: {
        channelId: {
          type: String
        }
      }
    }
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

export default User;
