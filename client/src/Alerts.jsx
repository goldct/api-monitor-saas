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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🔔</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Alerts
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-red-600 font-medium shadow-md hover:shadow-lg transition-all"
          >
            + Create Alert
          </button>
        </div>
      </header>

      {/* Alerts List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <h2 className="text-xl font-bold text-gray-900">Your Alerts</h2>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">🔕</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No alerts configured</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create alerts to get notified when your APIs go down or slow down. Stay informed and react quickly.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Create your first alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${alert.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {alert.enabled ? '🔔' : '🔕'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">
                                {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {alert.enabled ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Threshold: <span className="font-bold">{alert.threshold}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <span>📧</span>
                                <span className="font-medium">{alert.notificationMethod}</span>
                              </span>
                              {alert.notificationTarget && (
                                <span>• {alert.notificationTarget}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-gray-600 text-sm mb-1">
                            Triggered: <span className="font-bold text-gray-900">{alert.triggeredCount}</span> times
                          </div>
                          <div className="text-gray-500 text-sm">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAlert(alert.id, !alert.enabled)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${alert.enabled 
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Alert</h2>
            <form onSubmit={handleAddAlert} className="space-y-5">
              <div>
                <label htmlFor="endpointId" className="block text-sm font-bold text-gray-700 mb-2">
                  Endpoint ID
                </label>
                <input
                  id="endpointId"
                  type="text"
                  required
                  value={newAlert.endpointId}
                  onChange={(e) => setNewAlert({ ...newAlert, endpointId: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-2">
                  Alert Type
                </label>
                <select
                  id="type"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                >
                  <option value="response_time">Response Time</option>
                  <option value="status_code">Status Code</option>
                  <option value="uptime">Uptime</option>
                </select>
              </div>
              <div>
                <label htmlFor="threshold" className="block text-sm font-bold text-gray-700 mb-2">
                  Threshold
                </label>
                <input
                  id="threshold"
                  type="number"
                  required
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="e.g., 1000 (ms or %)"
                />
              </div>
              <div>
                <label htmlFor="notificationMethod" className="block text-sm font-bold text-gray-700 mb-2">
                  Notification Method
                </label>
                <select
                  id="notificationMethod"
                  value={newAlert.notificationMethod}
                  onChange={(e) => setNewAlert({ ...newAlert, notificationMethod: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
              <div>
                <label htmlFor="notificationTarget" className="block text-sm font-bold text-gray-700 mb-2">
                  Notification Target
                </label>
                <input
                  id="notificationTarget"
                  type="text"
                  value={newAlert.notificationTarget}
                  onChange={(e) => setNewAlert({ ...newAlert, notificationTarget: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="e.g., email@example.com or https://hooks.slack.com/..."
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 font-medium shadow-md hover:shadow-lg transition-all"
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
