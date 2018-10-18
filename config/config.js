require('dotenv').config();
const { castSQLLoggingBoolean } = require('../lib/utility');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    logging: castSQLLoggingBoolean(process.env.SQL_LOGGING),
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.DB_HOST,
    logging: castSQLLoggingBoolean(process.env.SQL_LOGGING),
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    logging: castSQLLoggingBoolean(process.env.SQL_LOGGING),
    dialect: 'postgres'
  }
};
