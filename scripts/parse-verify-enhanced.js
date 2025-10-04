#!/usr/bin/env node
/**
 * Enhanced verification parser with detailed gates tracking
 * Usage: node parse-verify-enhanced.js verify.log > verify.json
 */

const fs = require('fs');

const logFile = process.argv[2];
if (!logFile) {
  console.error('Usage: node parse-verify-enhanced.js <log-file>');
  process.exit(1);
}

if (!fs.existsSync(logFile)) {
  console.error(`Error: Log file not found: ${logFile}`);
  process.exit(1);
}

const log = fs.readFileSync(logFile, 'utf8');

// Helper to extract gate status
const extractGateStatus = (gateName, passPattern, failPattern) => {
  if (new RegExp(failPattern, 'i').test(log)) return 'FAIL';
  if (new RegExp(passPattern, 'i').test(log)) return 'PASS';
  return 'SKIP';
};

// Extract test statistics
const extractTestStats = () => {
  const match = log.match(/Tests:\s+(\d+)\s+passed.*?(\d+)\s+failed/i) ||
                log.match(/(\d+)\s+passed.*?(\d+)\s+failed/i) ||
                log.match(/PASS.*?(\d+).*?FAIL.*?(\d+)/i);

  if (match) {
    const passed = parseInt(match[1], 10);
    const failed = parseInt(match[2], 10);
    const total = passed + failed;

    // Extract coverage if available
    const covMatch = log.match(/coverage:\s*(\d+(?:\.\d+)?)\s*%/i) ||
                     log.match(/lines:\s*(\d+(?:\.\d+)?)\s*%/i);
    const coverage = covMatch ? parseFloat(covMatch[1]) / 100 : null;

    return {
      status: failed === 0 ? 'PASS' : 'FAIL',
      ran: total,
      passed,
      failed,
      coverage
    };
  }
  return null;
};

// Extract security findings
const extractSecurityFindings = () => {
  const highMatch = log.match(/high:?\s*(\d+)/i);
  const criticalMatch = log.match(/critical:?\s*(\d+)/i);
  const mediumMatch = log.match(/medium:?\s*(\d+)/i);

  if (highMatch || criticalMatch) {
    return {
      critical: criticalMatch ? parseInt(criticalMatch[1], 10) : 0,
      high: highMatch ? parseInt(highMatch[1], 10) : 0,
      medium: mediumMatch ? parseInt(mediumMatch[1], 10) : 0
    };
  }
  return null;
};

// Extract Lighthouse metrics
const extractLighthouseMetrics = () => {
  const lcpMatch = log.match(/LCP:?\s*(\d+)\s*ms/i);
  const fcp = log.match(/FCP:?\s*(\d+)\s*ms/i);
  const cls = log.match(/CLS:?\s*(\d+(?:\.\d+)?)/i);
  const tti = log.match(/TTI:?\s*(\d+)\s*ms/i);

  if (lcpMatch) {
    const lcp_ms = parseInt(lcpMatch[1], 10);
    const budget_ok = lcp_ms <= 2500;  // Budget: 2.5s

    return {
      lcp_ms,
      fcp_ms: fcp ? parseInt(fcp[1], 10) : null,
      cls: cls ? parseFloat(cls[1]) : null,
      tti_ms: tti ? parseInt(tti[1], 10) : null,
      budget_ok
    };
  }
  return null;
};

// Extract accessibility violations
const extractA11yViolations = () => {
  const criticalMatch = log.match(/critical.*?violations?:?\s*(\d+)/i);
  const seriousMatch = log.match(/serious.*?violations?:?\s*(\d+)/i);

  if (criticalMatch) {
    return {
      violations_critical: parseInt(criticalMatch[1], 10),
      violations_serious: seriousMatch ? parseInt(seriousMatch[1], 10) : 0
    };
  }
  return null;
};

// Build detailed gates object
const gates = {
  typecheck: extractGateStatus('Typecheck', 'Typecheck.*PASS', 'Typecheck.*FAIL'),
  lint: extractGateStatus('Lint', 'Lint.*PASS', 'Lint.*FAIL'),
  tests: extractTestStats(),
  build: extractGateStatus('Build', 'Build.*PASS', 'Build.*FAIL'),
  contracts: extractGateStatus('Contracts', 'Contracts.*PASS|API.*PASS', 'Contracts.*FAIL|API.*FAIL'),
  migrations: extractGateStatus('Migrations', 'Migration.*PASS', 'Migration.*FAIL'),
  security: extractSecurityFindings(),
  lighthouse: extractLighthouseMetrics(),
  a11y: extractA11yViolations(),
  smoke_ui: extractGateStatus('Smoke UI', 'Smoke.*PASS', 'Smoke.*FAIL'),
  smoke_api: extractGateStatus('Smoke API', 'API.*PASS|health.*OK', 'API.*FAIL|health.*FAIL')
};

