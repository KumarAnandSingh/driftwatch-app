'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out DriftWatch',
      features: [
        '1 project',
        '200 pages per month',
        'All 5 testing dimensions',
        'Basic report export',
        'Community support',
        '7-day report history',
      ],
      cta: 'Get Started Free',
      href: '/signup',
      variant: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Pro',
      price: { monthly: 49, yearly: 490 },
      description: 'For professional teams and products',
      features: [
        'Unlimited projects',
        '10,000 pages per month',
        'All 5 testing dimensions',
        'Advanced report analytics',
        'Webhook integrations',
        'Priority support',
        '90-day report history',
        'Custom baselines',
        'CI/CD integration guides',
      ],
      cta: 'Start Pro Trial',
      href: '/signup?plan=pro',
      variant: 'primary' as const,
      popular: true,
      savings: 98,
    },
    {
      name: 'Enterprise',
      price: { monthly: null, yearly: null },
      description: 'For large organizations with custom needs',
      features: [
        'Custom page limits',
        'All 5 testing dimensions',
        'SSO / SAML authentication',
        'Private runner infrastructure',
        'SLA guarantees',
        'Dedicated support engineer',
        'Unlimited report history',
        'Custom integrations',
        'On-premise deployment options',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      variant: 'secondary' as const,
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'What counts as a "page" in my monthly limit?',
      answer: 'Each unique URL that is tested counts as one page. If you test the same URL multiple times in a month, it still only counts as one page.',
    },
    {
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you will be charged a prorated amount. When downgrading, the change will take effect at the start of your next billing cycle.',
    },
    {
      question: 'What happens if I exceed my page limit?',
      answer: 'On the Free plan, tests will pause when you reach your limit until the next month. On Pro and Enterprise, we\'ll send you a notification and you can upgrade or purchase additional page credits.',
    },
    {
      question: 'Do you offer discounts for nonprofits or educational institutions?',
      answer: 'Yes! We offer 50% discounts for qualified nonprofits and educational institutions. Contact our sales team to learn more.',
    },
    {
      question: 'Is there a free trial for the Pro plan?',
      answer: 'Yes! We offer a 14-day free trial of the Pro plan. No credit card required. After the trial, you can choose to continue with Pro or downgrade to Free.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. Enterprise customers can also pay via invoice.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your needs. Start free, upgrade when you're ready.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Save $98
                </span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular ? 'border-2 border-indigo-600 shadow-xl' : ''
                }`}
                padding="lg"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>

                  <div className="mb-4">
                    {tier.price[billingPeriod] === null ? (
                      <div className="text-4xl font-bold text-gray-900">Custom</div>
                    ) : tier.price[billingPeriod] === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">Free</div>
                    ) : (
                      <>
                        <div className="text-5xl font-bold text-gray-900">
                          ${tier.price[billingPeriod]}
                        </div>
                        <div className="text-gray-600 mt-1">
                          per {billingPeriod === 'monthly' ? 'month' : 'year'}
                        </div>
                        {billingPeriod === 'yearly' && tier.savings && (
                          <div className="text-sm text-green-600 font-semibold mt-2">
                            Save ${tier.savings}/year
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button href={tier.href} variant={tier.variant} size="lg" className="w-full">
                  {tier.cta}
                </Button>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Detailed feature comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Projects</td>
                    <td className="py-4 px-4 text-center text-gray-700">1</td>
                    <td className="py-4 px-4 text-center text-gray-700">Unlimited</td>
                    <td className="py-4 px-4 text-center text-gray-700">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Pages per month</td>
                    <td className="py-4 px-4 text-center text-gray-700">200</td>
                    <td className="py-4 px-4 text-center text-gray-700">10,000</td>
                    <td className="py-4 px-4 text-center text-gray-700">Custom</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Flow Testing</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Accessibility Testing</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Performance Testing</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Visual Regression</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">AI Design Critique</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Webhook integrations</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Custom baselines</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Report history</td>
                    <td className="py-4 px-4 text-center text-gray-700">7 days</td>
                    <td className="py-4 px-4 text-center text-gray-700">90 days</td>
                    <td className="py-4 px-4 text-center text-gray-700">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">SSO / SAML</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Private runners</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">SLA guarantees</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center text-gray-400">-</td>
                    <td className="py-4 px-4 text-center">
                      <CheckIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Support</td>
                    <td className="py-4 px-4 text-center text-gray-700">Community</td>
                    <td className="py-4 px-4 text-center text-gray-700">Priority</td>
                    <td className="py-4 px-4 text-center text-gray-700">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join teams who trust DriftWatch to maintain web quality. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" variant="secondary" size="lg">
                Try Live Demo
              </Button>
              <Button href="/signup" variant="primary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
                Start Free Today
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="cursor-pointer" padding="lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{question}</h3>
        <svg
          className={`w-6 h-6 text-gray-500 flex-shrink-0 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </Card>
  );
}