// backend/models/Estimation.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const Estimation = sequelize.define('Estimation', {
  materials: {
    type: DataTypes.JSON,
    allowNull: false
  },
  laborHours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  laborRate: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  optimizedTotal: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  suggestions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  breakdown: {
    type: DataTypes.JSON,
    allowNull: true  // <-- set to true to avoid sync issues
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Estimation;
