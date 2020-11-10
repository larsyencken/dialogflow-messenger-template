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

  async sendMessage(recipient: string, text: string): Promise<void> {
    await this._getClient().sendTextMessage({ id: recipient, text });
    console.log(`Sending message: ${JSON.stringify({ recipient, text })}`);
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

export const messenger = new MessengerClient();
