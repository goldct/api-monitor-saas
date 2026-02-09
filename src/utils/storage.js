// Shared storage for in-memory data (replace with database in production)
const apiEndpoints = new Map();
const alerts = new Map();

let endpointIdCounter = 1;
let alertIdCounter = 1;

// API Endpoints
const addEndpoint = (endpoint) => {
  endpoint.id = endpointIdCounter++;
  apiEndpoints.set(endpoint.id, endpoint);
  return endpoint;
};

const getEndpoint = (id) => apiEndpoints.get(parseInt(id));
const getAllEndpoints = () => Array.from(apiEndpoints.values());
const updateEndpoint = (id, updates) => {
  const endpoint = apiEndpoints.get(parseInt(id));
  if (endpoint) {
    const updated = { ...endpoint, ...updates };
    apiEndpoints.set(parseInt(id), updated);
    return updated;
  }
  return null;
};
const deleteEndpoint = (id) => apiEndpoints.delete(parseInt(id));

// Alerts
const addAlert = (alert) => {
  alert.id = alertIdCounter++;
  alerts.set(alert.id, alert);
  return alert;
};

const getAlert = (id) => alerts.get(parseInt(id));
const getAllAlerts = () => Array.from(alerts.values());
const updateAlert = (id, updates) => {
  const alert = alerts.get(parseInt(id));
  if (alert) {
    const updated = { ...alert, ...updates };
    alerts.set(parseInt(id), updated);
    return updated;
  }
  return null;
};

module.exports = {
  // API Endpoints
  addEndpoint,
  getEndpoint,
  getAllEndpoints,
  updateEndpoint,
  deleteEndpoint,

  // Alerts
  addAlert,
  getAlert,
  getAllAlerts,
  updateAlert
};
