const { Sequelize } = require("sequelize");
require("dotenv").config();


const sequelize = new Sequelize(
  process.env.DB_NAME || "store_rating_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Sanket@2001",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: console.log, // Log SQL queries for debugging
  }
);


module.exports = sequelize;
