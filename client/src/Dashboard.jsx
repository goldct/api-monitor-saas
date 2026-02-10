import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

const API_BASE_URL = 'http://localhost:3000';

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

  const { user } = useAuth(); // We'll get this from AuthContext

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
      const response = await axios.get(`${API_BASE_URL}/api/endpoints/${user.id}`);
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
      const response = await axios.get(`${API_BASE_URL}/monitor/stats/${user.id}`);
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
      const response = await axios.post(`${API_BASE_URL}/api/endpoints`, {
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
      await axios.delete(`${API_BASE_URL}/api/endpoints/${id}`);
      setEndpoints(endpoints.filter(ep => ep.id !== id));
      fetchStats();
      showToast('Endpoint deleted successfully');
    } catch (error) {
      showToast('Failed to delete endpoint', 'error');
      console.error('Error deleting endpoint:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? '🟢 Active' : '🔴 Down';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your endpoints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center gap-3`}>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Endpoint</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📊</span>
                <span className="text-3xl font-bold text-gray-900">{stats.totalEndpoints || 0}</span>
              </div>
              <div className="text-gray-600 text-sm">Total Endpoints</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🟢</span>
                <span className="text-3xl font-bold text-green-600">{stats.activeEndpoints || 0}</span>
              </div>
              <div className="text-gray-600 text-sm">Active</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-3xl font-bold text-blue-600">
                  {stats.averageResponseTime ? `${stats.averageResponseTime}ms` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-600 text-sm">Avg Response</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📈</span>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.overallUptime ? `${stats.overallUptime}%` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-600 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Monitored Endpoints</h2>
            <span className="text-gray-600 text-sm">
              {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-6">
            {endpoints.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600 mb-2">No endpoints monitored yet</p>
                <p className="text-gray-500 text-sm mb-6">
                  Start monitoring your APIs to ensure uptime and performance
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add your first endpoint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {endpoint.status === 'active' ? '🟢' : '🔴'}
                          </span>
                          <div>
                            <h3 className="font-bold text-gray-900">{endpoint.name}</h3>
                            <p className="text-gray-600 text-sm font-mono">{endpoint.url}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {endpoint.method} • Last checked: {new Date(endpoint.last_checked).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium mb-1 ${getStatusColor(endpoint.status)}`}>
                            {getStatusText(endpoint.status)}
                          </div>
                          {endpoint.response_time && (
                            <div className="text-gray-600 text-sm">
                              {endpoint.response_time}ms
                            </div>
                          )}
                          <div className="text-gray-600 text-sm">
                            Uptime: {endpoint.uptime?.toFixed(1)}%
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEndpoint(endpoint.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                        >
                          🗑️
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Endpoint</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddEndpoint} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., API Production"
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  Method
                </label>
                <select
                  id="method"
                  value={newEndpoint.method}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
