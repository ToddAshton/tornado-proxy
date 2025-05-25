// server.js - Proxy for Tornado/Weather Map APIs
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/noaa-alerts', async (req, res) => {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NOAA alerts' });
  }
});

app.get('/api/fires', async (req, res) => {
  try {
    const response = await fetch('https://firms.modaps.eosdis.nasa.gov/mapserver/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=MODIS_C6_USA_contiguous_and_Hawaii_24h&outputFormat=application/json');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

app.get('/api/canada-alerts', async (req, res) => {
  try {
    const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
    const text = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Canada alerts' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
