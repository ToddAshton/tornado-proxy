// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());

// NOAA Alerts
app.get('/api/noaa-alerts', async (req, res) => {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching NOAA alerts:', error);
    res.status(500).json({ error: 'Failed to fetch NOAA alerts' });
  }
});

// Canada Alerts
app.get('/api/canada-alerts', async (req, res) => {
  try {
    const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
    const xml = await response.text();
    res.type('application/xml').send(xml);
  } catch (error) {
    console.error('Error fetching Canada alerts:', error);
    res.status(500).json({ error: 'Failed to fetch Canada alerts' });
  }
});

// Fire Alerts from NASA FIRMS with Earthdata Token
app.get('/api/fires', async (req, res) => {
  const token = process.env.EARTHDATA_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing EARTHDATA_TOKEN environment variable' });
  }

  const fireUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/c6.1/geojson/MODIS_C6_1_USA_contiguous_and_Hawaii_24h.geojson?token=${token}`;

  try {
    const response = await fetch(fireUrl);
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('FIRMS API error:', text);
      return res.status(500).json({ error: 'FIRMS API returned non-JSON', response: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching fire data:', error);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
