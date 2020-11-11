/**
 * Dialogflow middleware for chat.
 */

import df from '@google-cloud/dialogflow';

import config from './config';

interface NLUResult {
  message?: string;
  intent: string;
}

/**
 * Have dialogflow classify the intent and get a simplified response back.
 */
export async function detectIntent(
  message: string,
  sessionId: string
): Promise<NLUResult> {
  if (!config.DIALOGFLOW_PROJECT_ID || !config.DIALOGFLOW_PRIVATE_KEY) {
    throw new Error('you must configure dialogflow settings in .env');
  }

  // make a new session
  const sessionClient = new df.SessionsClient({
    credentials: {
      client_email: config.DIALOGFLOW_CLIENT_EMAIL,
      private_key: config.DIALOGFLOW_PRIVATE_KEY,
    },
  });
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
