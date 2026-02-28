const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let endpoints = [];
let alerts = [];
let monitors = [];

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
app.post('/endpoints', (req, res) => {
  const { userId, url, name, method } = req.body;
  if (!userId || !url || !name) {
    return res.status(400).json({ success: false, error: 'Missing required fields: userId, url, name' });
  }
  const endpoint = {
    id: Date.now(),
    userId,
    url,
    name,
    method: method || 'GET',
    createdAt: new Date().toISOString()
  };
  endpoints.push(endpoint);
  res.json({ success: true, data: endpoint });
});

app.get('/endpoints/:userId', (req, res) => {
  const { userId } = req.params;
  const userEndpoints = endpoints.filter(e => e.userId === userId);
  res.json({ success: true, data: userEndpoints });
});

app.delete('/endpoints/:id', (req, res) => {
  const { id } = req.params;
  endpoints = endpoints.filter(e => e.id !== parseInt(id));
  res.json({ success: true });
});

// Monitor endpoints
app.get('/monitor/stats/:userId', (req, res) => {
  const { userId } = req.params;
  const userEndpoints = endpoints.filter(e => e.userId === userId);
  const stats = {
    totalEndpoints: userEndpoints.length,
    totalChecks: monitors.length,
    successfulChecks: monitors.filter(m => m.status === 'success').length,
    failedChecks: monitors.filter(m => m.status === 'failed').length,
    avgResponseTime: monitors.length > 0
      ? monitors.reduce((sum, m) => sum + m.responseTime, 0) / monitors.length
      : 0
  };
  res.json({ success: true, data: stats });
});

// Alert endpoints
app.get('/alert/:userId', (req, res) => {
  const { userId } = req.params;
  const userAlerts = alerts.filter(a => a.userId === userId);
  res.json({ success: true, data: userAlerts });
});

app.post('/alert', (req, res) => {
  const { userId, endpointId, type, threshold, notificationMethod, notificationTarget } = req.body;
  if (!userId || !endpointId || !type || !threshold || !notificationMethod) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  const alert = {
    id: Date.now(),
    userId,
    endpointId,
    type,
    threshold,
    notificationMethod,
    notificationTarget: notificationTarget || '',
    enabled: true,
    triggeredCount: 0,
    createdAt: new Date().toISOString()
  };
  alerts.push(alert);
  res.json({ success: true, data: alert });
});

app.put('/alert/:id', (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;
  const alert = alerts.find(a => a.id === parseInt(id));
  if (!alert) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }
  if (typeof enabled === 'boolean') {
    alert.enabled = enabled;
  }
  res.json({ success: true, data: alert });
});

app.delete('/alert/:id', (req, res) => {
  const { id } = req.params;
  alerts = alerts.filter(a => a.id !== parseInt(id));
  res.json({ success: true });
});

// Vercel Serverless Function handler
module.exports = app;
