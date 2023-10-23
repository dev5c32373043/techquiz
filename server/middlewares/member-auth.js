import db from '~/server/db';

export const memberAuth = next => async event => {
  const accessToken = getRouterParam(event, 'accessToken');
  // userDeviceId is relatively unique identifier of user's device gained by fingerprintjs
  const userDeviceId = getCookie(event, 'userDeviceId');
  const query = {
    accessToken,
    $or: [{ userDeviceId }, { userDeviceId: { $exists: false } }]
  };

  const [fetchErr, link] = await to(db.QuizLink.findOne(query).lean());
  if (fetchErr || !link) {
    if (fetchErr) {
      logger.error(fetchErr);
    }

    throw QuizNotFoundError();
  }

  event.context.userDeviceId = userDeviceId;
  event.context.currentLink = link;
  return next(event);
};
