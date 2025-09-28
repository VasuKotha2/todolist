const pino = require('pino');
const pinoHttp = require('pino-http');

function createLogger(opts = {}) {
  const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
  return pinoHttp({ logger, ...opts });
}

module.exports = { createLogger };
