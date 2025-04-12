const express = require('express');
const cors = require('cors');
const { sequelize } = require('../database/sequelize');
const MaterialCost = require('../models/MaterialCost');

// Import routes
const saveRoute = require('../routes/save');
const historyRoute = require('../routes/history');
const estimateRoute = require('../routes/estimate');
const optimizeRoute = require('../routes/optimize');

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// Seed default material rates
const seedMaterials = async () => {
  const materials = [
    { name: 'Cement', unit: 'bag', rate: 370 },
    { name: 'Steel', unit: 'kg', rate: 70 },
    { name: 'Bricks', unit: 'brick', rate: 7 },
    { name: 'TMT Bars', unit: 'kg', rate: 55 },
    { name: 'Fly Ash Cement', unit: 'bag', rate: 300 },
    { name: 'AAC Blocks', unit: 'block', rate: 50 }
  ];

  for (const mat of materials) {
    await MaterialCost.findOrCreate({ where: { name: mat.name }, defaults: mat });
  }
};

// Routes
app.use('/api/estimate', estimateRoute);
app.use('/api/optimize', optimizeRoute);
app.use('/api/save', saveRoute);
app.use('/api/history', historyRoute);

// Sequelize sync
sequelize.sync({ alter: true }).then(() => seedMaterials());

// Export the app as a Vercel handler
const serverless = require('serverless-http');
module.exports = serverless(app);
