/**
 * Handle incoming messages from Facebook and respond to them.
 */

import { chatBot } from './chat';
import { Context } from './chat/bot';

interface FBPerson {
  id: string;
}

interface FBMessage {
  mid: string;
  text: string;
}

interface FBMessageEvent {
  sender: FBPerson;
  recipient: FBPerson;
  timestamp: number;
  message: FBMessage;
}

interface FBEvent {
  id: string;
  time: number;
  messaging: Array<FBMessageEvent>;
}

export interface FBPage {
  object: string;
  entry: Array<FBEvent>;
}

/**
 * The webhook sends us messages in "pages". Handle one full page of messages.
 */
export const handlePage = async (page: FBPage) => {
  if (page.entry) {
    page.entry.forEach(e => {
      e.messaging.forEach(m => {
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
  sender: string,
  _timestamp: number,
  message: string
): Promise<void> {
  const ctx: Context = { user: sender, message };
  console.log(`--> ${ctx.message}`);
  await next();
  if (ctx.response) {
    console.log(`<-- ${ctx.response}`);
  }
  await chatBot.handle({ message, user: sender });
}
