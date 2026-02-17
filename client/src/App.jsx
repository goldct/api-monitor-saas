import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Pricing from './Pricing';
import Login from './Login';
import Signup from './Signup';

function App() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center border-b border-gray-900">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <span className="text-2xl">📊</span>
              <h1 className="text-xl font-bold text-gray-900">API Monitor</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-5 py-2.5 border border-gray-900 hover:bg-gray-50 text-sm font-medium transition-colors ${currentView === 'login' ? 'bg-gray-100' : 'bg-white text-gray-900'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('signup')}
                className={`px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium transition-colors ${currentView === 'signup' ? 'ring-2 ring-gray-900' : ''}`}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        {currentView !== 'login' && currentView !== 'signup' && (
          <>
            <div className="max-w-6xl mx-auto px-6 py-24">
              <div className="text-center">
                <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                  Never let your API
                  <span className="text-gray-700"> go down</span>
                  again
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Monitor your APIs, get instant alerts, and keep your services running smoothly.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="bg-gray-900 text-white px-8 py-4 border border-gray-900 hover:bg-gray-800 text-lg font-medium transition-colors"
                  >
                    Get Started Free →
                  </button>
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="bg-white text-gray-900 px-8 py-4 border-2 border-gray-900 hover:bg-gray-50 text-lg font-medium transition-colors"
                  >
                    See Pricing
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mt-24">
                <div className="border border-gray-200 p-8 hover:border-gray-900 transition-colors">
                  <span className="text-3xl mb-4 block">⚡</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Monitoring</h3>
                  <p className="text-gray-700 leading-relaxed">Monitor your APIs every 60 seconds and get instant status updates.</p>
                </div>
                <div className="border border-gray-200 p-8 hover:border-gray-900 transition-colors">
                  <span className="text-3xl mb-4 block">🔔</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Alerts</h3>
                  <p className="text-gray-700 leading-relaxed">Get notified via email when your API goes down or slows down.</p>
                </div>
                <div className="border border-gray-200 p-8 hover:border-gray-900 transition-colors">
                  <span className="text-3xl mb-4 block">📈</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Analytics</h3>
                  <p className="text-gray-700 leading-relaxed">Track response times, uptime, and performance trends over time.</p>
                </div>
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="max-w-6xl mx-auto px-6 py-24">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
                <p className="text-gray-600">Start free, upgrade when you need more</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="border border-gray-200 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Free</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-base text-gray-600 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-gray-700">
                    <li>✓ 1 API endpoint</li>
                    <li>✓ Basic monitoring</li>
                    <li>✓ Email alerts</li>
                  </ul>
                </div>
                <div className="border-2 border-gray-900 p-8">
                  <p className="text-xs text-gray-600 font-medium mb-3">POPULAR</p>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Pro</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$19<span className="text-base text-gray-600 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-gray-700">
                    <li>✓ 5 API endpoints</li>
                    <li>✓ Advanced monitoring</li>
                    <li>✓ Email + Slack alerts</li>
                    <li>✓ 30-day history</li>
                  </ul>
                </div>
                <div className="border border-gray-200 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Enterprise</h4>
                  <p className="text-3xl font-bold text-gray-900 mb-6">$49<span className="text-base text-gray-600 font-normal">/mo</span></p>
                  <ul className="space-y-3 text-gray-700">
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
          <div className="max-w-6xl mx-auto px-6 py-12">
            {currentView === 'login' && <Login />}
            {currentView === 'signup' && <Signup />}
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center">
            <p className="text-gray-700">© 2026 API Monitor</p>
            <div className="mt-4 flex justify-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Logged in - show full app
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('alerts')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentView === 'alerts' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Alerts
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${currentView === 'pricing' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pricing
            </button>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-gray-600">
                {user.email || user.full_name || 'User'}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  setCurrentView('dashboard');
                }}
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'alerts' && <Alerts />}
        {currentView === 'pricing' && <Pricing />}
      </main>
    </div>
  );
}

export default App;
