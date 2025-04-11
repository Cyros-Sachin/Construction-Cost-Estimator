const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const MaterialCost = sequelize.define('MaterialCost', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

module.exports = MaterialCost;