// Determine overall verdict
const hasPassMarker = /VERIFY[_:\s]+PASS/i.test(log);
const failurePatterns = [
  /failed|error|err!/i,
  /EADDRINUSE|ECONNREFUSED|ENOTFOUND|ETIMEDOUT/,
  /TypeError|ReferenceError|SyntaxError/,
  /Cannot read propert/i,
  /Module not found/i,
  /Command failed/i,
  /npm ERR!/,
  /✗.*FAIL/,
  /VERIFY[_:\s]+FAIL/i
];

const hasFailure = failurePatterns.some(pattern => pattern.test(log));

// Check gate-level failures
const gatesFailed = Object.entries(gates).some(([key, value]) => {
  if (!value) return false;
  if (typeof value === 'object') {
    if (value.status === 'FAIL') return true;
    if (value.failed && value.failed > 0) return true;
    if (value.critical && value.critical > 0) return true;
    if (value.high && value.high > 0) return true;
    if (value.violations_critical && value.violations_critical > 0) return true;
    if (value.budget_ok === false) return true;
  } else if (value === 'FAIL') {
    return true;
  }
  return false;
});

let verdict;
if (hasPassMarker && !hasFailure && !gatesFailed) {
  verdict = 'PASS';
} else if (hasFailure || gatesFailed) {
  verdict = 'FAIL';
} else {
  verdict = 'UNKNOWN';
}

// Build hints
const hints = [];
if (verdict === 'FAIL') {
  if (gates.tests && gates.tests.failed > 0) {
    hints.push(`${gates.tests.failed} test(s) failing - check test output`);
  }
  if (gates.security && (gates.security.critical > 0 || gates.security.high > 0)) {
    hints.push(`${gates.security.critical} critical, ${gates.security.high} high security issues`);
  }
  if (gates.a11y && gates.a11y.violations_critical > 0) {
    hints.push(`${gates.a11y.violations_critical} critical accessibility violations`);
  }
  if (gates.lighthouse && gates.lighthouse.budget_ok === false) {
    hints.push(`Performance budget exceeded - LCP: ${gates.lighthouse.lcp_ms}ms (max: 2500ms)`);
  }
  if (/EADDRINUSE/.test(log)) {
    hints.push('Port already in use - kill existing process');
  }
  if (/Module not found/i.test(log)) {
    hints.push('Missing module - run npm install');
  }

  if (hints.length === 0) {
    hints.push('Check tail of verify.log for details');
  }
}

// Extract build time
const buildTimeMatch = log.match(/built in\s+(\d+(?:\.\d+)?)\s*(ms|s)/i);
const buildTime = buildTimeMatch ? buildTimeMatch[0] : null;

// Extract durations for each gate (if available)
const durations = {};
const durationMatches = log.matchAll(/===\s*(\w+)\s*===[\s\S]*?(\d+(?:\.\d+)?)\s*s/gi);
for (const match of durationMatches) {
  durations[match[1].toLowerCase()] = parseFloat(match[2]);
}

// Build enhanced result
const result = {
  verdict,
  timestamp: new Date().toISOString(),
  logFile,
  gates,
  durations: Object.keys(durations).length > 0 ? durations : undefined,
  buildTime,
  hints: hints.length > 0 ? hints : undefined,
  summary: buildSummary(verdict, gates)
};

// Build human-readable summary
function buildSummary(verdict, gates) {
  const parts = [`Verification ${verdict}`];

  if (gates.tests) {
    parts.push(`${gates.tests.passed} passed, ${gates.tests.failed} failed`);
    if (gates.tests.coverage) {
      parts.push(`${Math.round(gates.tests.coverage * 100)}% coverage`);
    }
  }

  if (gates.security) {
    if (gates.security.critical > 0 || gates.security.high > 0) {
      parts.push(`${gates.security.critical} critical, ${gates.security.high} high vulns`);
    } else {
      parts.push('security ✓');
    }
  }

  if (gates.lighthouse) {
    parts.push(`LCP ${gates.lighthouse.lcp_ms}ms`);
  }

  return parts.join(' - ');
}

// Output enhanced JSON
console.log(JSON.stringify(result, null, 2));

// Exit with appropriate code
process.exit(verdict === 'PASS' ? 0 : 1);
