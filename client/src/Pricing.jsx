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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💎</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pricing
            </h1>
          </div>
        </div>
      </header>

      {/* Billing Cycle Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-4 bg-white rounded-2xl p-6 shadow-lg">
          <span 
            className={`cursor-pointer font-bold transition-all ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
          <span 
            className={`cursor-pointer font-bold transition-all ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 ${plan.popular ? 'border-2 border-blue-600' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-blue-600' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className="mb-6">
                <span className={`text-5xl font-bold ${plan.popular ? 'text-blue-600' : 'text-gray-900'}`}>
                  ${getPrice(plan.price)}
                </span>
                <span className="text-gray-600">/{getPeriod()}</span>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-green-600 text-sm font-bold mt-2">
                    Save {getYearlySavings(plan.price)}% annually
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate your billing.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">We'll notify you when you're approaching your limits. You can upgrade to get more capacity or contact us for custom solutions.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 14-day money-back guarantee. No questions asked. If you're not satisfied, we'll refund you.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">How do I cancel?</h3>
              <p className="text-gray-600">You can cancel anytime from your dashboard. No cancellation fees. Your service continues until the end of your billing period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
