const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/exchange-token', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });

    res.json(response.data); // Contains access_token, athlete info, etc.
  } catch (err) {
    console.error('Token exchange error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

router.post('/activity', async (req, res) => {
  const { activityId, accessToken } = req.body;

  if (!activityId || !accessToken) {
    return res.status(400).json({ message: 'Missing activityId or accessToken' });
  }

  try {
    const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error fetching activity:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || 'Failed to fetch activity'
    });
  }
});


module.exports = router;
