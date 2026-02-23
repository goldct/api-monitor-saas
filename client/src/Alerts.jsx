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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <h1 className="text-xl font-bold text-gray-900">Alerts</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-5 py-2.5 border border-gray-900 hover:bg-gray-800 text-sm font-medium transition-colors"
          >
            + Create Alert
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Alerts</h2>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-7xl mb-6 block">🔕</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No alerts configured</h3>
                <p className="text-gray-700 mb-6 max-w-md mx-auto text-lg">
                  Create alerts to get notified when your APIs go down or slow down.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gray-900 text-white px-8 py-3 border border-gray-900 hover:bg-gray-800 text-lg font-medium transition-colors"
                >
                  Create your first alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border-2 border-gray-200 p-5 hover:border-gray-900 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <span className={`text-3xl ${alert.enabled ? 'bg-green-50' : 'bg-gray-100'} rounded-lg inline-block w-14 h-14 flex items-center justify-center`}>
                            {alert.enabled ? '🔔' : '🔕'}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">
                                {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.enabled ? 'bg-green-50 text-green-900' : 'bg-gray-100 text-gray-800'}`}>
                                {alert.enabled ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              Threshold: <span className="font-bold">{alert.threshold}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                              <span>📧</span>
                              <span className="font-medium">{alert.notificationMethod}</span>
                              {alert.notificationTarget && (
                                <span>• {alert.notificationTarget}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-gray-700 text-sm mb-1">
                            Triggered: <span className="font-bold text-gray-900">{alert.triggeredCount}</span> times
                          </div>
                          <div className="text-gray-600 text-sm">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAlert(alert.id, !alert.enabled)}
                          className={`px-4 py-3 border rounded-xl font-medium transition-colors ${alert.enabled 
                            ? 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100' 
                            : 'border-green-900 bg-green-50 text-green-700 hover:bg-green-100'}`}
                        >
                          {alert.enabled ? '⏸️ Disable' : '▶️ Enable'}
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
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-gray-900 rounded-lg p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Alert</h2>
            <form onSubmit={handleAddAlert} className="space-y-5">
              <div>
                <label htmlFor="endpointId" className="block text-sm font-bold text-gray-900 mb-2">
                  Endpoint ID
                </label>
                <input
                  id="endpointId"
                  type="text"
                  required
                  value={newAlert.endpointId}
                  onChange={(e) => setNewAlert({ ...newAlert, endpointId: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors font-mono text-sm"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-bold text-gray-900 mb-2">
                  Alert Type
                </label>
                <select
                  id="type"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors font-medium"
                >
                  <option value="response_time">Response Time</option>
                  <option value="status_code">Status Code</option>
                  <option value="uptime">Uptime</option>
                </select>
              </div>
              <div>
                <label htmlFor="threshold" className="block text-sm font-bold text-gray-900 mb-2">
                  Threshold
                </label>
                <input
                  id="threshold"
                  type="number"
                  required
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors"
                  placeholder="e.g., 1000 (ms or %)"
                />
              </div>
              <div>
                <label htmlFor="notificationMethod" className="block text-sm font-bold text-gray-900 mb-2">
                  Notification Method
                </label>
                <select
                  id="notificationMethod"
                  value={newAlert.notificationMethod}
                  onChange={(e) => setNewAlert({ ...newAlert, notificationMethod: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors font-medium"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
              <div>
                <label htmlFor="notificationTarget" className="block text-sm font-bold text-gray-900 mb-2">
                  Notification Target
                </label>
                <input
                  id="notificationTarget"
                  type="text"
                  value={newAlert.notificationTarget}
                  onChange={(e) => setNewAlert({ ...newAlert, notificationTarget: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors"
                  placeholder="e.g., email@example.com or https://hooks.slack.com/..."
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white px-4 py-3 border-2 border-gray-900 hover:bg-gray-800 font-medium transition-colors"
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
