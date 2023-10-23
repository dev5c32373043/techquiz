import db from '~/server/db';

export const userAuth = next => async event => {
  const accessToken = getCookie(event, 'accessToken');
  if (!accessToken) {
    throw UnauthorizedError();
  }

  try {
    const token = await db.Token.findOne({ accessToken }).lean();
    if (!token) {
      throw new Error('Token not found');
    }

    const user = await db.User.findOne({ _id: token.userId }).lean();
    if (!user) {
      throw new Error('User not found');
    }

    event.context.currentUser = user;
  } catch (err) {
    logger.error(err);
    throw UnauthorizedError();
  }

  return next(event);
};
