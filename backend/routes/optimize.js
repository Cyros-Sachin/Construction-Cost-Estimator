const express = require('express');
const router = express.Router();
const MaterialCost = require('../models/MaterialCost');


router.post('/', async (req, res) => {
    const { materials, laborHours, laborRate } = req.body;
    let optimized = JSON.parse(JSON.stringify(materials));
    let suggestions = [];

    for (let item of optimized) {
        const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
        
        // Your suggestions logic
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

    // Save suggestions in Estimation model
    try {
        // Calculate costs
        let totalMaterialCost = 0;
        for (const item of optimized) {
            const dbItem = await MaterialCost.findOne({ where: { name: item.name } });
            if (dbItem) {
                totalMaterialCost += dbItem.rate * item.quantity;
            }
        }

        const totalLaborCost = laborHours * laborRate;
        const total = totalMaterialCost + totalLaborCost;

        // Save to Estimation table
        const newEstimation = await Estimation.create({
            materials: optimized,
            laborHours: laborHours,
            laborRate: laborRate,
            total: total,
            optimizedTotal: total,
            suggestions: suggestions, // Save suggestions here
            breakdown: {
                materials: totalMaterialCost,
                labor: totalLaborCost
            }
        });

        // Respond with the updated estimation
        res.json({
            optimizedMaterials: optimized,
            optimizedLaborHours: laborHours,
            optimizedTotal: total,
            suggestions: suggestions,
            breakdown: {
                materials: totalMaterialCost,
                labor: totalLaborCost
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save estimation' });
    }
});

module.exports = router;
