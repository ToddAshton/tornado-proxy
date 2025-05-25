const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// NOAA Alerts Proxy
app.get('/api/noaa-alerts', async (req, res) => {
  const response = await fetch('https://api.weather.gov/alerts/active');
  const data = await response.json();
  res.json(data);
});

// Fires Proxy
app.get('/api/fires', async (req, res) => {
  const response = await fetch('https://firms.modaps.eosdis.nasa.gov/mapserver/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=MODIS_C6_USA_contiguous_and_Hawaii_24h&outputFormat=application/json');
  const data = await response.json();
  res.json(data);
});

// Canada Alerts Proxy
app.get('/api/canada-alerts', async (req, res) => {
  const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
  const xml = await response.text();
  res.type('application/xml').send(xml);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
