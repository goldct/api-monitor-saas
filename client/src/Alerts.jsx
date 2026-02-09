import { useState, useEffect } from 'react';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    endpointId: '',
    type: 'response_time',
    threshold: 1000,
    notificationMethod: 'email',
    notificationTarget: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      const response = await fetch(`http://localhost:3000/alert/${userId}`);
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || 'demo-user';
      const response = await fetch('http://localhost:3000/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          endpointId: newAlert.endpointId,
          type: newAlert.type,
          threshold: newAlert.threshold,
          notificationMethod: newAlert.notificationMethod,
          notificationTarget: newAlert.notificationTarget
        })
      });

      const data = await response.json();
      if (data.success) {
        setAlerts([...alerts, data.data]);
        setShowAddModal(false);
        setNewAlert({
          endpointId: '',
          type: 'response_time',
          threshold: 1000,
          notificationMethod: 'email',
          notificationTarget: ''
        });
      }
    } catch (error) {
      console.error('Error adding alert:', error);
    }
  };

  const toggleAlert = async (alertId, enabled) => {
    try {
      await fetch(`http://localhost:3000/alert/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, enabled } : a));
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🔔</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Alerts</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Create Alert
          </button>
        </div>
      </header>

      {/* Alerts List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Your Alerts</h2>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔕</div>
                <p>No alerts configured</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${alert.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {alert.enabled ? '🔔 Enabled' : '🔕 Disabled'}
                          </span>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {alert.type.replace('_', ' ')} Alert
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Threshold: {alert.threshold}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Method: {alert.notificationMethod} • Target: {alert.notificationTarget || 'Not set'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-gray-600 text-sm">
                            Triggered: {alert.triggeredCount} times
                          </div>
                          <div className="text-gray-500 text-sm">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAlert(alert.id, !alert.enabled)}
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          {alert.enabled ? '⏸️' : '▶️'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Alert</h2>
            <form onSubmit={handleAddAlert}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newAlert.endpointId}
                    onChange={(e) => setNewAlert({ ...newAlert, endpointId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Type
                  </label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="response_time">Response Time</option>
                    <option value="status_code">Status Code</option>
                    <option value="uptime">Uptime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 1000 (ms or %)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Method
                  </label>
                  <select
                    value={newAlert.notificationMethod}
                    onChange={(e) => setNewAlert({ ...newAlert, notificationMethod: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="email">Email</option>
                    <option value="slack">Slack</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Target
                  </label>
                  <input
                    type="text"
                    value={newAlert.notificationTarget}
                    onChange={(e) => setNewAlert({ ...newAlert, notificationTarget: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., email@example.com or https://hooks.slack.com/..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
