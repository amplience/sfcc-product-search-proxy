import app from './app.js';

const serverless = require('serverless-http');

exports.handler = serverless(app);
