import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { API_BASE } from './config';

function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    url: '',
    name: '',
    method: 'GET'
  });
  const [toast, setToast] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchEndpoints();
    fetchStats();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEndpoints = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/endpoints/${user.id}`);
      if (response.data.success) {
        setEndpoints(response.data.data);
      }
    } catch (error) {
      showToast('Failed to fetch endpoints', 'error');
      console.error('Error fetching endpoints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/monitor/stats/${user.id}`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddEndpoint = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/api/endpoints`, {
        userId: user.id,
        url: newEndpoint.url,
        name: newEndpoint.name,
        method: newEndpoint.method
      });

      if (response.data.success) {
        setEndpoints([...endpoints, response.data.data]);
        setShowAddModal(false);
        setNewEndpoint({ url: '', name: '', method: 'GET' });
        fetchStats();
        showToast('Endpoint added successfully');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add endpoint';
      showToast(errorMessage, 'error');
      console.error('Error adding endpoint:', error);
    }
  };

  const handleDeleteEndpoint = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/endpoints/${id}`);
      setEndpoints(endpoints.filter(ep => ep.id !== id));
      fetchStats();
      showToast('Endpoint deleted successfully');
    } catch (error) {
      showToast('Failed to delete endpoint', 'error');
      console.error('Error deleting endpoint:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'border-green-900' : 'border-red-900';
  };

  const getStatusText = (status) => {
    return status === 'active' ? '🟢 Active' : '🔴 Down';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-900 font-medium">Loading your endpoints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 border-2 border-gray-900 bg-white shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'border-green-900' : 'border-red-900'}`}>
          <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
          <span className="font-medium text-gray-900">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-gray-600 hover:text-gray-900 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 text-white px-5 py-2.5 border border-gray-900 hover:bg-gray-800 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <span className="text-lg">+</span>
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📊</span>
                <span className="text-3xl font-bold text-gray-900">{stats.totalEndpoints || 0}</span>
              </div>
              <div className="text-gray-700 text-sm font-medium">Total Endpoints</div>
            </div>
            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🟢</span>
                <span className="text-3xl font-bold text-gray-900">{stats.activeEndpoints || 0}</span>
              </div>
              <div className="text-gray-700 text-sm font-medium">Active</div>
            </div>
            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.averageResponseTime ? `${stats.averageResponseTime}ms` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-700 text-sm font-medium">Avg Response</div>
            </div>
            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📈</span>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.overallUptime ? `${stats.overallUptime}%` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-700 text-sm font-medium">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Monitored Endpoints</h2>
            <span className="text-gray-700 text-sm font-medium">
              {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-6">
            {endpoints.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-7xl mb-6 block">📭</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No endpoints monitored yet</h3>
                <p className="text-gray-700 mb-6 max-w-md mx-auto text-lg">
                  Start monitoring your APIs to ensure uptime and performance.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gray-900 text-white px-8 py-3 border border-gray-900 hover:bg-gray-800 text-lg font-medium transition-colors"
                >
                  Add your first endpoint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border-2 border-gray-200 p-5 hover:border-gray-900 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <span className={`text-3xl ${getStatusColor(endpoint.status)}`}>
                            {endpoint.status === 'active' ? '🟢' : '🔴'}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{endpoint.name}</h3>
                            <p className="text-gray-700 text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg inline-block mt-2">
                              {endpoint.url}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-md font-medium border ${endpoint.method === 'GET' ? 'border-green-900 text-green-900' : endpoint.method === 'POST' ? 'border-blue-900 text-blue-900' : 'border-gray-400 text-gray-700'}`}>
                                {endpoint.method}
                              </span>
                              <span>• Last checked: {new Date(endpoint.lastChecked).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`px-4 py-2 border-2 border rounded-lg text-xs font-bold mb-2 ${getStatusColor(endpoint.status)}`}>
                            {getStatusText(endpoint.status)}
                          </div>
                          <div className="flex flex-col gap-1 text-gray-700 text-sm">
                            {endpoint.responseTime && (
                              <div className="flex items-center gap-1">
                                <span>⚡</span>
                                <span className="font-medium">{endpoint.responseTime}ms</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span>📈</span>
                              <span className="font-medium">Uptime: {endpoint.uptime?.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEndpoint(endpoint.id)}
                          className="text-red-700 hover:text-red-900 hover:bg-red-50 px-4 py-3 border border-red-200 rounded-lg transition-all text-sm font-medium"
                        >
                          Delete
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

      {/* Add Endpoint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-gray-900 rounded-lg p-8 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Endpoint</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddEndpoint} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors"
                  placeholder="e.g., API Production"
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-bold text-gray-900 mb-2">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors font-mono text-sm"
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-bold text-gray-900 mb-2">
                  Method
                </label>
                <select
                  id="method"
                  value={newEndpoint.method}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-gray-900 focus:outline-none transition-colors font-medium"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
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
                  Add Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
