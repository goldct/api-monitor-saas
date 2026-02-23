import { useState } from 'react';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '3 API endpoints',
        '60-min check interval',
        'Email alerts',
        '7-day history',
        'Basic analytics'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 9, yearly: 86 },
      features: [
        '10 API endpoints',
        '5-min check interval',
        'Email + Webhook alerts',
        '30-day history',
        'Advanced analytics',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Team',
      price: { monthly: 29, yearly: 278 },
      features: [
        '50 API endpoints',
        '1-min check interval',
        'All notification channels',
        '90-day history',
        'Team collaboration',
        'API access',
        'Custom alert rules'
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold text-black">API Monitor</h1>
          </div>
        </div>
      </header>

      {/* Billing Cycle Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-4 border-2 border-gray-200 rounded-xl p-6">
          <span
            className={`cursor-pointer font-bold transition-all ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-black' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
          <span
            className={`cursor-pointer font-bold transition-all ${billingCycle === 'yearly' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="ml-2 px-3 py-1 bg-black text-white rounded-full text-sm font-bold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl p-8 transition-all ${plan.popular ? 'border-2 border-black shadow-xl' : 'border-2 border-gray-200 hover:border-black'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold mb-2 text-black">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-black">
                  ${getPrice(plan.price)}
                </span>
                <span className="text-gray-600 font-medium">/{getPeriod()}</span>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-gray-600 text-sm font-bold mt-2">
                    Save {getYearlySavings(plan.price)}% annually
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'border-2 border-black text-black hover:bg-black hover:text-white'
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
        <div className="border-2 border-gray-200 rounded-xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-black">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-black text-lg mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate your billing.</p>
            </div>
            <div>
              <h3 className="font-bold text-black text-lg mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">We'll notify you when you're approaching your limits. You can upgrade to get more capacity or contact us for custom solutions.</p>
            </div>
            <div>
              <h3 className="font-bold text-black text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 14-day money-back guarantee. No questions asked. If you're not satisfied, we'll refund you.</p>
            </div>
            <div>
              <h3 className="font-bold text-black text-lg mb-2">How do I cancel?</h3>
              <p className="text-gray-600">You can cancel anytime from your dashboard. No cancellation fees. Your service continues until the end of your billing period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
