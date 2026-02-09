const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, updateAlert } = require('../controllers/alertController');

// Create a new alert
router.post('/', createAlert);

// Get all alerts for a user
router.get('/:userId', getAlerts);

// Update alert settings
router.put('/:alertId', updateAlert);

module.exports = router;
