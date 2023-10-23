import db from '~/server/db';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const { currentUser } = event.context;

  await db.Token.deleteMany({ userId: currentUser._id });

  setCookie(event, 'accessToken', null, {
    secure: true,
    httpOnly: true,
    sameSite: true
  });

  return { ok: true };
};

export default defineEventHandler(userAuth(route));
