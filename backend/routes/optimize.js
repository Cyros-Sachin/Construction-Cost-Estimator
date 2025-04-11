const express = require('express');
const router = express.Router();
const MaterialCost = require('../models/MaterialCost');

router.post('/', async (req, res) => {
    const { materials, laborHours, laborRate } = req.body;
    let optimized = JSON.parse(JSON.stringify(materials));
    let suggestions = [];

    for (let item of optimized) {
        const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
        // Smart suggestions based on quantity + price
        if (item.name === 'Bricks' && item.quantity > 1000) {
            const alt = await MaterialCost.findOne({ where: { name: 'AAC Blocks' } });
            if (alt && alt.rate < dbItem.rate * 1.1) {
                item.name = 'AAC Blocks';
                suggestions.push('Replaced Bricks with AAC Blocks for cost + insulation efficiency');
            }
        }

        if (item.name === 'Steel' && item.quantity > 300 && dbItem.rate > 65) {
            const alt = await MaterialCost.findOne({ where: { name: 'TMT Bars' } });
            if (alt) {
                item.name = 'TMT Bars';
                suggestions.push('Replaced Steel with TMT Bars (more efficient & cheaper)');
            }
        }

        // Suggest cheaper cement
        if (item.name === 'Cement' && dbItem.rate > 350) {
            const alt = await MaterialCost.findOne({ where: { name: 'Fly Ash Cement' } });
            if (alt) {
                item.name = 'Fly Ash Cement';
                suggestions.push(`Replaced Cement with Fly Ash Cement`);
            }
        }
    }

    // Reduce labor hours if too high
    let newLaborHours = laborHours;
    if (laborHours > 40) {
        newLaborHours = Math.round(laborHours * 0.9);
        suggestions.push(`Reduced labor hours by using prefabricated components`);
    }

    // Recalculate
    let totalMaterialCost = 0;
    for (const item of optimized) {
        const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
        if (dbItem) {
            totalMaterialCost += dbItem.rate * item.quantity;
        }
    }

    const totalLaborCost = newLaborHours * laborRate;
    const total = totalMaterialCost + totalLaborCost;

    res.json({
        optimizedMaterials: optimized,
        optimizedLaborHours: newLaborHours,
        optimizedTotal: total,
        suggestions,
        breakdown: {
            materials: totalMaterialCost,
            labor: totalLaborCost
        }
    });
});

module.exports = router;
