const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - keep the full paths
const healthRoutes = require('../src/routes/health');
const apiRoutes = require('../src/routes/api');
const monitorRoutes = require('../src/routes/monitor');
const alertRoutes = require('../src/routes/alert');

// Vercel routes full path including /api to the handler
// So we mount routes at their expected full paths
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/alert', alertRoutes);

// Also handle paths without /api prefix for backward compatibility
app.use('/monitor', monitorRoutes);
app.use('/alert', alertRoutes);

// Vercel Serverless Function handler
module.exports = app;
