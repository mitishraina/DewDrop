const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('server started');
});

app.get('/start', (req, res) => {
  // res.send('start initiated');
  console.log('start initiated');
});

app.get('/stop', (req, res) => {
  // res.send('stop initiated');
  console.log('stop initiated');
});

let sensorData = {
    ph: [],
    tds: []
};


app.post('/api/sensor-data', (req, res) => {
    const { ph, tds } = req.body;
    
    if (typeof ph !== 'number' || typeof tds !== 'number') {
        return res.status(400).json({ error: 'Invalid sensor data format' });
    }

    const timestamp = new Date().toISOString();
    sensorData.ph.push({ value: ph, timestamp });
    sensorData.tds.push({ value: tds, timestamp });

    console.log(`Received sensor data - pH: ${ph}, TDS: ${tds}`);
    res.status(200).json({ message: 'Data received successfully' });
});

app.get('/api/sensor-data', async(req, res) => {
    await res.json(sensorData);
});

app.get('/api/fog-density', async (req, res) => {
  try {
      const response = await fetch('http://localhost:5000/api/fog-density');
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching fog density:', error);
      res.status(500).json({ error: 'Failed to fetch fog density data' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
