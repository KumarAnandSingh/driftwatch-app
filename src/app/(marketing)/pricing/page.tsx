'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown } from 'lucide-react';

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
      variant: 'outline' as const,
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
      variant: 'default' as const,
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
      <section className="py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, transparent{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                pricing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that fits your needs. Start free, upgrade when you're ready.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-card rounded-lg p-1 border border-border shadow-sm">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
                <Badge variant="secondary" className="text-xs">
                  Save $98
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular ? 'border-primary shadow-xl' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>

                  <div className="pt-4">
                    {tier.price[billingPeriod] === null ? (
                      <div className="text-4xl font-bold">Custom</div>
                    ) : tier.price[billingPeriod] === 0 ? (
                      <div className="text-4xl font-bold">Free</div>
                    ) : (
                      <>
                        <div className="text-5xl font-bold">
                          ${tier.price[billingPeriod]}
                        </div>
                        <div className="text-muted-foreground mt-1">
                          per {billingPeriod === 'monthly' ? 'month' : 'year'}
                        </div>
                        {billingPeriod === 'yearly' && tier.savings && (
                          <Badge variant="secondary" className="mt-2">
                            Save ${tier.savings}/year
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button variant={tier.variant} size="lg" className="w-full" asChild>
                    <Link href={tier.href}>
                      {tier.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-20 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Detailed feature comparison
            </h2>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 font-semibold">Feature</th>
                      <th className="text-center py-4 px-6 font-semibold">Free</th>
                      <th className="text-center py-4 px-6 font-semibold">Pro</th>
                      <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Projects</td>
                      <td className="py-4 px-6 text-center">1</td>
                      <td className="py-4 px-6 text-center">Unlimited</td>
                      <td className="py-4 px-6 text-center">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Pages per month</td>
                      <td className="py-4 px-6 text-center">200</td>
                      <td className="py-4 px-6 text-center">10,000</td>
                      <td className="py-4 px-6 text-center">Custom</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Flow Testing</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Accessibility Testing</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Performance Testing</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Visual Regression</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">AI Design Critique</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Webhook integrations</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Custom baselines</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Report history</td>
                      <td className="py-4 px-6 text-center">7 days</td>
                      <td className="py-4 px-6 text-center">90 days</td>
                      <td className="py-4 px-6 text-center">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">SSO / SAML</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Private runners</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">SLA guarantees</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">-</td>
                      <td className="py-4 px-6 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted-foreground">Support</td>
                      <td className="py-4 px-6 text-center">Community</td>
                      <td className="py-4 px-6 text-center">Priority</td>
                      <td className="py-4 px-6 text-center">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Frequently asked questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join teams who trust DriftWatch to maintain web quality. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/demo">Try Live Demo</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-white"
              asChild
            >
              <Link href="/signup">Start Free Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
      <CardHeader onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-left pr-8">
            {question}
          </CardTitle>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
