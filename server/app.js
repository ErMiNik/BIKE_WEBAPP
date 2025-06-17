const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const photosRoutes = require('./routes/photos');
const healthRoutes = require('./routes/health');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // allow requests from frontend
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

app.use('/api/photos', photosRoutes);
app.use('/api', healthRoutes);

module.exports = app;
