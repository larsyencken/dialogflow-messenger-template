import { Sequelize } from 'sequelize-typescript';

import * as config from './config/config.json';

const db = new Sequelize({
  database: config.development.database,
  dialect: 'mysql',
  username: config.development.username,
  password: config.development.password,
});

db.addModels([__dirname + '/models']);

export default db;
