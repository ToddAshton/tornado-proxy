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

// Fire Alerts - Using FIRMS GeoJSON with Bearer Token
app.get('/api/fires', async (req, res) => {
  const token = process.env.EARTHDATA_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing EARTHDATA_TOKEN environment variable' });
  }

  try {
    const response = await fetch('https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6.1/geojson/MODIS_C6_1_USA_contiguous_and_Hawaii_24h.geojson', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching fire data:', error.message);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
