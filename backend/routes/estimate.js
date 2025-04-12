const express = require('express');
const router = express.Router();
const MaterialCost = require('../models/MaterialCost');

// Basic estimation logic
router.post('/', async (req, res) => {
  const { materials, laborHours, laborRate } = req.body;

  try {
    let totalMaterialCost = 0;
    const materialDetails = [];

    // Loop through materials and calculate the total cost
    for (const item of materials) {
      const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
      if (dbItem) {
        const materialCost = dbItem.rate * item.quantity;
        totalMaterialCost += materialCost;
        materialDetails.push({ name: item.name, value: materialCost });
      } else {
        console.warn(`Material not found in database: ${item.name}`);
      }
    }

    // Calculate labor cost
    const totalLaborCost = laborHours * laborRate;
    const total = totalMaterialCost + totalLaborCost;

    // Return the estimation result with material breakdown
    res.json({
      total,
      breakdown: {
        materials: totalMaterialCost,
        labor: totalLaborCost,
        materialBreakdown: materialDetails,  // Include material breakdown here
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Estimation failed' });
  }
});

module.exports = router;
