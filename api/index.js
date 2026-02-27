const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const healthRoutes = require('../src/routes/health');
const apiRoutes = require('../src/routes/api');
const monitorRoutes = require('../src/routes/monitor');
const alertRoutes = require('../src/routes/alert');

app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/monitor', monitorRoutes);
app.use('/alert', alertRoutes);

// Start monitoring (runs in background)
const { startMonitoring } = require('../src/utils/monitor');
// Note: cron doesn't work well in serverless, so we'll skip it for Vercel
// startMonitoring();

// Vercel Serverless Function handler
module.exports = app;
