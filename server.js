// server.cjs
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// NOAA alerts
app.get('/api/noaa-alerts', async (req, res) => {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NOAA alerts', details: err.message });
  }
});

// Fire data from NASA FIRMS
app.get('/api/fires', async (req, res) => {
  const url = 'https://firms.modaps.eosdis.nasa.gov/mapserver/wfs?' +
              'service=WFS&request=GetFeature&version=1.1.0' +
              '&typeName=MODIS_C6_USA_contiguous_and_Hawaii_24h' +
              '&outputFormat=application/json';
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fire data', details: err.message });
  }
});

// Canada Alerts (XML)
app.get('/api/canada-alerts', async (req, res) => {
  try {
    const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
    const xml = await response.text();
    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).send('Failed to fetch Canada alerts');
  }
});

app.get('/', (req, res) => {
  res.send('✅ Tornado Proxy is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
