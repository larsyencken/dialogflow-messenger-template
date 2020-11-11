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

See: [Getting started](doc/getting_started.md) for instructions on setting up your first messenger bot using this template.

## Developing

You can run `make` to see available development commands.

### Testing

`make test`

### Working with the database

This project uses [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript), check that project for examples on querying.

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
- [x] End-to-end run-through with new Dialogflow agent
- [x] Full docs on getting set up
- [ ] Add fulfillment webhook
