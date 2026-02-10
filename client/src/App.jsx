import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Pricing from './Pricing';
import Login from './Login';
import Signup from './Signup';

function App() {
  const { user, loading, logout } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header - Public */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📊</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                API Monitor
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-5 py-2.5 rounded-xl hover:bg-gray-100 text-sm font-medium transition-all ${currentView === 'login' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('signup')}
                className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transition-all ${currentView === 'signup' ? 'ring-2 ring-blue-300' : ''}`}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        {currentView !== 'login' && currentView !== 'signup' && (
          <>
            <div className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center">
                <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  ✨ Monitor your APIs in real-time
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Never let your API
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> go down</span>
                  again
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Monitor your APIs, get instant alerts, and keep your services running smoothly.
                  Start for free, scale as you grow.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1"
                  >
                    Get Started Free →
                  </button>
                  <button
                    className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    See Pricing
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mt-20">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Monitoring</h3>
                  <p className="text-gray-600">Monitor your APIs every 60 seconds and get instant status updates.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Alerts</h3>
                  <p className="text-gray-600">Get notified via email when your API goes down or slows down.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Analytics</h3>
                  <p className="text-gray-600">Track response times, uptime, and performance trends over time.</p>
                </div>
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
                <p className="text-gray-600">Start free, upgrade when you need more</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Free</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-base text-gray-600 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-gray-600">
                    <li>✓ 1 API endpoint</li>
                    <li>✓ Basic monitoring</li>
                    <li>✓ Email alerts</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-xl transform md:-translate-y-4">
                  <div className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Popular
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Pro</h4>
                  <p className="text-3xl font-bold text-white mb-4">$19<span className="text-base text-white/80 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-white">
                    <li>✓ 5 API endpoints</li>
                    <li>✓ Advanced monitoring</li>
                    <li>✓ Email + Slack alerts</li>
                    <li>✓ 30-day history</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-4">$49<span className="text-base text-gray-600 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-gray-600">
                    <li>✓ Unlimited endpoints</li>
                    <li>✓ Custom intervals</li>
                    <li>✓ Priority support</li>
                    <li>✓ 90-day history</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        {(currentView === 'login' || currentView === 'signup') && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            {currentView === 'login' && <Login />}
            {currentView === 'signup' && <Signup />}
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>© 2026 API Monitor. Built with 💰 by Yíng Yíng</p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
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
                  await logout();
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
