import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';

export default function Features() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive testing in{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                five dimensions
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              DriftWatch combines multiple testing approaches into a single, unified report.
              Catch issues before your users do.
            </p>
          </div>
        </Container>
      </section>

      {/* Feature 1: Flow Testing */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                Flow Testing
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                End-to-end user flows with Playwright
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Test critical user journeys automatically. Every step is captured with timestamped screenshots,
                console logs, and network activity. See exactly what happened when something goes wrong.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Screenshot timeline with every interaction</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Full console and network logs</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Timing metrics for each step</span>
                </li>
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50" padding="lg">
              <div className="aspect-video bg-white rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-gray-600 font-medium">Playwright Screenshots</p>
                  <p className="text-sm text-gray-500 mt-2">Visual timeline of every test step</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Feature 2: Accessibility */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 lg:order-1" padding="lg">
              <div className="aspect-video bg-white rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">♿</div>
                  <p className="text-gray-600 font-medium">WCAG Compliance</p>
                  <p className="text-sm text-gray-500 mt-2">Automated accessibility testing</p>
                </div>
              </div>
            </Card>
            <div className="lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                Accessibility
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                WCAG compliance with axe-core
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Automatically scan every page for accessibility issues. Get detailed findings with severity levels,
                affected elements, and remediation guidance. Meet WCAG 2.1 AA standards with confidence.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Comprehensive axe-core rule coverage</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Severity classification and impact analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Actionable remediation guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature 3: Performance */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
                Performance
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Core Web Vitals and Lighthouse metrics
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Monitor the metrics that matter. Track LCP, FID, CLS, and more. Get Lighthouse scores for
                performance, SEO, and best practices. Ensure fast, responsive experiences across all devices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Core Web Vitals (LCP, FID, CLS)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Full Lighthouse audit scores</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Resource timing and network analysis</span>
                </li>
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-pink-50 to-red-50" padding="lg">
              <div className="aspect-video bg-white rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚡</div>
                  <p className="text-gray-600 font-medium">Performance Metrics</p>
                  <p className="text-sm text-gray-500 mt-2">Real-world speed measurements</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Feature 4: Visual Regression */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 lg:order-1" padding="lg">
              <div className="aspect-video bg-white rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-600 font-medium">Visual Comparison</p>
                  <p className="text-sm text-gray-500 mt-2">Baseline, Current, Diff, Overlay</p>
                </div>
              </div>
            </Card>
            <div className="lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Visual Regression
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Pixel-perfect visual comparisons
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Catch unintended UI changes before they reach production. Compare screenshots with four views:
                baseline, current, difference highlighting, and overlay mode. Never miss a visual regression again.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Four comparison modes (Baseline/Current/Diff/Overlay)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Pixel-level difference detection</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Visual regression history tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature 5: AI Design Critique */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
                AI Design Critique
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Intelligent UX and design feedback
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get AI-powered insights on your design. Receive recommendations for UX patterns, design consistency,
                accessibility improvements, and best practices. Like having a design expert review every page.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">UX pattern recommendations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Design consistency analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Accessibility best practices</span>
                </li>
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50" padding="lg">
              <div className="aspect-video bg-white rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-gray-600 font-medium">AI-Powered Insights</p>
                  <p className="text-sm text-gray-500 mt-2">Smart design recommendations</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to comprehensive quality reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Configure Your Tests</h3>
              <p className="text-gray-600">
                Define your user flows, select pages to test, and configure your quality thresholds.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Run Your Suite</h3>
              <p className="text-gray-600">
                Execute all five testing dimensions in parallel. Track progress in real-time.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Review Your Report</h3>
              <p className="text-gray-600">
                Get a unified HTML report with all results. Share with your team or integrate into CI/CD.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Sample Report CTA */}
      <section className="py-20 bg-white">
        <Container>
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center" padding="lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See it in action
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Check out a sample report to see how all five testing dimensions come together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" variant="secondary" size="lg">
                View Sample Report
              </Button>
              <Button href="/signup" variant="primary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
                Try It Free
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
