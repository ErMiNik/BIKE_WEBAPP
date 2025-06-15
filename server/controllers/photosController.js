const pool = require('../db');

exports.getAllPhotos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createPhoto = async (req, res) => {
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
};
