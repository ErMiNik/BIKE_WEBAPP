const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/db_ping', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.send('✅ Database connection OK');
  } catch (err) {
    console.error('DB Check failed:', err);
    res.status(500).send('❌ Database connection failed');
  }
});

module.exports = router;
