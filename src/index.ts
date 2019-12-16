import app from './app';

const serverless = require('serverless-http');

exports.handler = serverless(app);
