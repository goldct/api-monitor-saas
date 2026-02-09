const express = require('express');
const router = express.Router();
const { getMonitorStats, getMonitorHistory } = require('../controllers/monitorController');

// Get real-time monitoring statistics
router.get('/stats/:userId', getMonitorStats);

// Get monitoring history for an endpoint
router.get('/history/:endpointId', getMonitorHistory);

module.exports = router;
