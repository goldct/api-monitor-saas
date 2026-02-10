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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading your endpoints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transform animate-slide-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="hover:opacity-75 transition-opacity ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📊</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <span className="text-lg">+</span>
            <span>Add Endpoint</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.totalEndpoints || 0}</span>
              </div>
              <div className="text-gray-600 text-sm font-medium">Total Endpoints</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🟢</span>
                </div>
                <span className="text-3xl font-bold text-green-600">{stats.activeEndpoints || 0}</span>
              </div>
              <div className="text-gray-600 text-sm font-medium">Active</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-3xl font-bold text-blue-600">
                  {stats.averageResponseTime ? `${stats.averageResponseTime}ms` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-600 text-sm font-medium">Avg Response</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.overallUptime ? `${stats.overallUptime}%` : 'N/A'}
                </span>
              </div>
              <div className="text-gray-600 text-sm font-medium">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Monitored Endpoints</h2>
              <span className="text-gray-600 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="p-6">
            {endpoints.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">📭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No endpoints monitored yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start monitoring your APIs to ensure uptime and performance. Get instant alerts when something goes wrong.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Add your first endpoint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${endpoint.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {endpoint.status === 'active' ? '🟢' : '🔴'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{endpoint.name}</h3>
                            <p className="text-gray-600 text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block mt-1">
                              {endpoint.url}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-md font-medium ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' : endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                {endpoint.method}
                              </span>
                              <span>• Last checked: {new Date(endpoint.lastChecked).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`px-4 py-2 rounded-xl text-xs font-bold mb-2 ${getStatusColor(endpoint.status)}`}>
                            {getStatusText(endpoint.status)}
                          </div>
                          <div className="flex flex-col gap-1 text-gray-600 text-sm">
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
                          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 px-4 py-3 rounded-xl transition-all font-medium"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Endpoint</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-900 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddEndpoint} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., API Production"
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-bold text-gray-700 mb-2">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-bold text-gray-700 mb-2">
                  Method
                </label>
                <select
                  id="method"
                  value={newEndpoint.method}
                  onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
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
                  className="flex-1 border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all"
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
