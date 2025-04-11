const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/costs.db',
  logging: false,
});

module.exports = { sequelize };
