require('dotenv').config();

import app from './app';

const server = app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/');
});

export default server;
