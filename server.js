import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/fires', async (req, res) => {
  const url = 'https://firms.modaps.eosdis.nasa.gov/mapserver/wfs?service=WFS&request=GetFeature&version=1.1.0&typeName=MODIS_C6_USA_contiguous_and_Hawaii_24h&outputFormat=application/json';
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching fire data:', err);
    res.status(500).json({ error: 'Failed to fetch fire data' });
  }
});

app.get('/api/noaa-alerts', async (req, res) => {
  try {
    const response = await fetch('https://api.weather.gov/alerts/active');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching NOAA alerts:', err);
    res.status(500).json({ error: 'Failed to fetch NOAA alerts' });
  }
});

app.get('/api/canada-alerts', async (req, res) => {
  try {
    const response = await fetch('https://dd.weather.gc.ca/alerts/cap/CA/index_e.xml');
    const xml = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Error fetching Canada alerts:', err);
    res.status(500).json({ error: 'Failed to fetch Canada alerts' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
