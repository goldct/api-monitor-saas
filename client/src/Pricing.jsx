import { useState } from 'react';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '1 API endpoint',
        '10 checks/day',
        'Basic stats',
        'No alerts'
      ],
      popular: false
    },
    {
      name: 'Basic',
      price: { monthly: 19, yearly: 190 },
      features: [
        '5 API endpoints',
        '100 checks/day',
        'Alerts',
        '7-day history',
        'Email support'
      ],
      popular: true
    },
    {
      name: 'Pro',
      price: { monthly: 49, yearly: 490 },
      features: [
        'Unlimited endpoints',
        'Unlimited checks',
        'Real-time alerts',
        '30-day history',
        'Priority support',
        'Webhooks'
      ],
      popular: false
    },
    {
      name: 'Enterprise',
      price: { monthly: 199, yearly: 1990 },
      features: [
        'Team collaboration',
        'Custom alert rules',
        'Dedicated monitoring',
        'API access',
        'SLA guarantee',
        '24/7 support'
      ],
      popular: false
    }
  ];

  const getPrice = (price) => {
    return billingCycle === 'yearly' ? price.yearly : price.monthly;
  };

  const getPeriod = () => {
    return billingCycle === 'yearly' ? 'year' : 'mo';
  };

  const getYearlySavings = (price) => {
    const monthly = price.monthly * 12;
    return ((monthly - price.yearly) / monthly * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💎</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">API Monitor - Pricing</h1>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/alerts" className="text-gray-600 hover:text-gray-900">Alerts</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Billing Cycle Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 bg-white rounded-lg p-4 shadow">
          <span className={`cursor-pointer font-medium ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className={`cursor-pointer font-medium ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="ml-2 text-green-600 font-medium">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg shadow p-6 ${plan.popular ? 'border-2 border-blue-600' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${getPrice(plan.price)}
                </span>
                <span className="text-gray-600">/{getPeriod()}</span>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-green-600 text-sm mt-1">
                    Save {getYearlySavings(plan.price)}% annually
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Start Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">We'll notify you when you're approaching your limits. You can upgrade to get more capacity.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 14-day money-back guarantee. No questions asked.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do I cancel?</h3>
              <p className="text-gray-600">You can cancel anytime from your dashboard. No cancellation fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
