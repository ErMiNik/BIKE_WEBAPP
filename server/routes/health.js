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

router.get('/tables', async(req, res) => {
  try {
    const result = await pool.query(
      `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';`
    );
    res.json(result.rows);
  } catch(err){
    console.log('DB Tables fetch failed:', err);
    res.status(500).send('❌ DB Tables fetch failed')
  }
});

module.exports = router;
