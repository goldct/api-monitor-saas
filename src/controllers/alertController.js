const { addAlert, getAllAlerts, updateAlert: updateAlertStorage } = require('../utils/storage');

const createAlert = (req, res) => {
  try {
    const { userId, endpointId, type, threshold, notificationMethod, notificationTarget } = req.body;

    if (!userId || !endpointId || !type || !threshold) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const alert = {
      userId,
      endpointId,
      type, // 'response_time', 'status_code', 'uptime'
      threshold,
      enabled: true,
      notificationMethod: notificationMethod || 'email', // 'email', 'slack', 'webhook'
      notificationTarget: notificationTarget || null,
      triggeredCount: 0,
      createdAt: new Date().toISOString()
    };

    const newAlert = addAlert(alert);

    res.status(201).json({
      success: true,
      data: newAlert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAlerts = (req, res) => {
  try {
    const { userId } = req.params;
    const userAlerts = getAllAlerts().filter(alert => alert.userId === userId);

    res.json({
      success: true,
      data: userAlerts,
      count: userAlerts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateAlert = (req, res) => {
  try {
    const { alertId } = req.params;
    const updates = req.body;
    const updatedAlert = updateAlertStorage(alertId, updates);

    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: updatedAlert,
      message: 'Alert updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlert
};
