/**
 * Handle incoming messages from Facebook and respond to them.
 */

import { detectIntent } from './dialogflow';
import { messenger } from './messenger';
import { FBPage } from './types';

/**
 * The webhook sends us messages in "pages". Handle one full page of messages.
 */
export const handlePage = async (page: FBPage) => {
  if (page.entry) {
    page.entry.forEach((e) => {
      e.messaging.forEach((m) => {
        handleMessage(m.sender.id, m.timestamp, m.message.text);
      });
    });
  }
};

/**
 * Process the message and respond.
 *
 * @param sender PSID of the user who sent the message
 * @param timestamp The time the message was sent
 * @param message The message text itself
 */
async function handleMessage(
  user: string,
  _timestamp: number,
  message: string
): Promise<void> {
  console.log(`Received message "${message}" from ${user}`);

  const sessionId = user;
  const response = await detectIntent(message, sessionId);
  if (response.message) {
    console.log(`Sending message: "${response.message} to ${user}`);
    await messenger.sendSlowly(user, response.message);
  }
}
