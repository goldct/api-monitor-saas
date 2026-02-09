const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const healthRoutes = require('./src/routes/health');
const apiRoutes = require('./src/routes/api');
const monitorRoutes = require('./src/routes/monitor');
const alertRoutes = require('./src/routes/alert');

app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/monitor', monitorRoutes);
app.use('/alert', alertRoutes);

// Start monitoring cron job
const { startMonitoring } = require('./src/utils/monitor');
cron.schedule('* * * * *', startMonitoring); // Run every minute

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Monitor Server running on port ${PORT}`);
  console.log(`Monitoring started at: ${new Date().toISOString()}`);
});
