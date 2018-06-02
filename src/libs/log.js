const path = require('path');
const winston = require('winston');

// define constants
const LOGGING_LEVEL = 'debug';

// define logger
const log = new winston.Logger({
  level: LOGGING_LEVEL,
  transports: [
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  ],
});

module.exports = log;
