import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Pricing from './Pricing';
import Login from './Login';
import Signup from './Signup';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not logged in, show login/signup
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - Public */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">API Monitor</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-4 py-2 rounded-lg hover:bg-gray-100 text-sm ${currentView === 'login' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('signup')}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm ${currentView === 'signup' ? 'ring-2 ring-blue-300' : ''}`}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {currentView === 'login' && <Login />}
          {currentView === 'signup' && <Signup />}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>© 2026 API Monitor. Built with 💰 by Yíng Yíng</p>
            <div className="mt-4 space-x-4">
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Logged in - show full app
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Authenticated */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">API Monitor</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg hover:bg-gray-100 text-sm ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('alerts')}
                className={`px-3 py-2 rounded-lg hover:bg-gray-100 text-sm ${currentView === 'alerts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                Alerts
              </button>
              <button
                onClick={() => setCurrentView('pricing')}
                className={`px-3 py-2 rounded-lg hover:bg-gray-100 text-sm ${currentView === 'pricing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                Pricing
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden md:block">
                {user.email || user.full_name || 'User'}
              </span>
              <button
                onClick={() => setCurrentView('pricing')}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
              >
                Plan: {user.plan || 'Free'}
              </button>
              <button
                onClick={async () => {
                  const auth = useAuth();
                  await auth.logout();
                  setCurrentView('dashboard');
                }}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="dashboard">Dashboard</option>
              <option value="alerts">Alerts</option>
              <option value="pricing">Pricing</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="pb-16">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'alerts' && <Alerts />}
          {currentView === 'pricing' && <Pricing />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>© 2026 API Monitor. Built with 💰 by Yíng Yíng</p>
            <div className="mt-4 space-x-4">
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
              <a href="#" className="hover:text-gray-900">Help</a>
            </div>
          </div>
        </footer>
      </div>
    );
}

export default App;
