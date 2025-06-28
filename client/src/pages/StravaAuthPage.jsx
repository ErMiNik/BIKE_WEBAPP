import React, { useEffect, useState } from 'react';
import axios from 'axios';

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';

const StravaAuthPage = () => {
  const [token, setToken] = useState(localStorage.getItem('strava_token'));
  const [athlete, setAthlete] = useState(null);

  const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;

  // If user was redirected back with code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {
      axios.post('http://localhost:5000/api/strava/exchange-token', { code })
        .then(res => {
          const accessToken = res.data.access_token;
          localStorage.setItem('strava_token', accessToken);
          setToken(accessToken);
          window.history.replaceState({}, '', '/'); // Clean the URL
        })
        .catch(err => {
          console.error('Failed to exchange token:', err);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.get('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setAthlete(res.data))
        .catch(err => console.error('Failed to fetch athlete:', err));
    }
  }, [token]);

  const handleLogin = () => {
    const url = `${STRAVA_AUTH_URL}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`;
    window.location.href = url;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Strava Auth Integration</h1>
      {!token ? (
        <button onClick={handleLogin}>Connect with Strava</button>
      ) : athlete ? (
        <>
          <p><strong>Welcome:</strong> {athlete.firstname} {athlete.lastname}</p>
          <p><strong>Username:</strong> {athlete.username}</p>
          <button onClick={() => {
            localStorage.removeItem('strava_token');
            setToken(null);
            setAthlete(null);
          }}>Log Out</button>
        </>
      ) : (
        <p>Loading athlete profile...</p>
      )}
    </div>
  );
};

export default StravaAuthPage;
