# dialogflow-messenger-template

A template Facebook Messenger bot using Typescript, Koa and DialogFlow.

## Overview

This template repo helps you get started running your own Facebook Messenger bot.

A messenger bot has the following architecture:

1. Users talk to and receive messages from Facebook Messenger
2. When a message is sent to your bot, Messenger calls a webhook with the message details
3. This repo is the service that runs that webhook, receiving the message
4. This repo calls Dialogflow to classify the message and propose content to respond with
5. This repo then calls Facebook Messenger's API with a message to respond with

## Getting started

Assuming a MacOS setup, but it can also be done in a Linux environment.

### 1. Clone this repo and install dependencies

You need:

- Developer tools: `xcode-select --install`
- `node`: `brew install node`
- `docker`: `brew cask install docker`

Then you can clone this repo:

`git clone git@github.com:larsyencken/dialogflow-messenger-template mybot`

Try running the unit tests:

```
cd mybot
make test
```

If they pass, the codebase is working. However, you need some extra services configured before it can run.

Inside your bot folder, run:

```
cp .env.example .env
cat .env
```

These are the config settings we'll need before chat can work.

### 2. Create a Facebook developer app

First we need to create a new developer app and a page inside that app:

1. Go to [Facebook Developer Console](https://developers.facebook.com/apps/), register as a developer, and add a new app.
2. Choose "For everything else" as the app category.
3. Click on "Set up" for the Messenger section.
4. Click "Create new page", and give it a name and a category, then click "Save"
5. Go to https://www.facebook.com/pages, find your new page and visit it
6. Click on "Settings" on the left, and then "Messaging"
7. Find "Your Messenger URL", copy the link, then visit that link
8. Click "Continue"

**Milestone:** you can now talk to your page in Messenger, but it will not say anything back. Let's fix that.

Next we need to get a token.

1. Go back to https://developers.facebook.com/apps/ and find your app
2. Click on "Messenger" on the left and "Settings"
3. Under "Access tokens" click "Add or remove pages"
4. Select the page you just created and click "Next", then click "Done", then "OK"
5. Click the "Generate token" button, then "I Understand", then copy the token to your clipboard
6. Edit your `.env` file and set `FACEBOOK_TOKEN=<your token>`
7. Edit your `.env` file and set `FACEBOOK_WEBHOOK_SECRET=supersecret` or another value you choose

**Milestone:** now your bot has the credentials to send messages to users who have begun conversations with it

### 3. Create a Dialogflow agent

Now we need a Dialogflow agent that can understand messages and help us respond to them.

1. Go to https://dialogflow.cloud.google.com/, sign in, and create a new Dialogflow ES agent
2. Click on the settings cog for your agent, then "General" and find your "Project ID". Copy it and save it in `.env` as `DIALOGFLOW_PROJECT_ID`

**Milestone:** Now we have an empty Dialogflow agent. You can say things to it in the Dialogflow console on the top right.

We now need API credentials in order to call it..

1. Go to the [Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) section of the Google Cloud console, pick the project id that you found just earlier
2. Click on "+ Create Service Account" at the top, name your account "dialog" and click "Create"
3. Give your account the role "Dialogflow API Admin", then click "Continue"
4. In the next step, just click "Done"
5. Your will now see your service account, copy the email address and add it to your `.env` file as the setting `DIALOGFLOW_CLIENT_EMAIL`
6. Back in the browser, find the three dots on the right of your service account line, click on them, then click "Create key"
7. Choose "JSON" then "Create"
8. Back in the browser, click "Done". The credentials file will download.
9. Edit the JSON credentials file, find the `private_key` entry and copy its value including the quotes
10. Put this value into your `.env` file as `DIALOGFLOW_PRIVATE_KEY` and save

**Milestone:** your bot is totally configured to act as a server

### 4. Running the dev server

In one terminal, run the webhook service:

```
make serve
```

In another terminal, run the ngrok tunnel:

```
make tunnel
```

Ngrok will give you an HTTPS address which you are now serving, e.g. https://21ba39fd76ae.ngrok.io. Copy this, we will now register it as a webhook with Facebook.

1. Go back to the [Facebook developer console](https://developers.facebook.com/apps/), and find your app
2. Click on Messaging, Settings on the left
3. Find the Webhooks section, and click "Add Callback URL"
4. Paste in your Ngrok URL, plus the route `/facebook`, e.g. https://21ba39fd76ae.ngrok.io/facebook
5. Add as a verify token the contents of `FACEBOOK_VERIFY_TOKEN` in your `.env`, e.g. "supersecret"
6. Click "Verify webhook". If your tunnel or service is not set up, it will fail here. If it is set up, the webhook registration will succeed.
7. Find your page in the webhook section, and click "Add subscriptions"
8. Select only "messages"

**Milestone:** now your entire bot is connected end-to-end with Dialogflow!

### 5. Say something to your bot

Go back to Messenger, and find the conversation you started with your bot. Say "hi". Your bot should say hi back!

### Set up a Facebook Messenger bot

At the end, set `FACEBOOK_WEBHOOK_SECRET` and `FACEBOOK_TOKEN` into your `.env` file.

### Set up a Dialogflow agent

At the end, set `DIALOGFLOW_PROJECT_ID` and `DIALOGFLOW_PRIVATE_KEY` in your `.env` file.

## Developing

### Working with the database

This project uses [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript), check that project for querying.

To create the basic database, run:

```
./bin/sequelize db:create
./bin/sequelize db:migrate
```

To create a new migration, run:

```
./bin/sequelize db:migrate:create my-migration-name
```

Then you edit the file generated in `src/migrations`

## TODO

- [x] Basic TS agent
- [x] Unit tests
- [x] Sequelize with migrations
- [ ] Create a user on first message
- [ ] End-to-end run-through with new Dialogflow agent
- [ ] Full docs on getting set up
