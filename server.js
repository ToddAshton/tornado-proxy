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

// Fire Data from NASA FIRMS
app.get('/api/fires', async (req, res) => {
  try {
    const response = await fetch(
      'https://firms.modaps.eosdis.nasa.gov/mapserver/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=MODIS_C6_USA_contiguous_and_Hawaii_24h&outputFormat=application/json'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching fire data:', error);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

// Canada Alerts XML
app.get('/api/canada-alerts', async (req, res) => {
  try {
    const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
    const xmlText = await response.text();
    res.type('application/xml').send(xmlText);
  } catch (error) {
    console.error('Error fetching Canada alerts:', error);
    res.status(500).json({ error: 'Failed to fetch Canada alerts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
