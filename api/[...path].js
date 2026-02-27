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

// Vercel Serverless Function handler
module.exports = (req, res) => {
  app(req, res);
};
