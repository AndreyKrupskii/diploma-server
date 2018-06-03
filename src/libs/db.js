const Sequelize = require('sequelize');
const config = require('./config');
const log = require('./log');

// init database connection
const db = new Sequelize({
  host: process.env.DB_HOST || config.db.host,
  port: process.env.DB_PORT || config.db.port,
  database: process.env.DB_NAME || config.db.database,
  username: process.env.DB_USER_NAME || config.db.username,
  password: process.env.DB_USER_PASSWORD || config.db.password,
  dialect: config.db.dialect,
  operatorsAliases: false,
  logging: false,
});

// test database connection
(async () => {
  try {
    await db.authenticate();
    log.info('Database connection has been established successfully.');
  } catch (e) {
    log.error(e.message, { stack: e.stack });
  }
})();

module.exports = db;
