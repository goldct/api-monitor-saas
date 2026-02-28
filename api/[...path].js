const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import controllers
const { addApiEndpoint, getApiEndpoints, deleteApiEndpoint } = require('../src/controllers/apiController');
const { getStats } = require('../src/controllers/monitorController');
const { createAlert, getAlerts, updateAlert, deleteAlert } = require('../src/controllers/alertController');

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Monitor - Health Check',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoints
app.post('/endpoints', addApiEndpoint);
app.get('/endpoints/:userId', getApiEndpoints);
app.delete('/endpoints/:id', deleteApiEndpoint);

// Monitor endpoints
app.get('/monitor/stats/:userId', getStats);

// Alert endpoints
app.get('/alert/:userId', getAlerts);
app.post('/alert', createAlert);
app.put('/alert/:id', updateAlert);
app.delete('/alert/:id', deleteAlert);

// Vercel Serverless Function handler
module.exports = app;
