const { getAllEndpoints, getEndpoint } = require('../utils/storage');

const getMonitorStats = (req, res) => {
  try {
    const { userId } = req.params;
    const userEndpoints = getAllEndpoints().filter(ep => ep.userId === userId);

    const stats = {
      totalEndpoints: userEndpoints.length,
      activeEndpoints: userEndpoints.filter(ep => ep.status === 'active').length,
      averageResponseTime: calculateAverageResponseTime(userEndpoints),
      overallUptime: calculateOverallUptime(userEndpoints),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getMonitorHistory = (req, res) => {
  try {
    const { endpointId } = req.params;
    const endpoint = getEndpoint(endpointId);

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    }

    // For MVP, return basic info. In production, store full history in database
    const history = {
      endpointId: endpoint.id,
      endpointName: endpoint.name,
      currentStatus: endpoint.status,
      lastChecked: endpoint.lastChecked,
      responseTime: endpoint.responseTime,
      uptime: endpoint.uptime,
      downtimeCount: endpoint.downtimeCount
    };

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

function calculateAverageResponseTime(endpoints) {
  const responseTimes = endpoints
    .filter(ep => ep.responseTime !== null)
    .map(ep => ep.responseTime);

  if (responseTimes.length === 0) return null;

  const total = responseTimes.reduce((sum, time) => sum + time, 0);
  return total / responseTimes.length;
}

function calculateOverallUptime(endpoints) {
  if (endpoints.length === 0) return 100;

  const totalUptime = endpoints.reduce((sum, ep) => sum + ep.uptime, 0);
  return totalUptime / endpoints.length;
}

module.exports = {
  getMonitorStats,
  getMonitorHistory
};
