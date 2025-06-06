const serverless = require('serverless-http');
const app = require('../../web/index.js');

module.exports.handler = serverless(app); 