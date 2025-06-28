import React, { useState } from 'react';
import axios from 'axios';

const ActivityFetcher = () => {
  const [activityId, setActivityId] = useState('');
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setActivity(null);

    const token = localStorage.getItem('strava_token');
    if (!token) {
      setError('You must authenticate with Strava first.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/strava/activity', {
        activityId,
        accessToken: token
      });

      setActivity(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch activity.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Fetch Strava Activity by ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Activity ID"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Fetch Activity
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {activity && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{activity.name}</h3>
          <p><strong>Distance:</strong> {activity.distance / 1000} km</p>
          <p><strong>Moving Time:</strong> {activity.moving_time / 60} min</p>
          <p><strong>Type:</strong> {activity.type}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFetcher;
