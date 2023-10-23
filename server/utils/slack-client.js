import { WebClient } from '@slack/web-api';

export const client_id = process.env.SLACK_CLIENT_ID;
export const client_secret = process.env.SLACK_CLIENT_SECRET;

const client = new WebClient();

export default client;
