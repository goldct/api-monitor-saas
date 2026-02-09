const { addEndpoint, getAllEndpoints, updateEndpoint, deleteEndpoint, getAllAlerts } = require('../utils/storage');

const addApiEndpoint = (req, res) => {
  try {
    const { userId, url, name, method, headers } = req.body;

    if (!userId || !url || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, url, name'
      });
    }

    const endpoint = {
      userId,
      url,
      name,
      method: method || 'GET',
      headers: headers || {},
      status: 'active',
      createdAt: new Date().toISOString(),
      lastChecked: null,
      responseTime: null,
      uptime: 100,
      downtimeCount: 0
    };

    const newEndpoint = addEndpoint(endpoint);

    res.status(201).json({
      success: true,
      data: newEndpoint,
      message: 'API endpoint added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getApiEndpoints = (req, res) => {
  try {
    const { userId } = req.params;
    const userEndpoints = getAllEndpoints().filter(ep => ep.userId === userId);

    res.json({
      success: true,
      data: userEndpoints,
      count: userEndpoints.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteApiEndpoint = (req, res) => {
  try {
    const { id } = req.params;
    deleteEndpoint(id);

    res.json({
      success: true,
      message: 'API endpoint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  addApiEndpoint,
  getApiEndpoints,
  deleteApiEndpoint
};
