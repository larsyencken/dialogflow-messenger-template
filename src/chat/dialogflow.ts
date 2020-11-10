/**
 * Dialogflow middleware for chat.
 */

import uuid from 'uuid';
import df from '@google-cloud/dialogflow';

import { Context } from './bot';
import config from '../config';

interface NLUResult {
  message?: string;
  intent: string;
}

/**
 * Respond to a message using content from dialogflow.
 */
export async function dialogflow(ctx: Context) {
  const result = await detectIntent(ctx.message);
  ctx.intent = result.intent;
  if (result.message) {
    ctx.response = result.message;
  }
}

/**
 * Call dialogflow and get a response.
 */
async function detectIntent(message: string): Promise<NLUResult> {
  if (!config.DIALOGFLOW_PROJECT_ID || !config.DIALOGFLOW_PRIVATE_KEY) {
    throw new Error('you must configure dialogflow settings in .env');
  }
  const sessionId = uuid.v4();

  // make a new session
  const sessionClient = new df.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    config.DIALOGFLOW_PROJECT_ID,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };
  const resp = (await sessionClient.detectIntent(request))[0].queryResult;
  if (resp && resp.intent && resp.intent.displayName) {
    let result: NLUResult = { intent: resp.intent.displayName };
    if (resp.fulfillmentText) {
      result.message = resp.fulfillmentText;
    }
    return result;
  }

  throw new Error('could not respond using dialogflow');
}
