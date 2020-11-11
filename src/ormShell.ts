/**
 * Import the ORM and run a node REPL.
 */
require('dotenv').config();
const repl = require('repl');

// load the ORM
const db = require('./db').default;

console.log('Welcome to the Grace DB repl');
console.log('e.g. let user = await db.models.User.findOne()');
repl.start('> ').context.db = db;
