/**
 * Send messages via Facebook messenger.
 */

import config from './config';
import got from 'got';

const FBMessenger = require('fb-messenger');

class MessengerClient {
  _client: any | undefined;

  _getClient(): any {
    if (!this._client) {
      this._client = new FBMessenger({
        token: config.FACEBOOK_TOKEN,
        notificationType: 'REGULAR',
      });
    }
    return this._client;
  }

  /**
   * Send a text message to the user.
   *
   * @param recipient
   * @param text
   */
  async send(recipient: string, text: string): Promise<void> {
    // NOTE The Facebook API accepts other types of messages too, such as quick-replies.
    await this._getClient().sendTextMessage({ id: recipient, text });
  }

  /**
   * Send a text message to a user in a more human style, using typing indicators and delays.
   */
  async sendSlowly(
    recipient: string,
    text: string,
    delayMs: number = 1000
  ): Promise<void> {
    await this.startTyping(recipient);
    await sleep(delayMs);
    await this.send(recipient, text);
  }

  /**
   * Mark the most recent message in this conversation as seen.
   *
   * @param recipient The PSID of the user we are messaging
   */
  async markSeen(recipient: string): Promise<void> {
    const uri = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.FACEBOOK_TOKEN}`;
    await got.post(uri, {
      json: { recipient: { id: recipient }, sender_action: 'mark_seen' },
      responseType: 'json',
    });
  }

  /**
   * Indicate to the user that the bot is in the process of responding.
   *
   * @param recipient The PSID of the user we are messaging
   */
  async startTyping(recipient: string): Promise<void> {
    const uri = `https://graph.facebook.com/v2.6/me/messages?access_token=${config.FACEBOOK_TOKEN}`;
    await got.post(uri, {
      json: { recipient: { id: recipient }, sender_action: 'typing_on' },
      responseType: 'json',
    });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const messenger = new MessengerClient();
