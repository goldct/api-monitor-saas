const express = require('express');
const router = express.Router();
const { addApiEndpoint, getApiEndpoints, deleteApiEndpoint } = require('../controllers/apiController');

// Add a new API endpoint to monitor
router.post('/endpoints', addApiEndpoint);

// Get all API endpoints for a user
router.get('/endpoints/:userId', getApiEndpoints);

// Delete an API endpoint
router.delete('/endpoints/:id', deleteApiEndpoint);

module.exports = router;
