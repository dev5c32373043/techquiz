import db from '~/server/db';
import slackClient, { client_id, client_secret } from '~/server/utils/slack-client';
import { userAuth } from '~/server/middlewares';

const route = async event => {
  const { code } = getQuery(event);
  const { currentUser } = event.context;

  try {
    const result = await slackClient.oauth.v2.access({ client_id, client_secret, code });
    if (!result.ok) {
      throw new Error('Request to Slack failed', { cause: result });
    }

    const accessToken = result.access_token;
    const fetchResult = await slackClient.conversations.list({ token: accessToken });

    const channels = fetchResult.channels.map(({ id, name }) => ({ id, name }));
    await db.User.updateOne({ _id: currentUser._id }, { 'settings.integrations.slack': { accessToken, channels } });
  } catch (err) {
    logger.error(err);
  }

  await sendRedirect(event, '/settings', 302);
};

export default defineEventHandler(userAuth(route));
