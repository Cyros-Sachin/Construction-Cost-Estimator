const express = require('express');
const router = express.Router();
const Estimation = require('../models/Estimation');

router.post('/', async (req, res) => {
  try {
    const saved = await Estimation.create(req.body);
    res.json({ message: 'Saved', estimation: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving estimation' });
  }
});

module.exports = router;
