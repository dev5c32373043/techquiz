import db from '~/server/db';
import googleAuthClient from '~/server/utils/google-auth-client';

import { google } from 'googleapis';

export default defineEventHandler(async event => {
  const { code } = await readBody(event);

  if (!code) {
    throw UnauthorizedError();
  }

  // verify code and get tokens from it
  const [err, result] = await to(googleAuthClient.getToken(code));
  if (err) {
    logger.error(err);
    throw UnauthorizedError();
  }
  // result contains `access_token` and optional `refresh_token`
  // to use these credentials we can save them in the client
  googleAuthClient.setCredentials(result.tokens);

  const googleAPI = google.oauth2({
    auth: googleAuthClient,
    version: 'v2'
  });

  let { data } = await googleAPI.userinfo.get();
  const { id_token, access_token, refresh_token } = result.tokens;
  const tokensUpdate = { idToken: id_token, accessToken: access_token, refreshToken: refresh_token };
  const { email, name, picture } = data;
  const user = await db.User.findOneAndUpdate(
    { email: data.email },
    { $setOnInsert: { email, name, picture } },
    { upsert: true, new: true }
  );

  await db.Token.create({ userId: user._id, ...tokensUpdate });

  setCookie(event, 'accessToken', access_token, {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 90
  });

  return { ok: true };
});
