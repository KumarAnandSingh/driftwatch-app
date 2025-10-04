#!/usr/bin/env node
/**
 * Parse verification log and produce machine-readable verdict
 * Usage: node parse-verify.js verify.log > verify.json
 */

const fs = require('fs');

// Read log file from command line argument
const logFile = process.argv[2];
if (!logFile) {
  console.error('Usage: node parse-verify.js <log-file>');
  process.exit(1);
}

if (!fs.existsSync(logFile)) {
  console.error(`Error: Log file not found: ${logFile}`);
  process.exit(1);
}

const log = fs.readFileSync(logFile, 'utf8');

// Check for explicit pass marker
const hasPassMarker = /VERIFY[_:\s]+PASS/i.test(log);

// Check for common failure patterns
const failurePatterns = [
  /failed|error|err!/i,
  /EADDRINUSE|ECONNREFUSED|ENOTFOUND|ETIMEDOUT/,
  /TypeError|ReferenceError|SyntaxError/,
  /Cannot read propert/i,
  /Module not found/i,
  /Command failed/i,
  /npm ERR!/,
  /✗.*FAIL/,
  /Test Suites:.*failed/,
  /Tests:.*failed/,
  /VERIFY[_:\s]+FAIL/i
];

const hasFailure = failurePatterns.some(pattern => pattern.test(log));

// Determine verdict
let verdict;
if (hasPassMarker && !hasFailure) {
  verdict = "PASS";
} else if (hasFailure) {
  verdict = "FAIL";
} else {
  verdict = "UNKNOWN";
}

// Extract test statistics if available
const testMatch = log.match(/Tests:\s+(\d+)\s+passed.*?(\d+)\s+failed/i);
const testStats = testMatch ? {
  passed: parseInt(testMatch[1], 10),
  failed: parseInt(testMatch[2], 10)
} : null;

// Extract build time if available
const buildTimeMatch = log.match(/built in\s+(\d+(?:\.\d+)?)\s*(ms|s)/i);
const buildTime = buildTimeMatch ? buildTimeMatch[0] : null;

// Collect hints for failures
const hints = [];
if (hasFailure) {
  if (/EADDRINUSE/.test(log)) {
    hints.push("Port already in use - kill existing process or use different port");
  }
  if (/ECONNREFUSED/.test(log)) {
    hints.push("Connection refused - service may not be running");
  }
  if (/Module not found/i.test(log)) {
    hints.push("Missing module - run npm install");
  }
  if (/TypeError|ReferenceError/.test(log)) {
    hints.push("Runtime error detected - check implementation");
  }
  if (/Tests:.*failed/i.test(log)) {
    hints.push("Test failures detected - check test output");
  }

  // If no specific hints, provide generic guidance
  if (hints.length === 0) {
    hints.push("Check tail of verify.log for details");
  }
}

// Build result object
const result = {
  verdict,
  timestamp: new Date().toISOString(),
  logFile,
  testStats,
  buildTime,
  hints: hints.length > 0 ? hints : undefined,
  summary: `Verification ${verdict}${testStats ? ` - ${testStats.passed} passed, ${testStats.failed} failed` : ''}`
};

// Output JSON
console.log(JSON.stringify(result, null, 2));

// Exit with appropriate code
process.exit(verdict === "PASS" ? 0 : 1);
