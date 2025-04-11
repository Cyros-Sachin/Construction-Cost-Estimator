const express = require('express');
const router = express.Router();
const MaterialCost = require('../models/MaterialCost');

// Basic estimation logic
router.post('/', async (req, res) => {
  const { materials, laborHours, laborRate } = req.body;

  try {
    let totalMaterialCost = 0;

    for (const item of materials) {
      const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
      if (dbItem) {
        totalMaterialCost += dbItem.rate * item.quantity;
      }
    }

    const totalLaborCost = laborHours * laborRate;
    const total = totalMaterialCost + totalLaborCost;

    res.json({
      total,
      breakdown: {
        materials: totalMaterialCost,
        labor: totalLaborCost,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Estimation failed' });
  }
});

module.exports = router;
