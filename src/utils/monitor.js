const axios = require('axios');
const { getAllEndpoints, updateEndpoint, getAllAlerts } = require('./storage');

async function checkEndpoint(endpoint) {
  const startTime = Date.now();

  try {
    const response = await axios({
      method: endpoint.method || 'GET',
      url: endpoint.url,
      headers: endpoint.headers || {},
      timeout: 10000, // 10 second timeout
      validateStatus: () => true // Don't throw on status codes
    });

    const responseTime = Date.now() - startTime;
    const isUp = response.status >= 200 && response.status < 300;

    // Update endpoint stats
    endpoint.lastChecked = new Date().toISOString();
    endpoint.responseTime = responseTime;

    if (isUp) {
      endpoint.status = 'active';
    } else {
      endpoint.status = 'down';
      endpoint.downtimeCount++;
    }

    // Calculate uptime
    const totalChecks = endpoint.downtimeCount + 1;
    endpoint.uptime = ((totalChecks - endpoint.downtimeCount) / totalChecks) * 100;

    // Save updates
    updateEndpoint(endpoint.id, endpoint);

    // Check for alerts
    checkAlerts(endpoint);

    return {
      success: true,
      endpointId: endpoint.id,
      responseTime,
      status: response.status,
      isUp
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    endpoint.lastChecked = new Date().toISOString();
    endpoint.responseTime = responseTime;
    endpoint.status = 'down';
    endpoint.downtimeCount++;

    // Update uptime
    const totalChecks = endpoint.downtimeCount + 1;
    endpoint.uptime = ((totalChecks - endpoint.downtimeCount) / totalChecks) * 100;

    // Save updates
    updateEndpoint(endpoint.id, endpoint);

    // Check for alerts
    checkAlerts(endpoint);

    return {
      success: false,
      endpointId: endpoint.id,
      responseTime,
      error: error.message
    };
  }
}

function checkAlerts(endpoint) {
  // Find all alerts for this endpoint
  const endpointAlerts = getAllAlerts()
    .filter(alert => alert.endpointId === endpoint.id && alert.enabled);

  endpointAlerts.forEach(alert => {
    let shouldTrigger = false;
    let message = '';

    switch (alert.type) {
      case 'response_time':
        if (endpoint.responseTime > alert.threshold) {
          shouldTrigger = true;
          message = `Response time ${endpoint.responseTime}ms exceeds threshold ${alert.threshold}ms`;
        }
        break;
      case 'status_code':
        if (endpoint.status === 'down') {
          shouldTrigger = true;
          message = `Endpoint is down`;
        }
        break;
      case 'uptime':
        if (endpoint.uptime < alert.threshold) {
          shouldTrigger = true;
          message = `Uptime ${endpoint.uptime.toFixed(2)}% below threshold ${alert.threshold}%`;
        }
        break;
    }

    if (shouldTrigger) {
      triggerAlert(alert, message);
    }
  });
}

function triggerAlert(alert, message) {
  alert.triggeredCount++;
  console.log(`[ALERT] ${new Date().toISOString()} - ${message}`);

  // In production, send actual notifications
  switch (alert.notificationMethod) {
    case 'email':
      // Send email via SMTP or email service API
      console.log(`Sending email to ${alert.notificationTarget}: ${message}`);
      break;
    case 'slack':
      // Send to Slack webhook
      console.log(`Sending Slack notification: ${message}`);
      break;
    case 'webhook':
      // Send POST to webhook URL
      console.log(`Sending webhook to ${alert.notificationTarget}: ${message}`);
      break;
  }
}

async function startMonitoring() {
  console.log(`[MONITOR] Starting monitoring cycle at ${new Date().toISOString()}`);

  const endpoints = getAllEndpoints();

  if (endpoints.length === 0) {
    console.log('[MONITOR] No endpoints to monitor');
    return;
  }

  const results = await Promise.all(
    endpoints.map(endpoint => checkEndpoint(endpoint))
  );

  console.log(`[MONITOR] Checked ${endpoints.length} endpoints`);

  const activeCount = results.filter(r => r.success).length;
  const downCount = results.filter(r => !r.success).length;

  console.log(`[MONITOR] Active: ${activeCount}, Down: ${downCount}`);
}

module.exports = {
  startMonitoring
};
