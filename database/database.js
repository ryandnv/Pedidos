const { Sequelize } = require("sequelize");
require("dotenv").config();

const connection = new Sequelize(
  process.env.DB_NAME || "pedidos",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "202228",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    timezone: process.env.DB_TIMEZONE || "-03:00",
    logging: false
  }
);

module.exports = connection;
