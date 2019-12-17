import app from './app';

const serverless = require('serverless-http');

module.exports.handler = serverless(app);
