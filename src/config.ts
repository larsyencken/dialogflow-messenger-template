/**
 * Constants and secrets.
 */

const config = {
  FACEBOOK_WEBHOOK_SECRET: process.env.FACEBOOK_WEBHOOK_SECRET || 'testing',
  FACEBOOK_TOKEN: process.env.FACEBOOK_TOKEN,
  DIALOGFLOW_PROJECT_ID: process.env.DIALOGFLOW_PROJECT_ID,
  DIALOGFLOW_PRIVATE_KEY: process.env.DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_CLIENT_EMAIL: process.env.DIALOGFLOW_CLIENT_EMAIL,
};

export default config;
