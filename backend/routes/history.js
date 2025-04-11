const express = require('express');
const router = express.Router();
const Estimation = require('../models/Estimation');

// GET /api/history
router.get('/', async (req, res) => {
  try {
    const history = await Estimation.findAll({
      order: [['date', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch estimation history' });
  }
});

module.exports = router;
