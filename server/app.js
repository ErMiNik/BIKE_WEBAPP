const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // allow requests from frontend
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

app.get('/api/db_ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    if (result.rows.length === 1) {
      res.status(200).send('✅ Database connection OK');
    } else {
      res.status(500).send('⚠️ Unexpected database response');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    res.status(500).send('❌ Database connection failed');
  }
});


// GET /api/photos - Fetch all photos
app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/photos - Add a new photo
app.post('/api/photos', async (req, res) => {
  const { path, name, longitude, latitude } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO photos (path, name, longitude, latitude)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [path, name, longitude, latitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
