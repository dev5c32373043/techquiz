import db from '~/server/db';
import { UpdateProfilePayload } from '~/dto/user';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const { currentUser } = event.context;
  const data = validatePayload(UpdateProfilePayload, await readBody(event));
  const update = {};

  if (data.quiz) {
    update['settings.quiz'] = data.quiz;
  }

  if (data.notifications) {
    update['settings.notifications'] = data.notifications;
  }

  if (Object.keys(update).length > 0) {
    await db.User.updateOne({ _id: currentUser._id }, update);
  }

  return { ok: true };
};

export default defineEventHandler(userAuth(route));
