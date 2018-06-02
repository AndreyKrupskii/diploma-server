const Sequelize = require('sequelize');
const config = require('./config');
const log = require('./log');

// init database connection
const db = new Sequelize({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
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
