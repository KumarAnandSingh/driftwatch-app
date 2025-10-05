# DriftWatch Testing Guide

## 🚀 Local Deployment & Testing

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running
- Redis server running
- `.env` file configured

### 1. Quick Start (All Services)

```bash
# Terminal 1: Start PostgreSQL (if not running)
brew services start postgresql@14

# Terminal 2: Start Redis (if not running)
brew services start redis

# Terminal 3: Start Next.js App
cd ~/driftwatch-app
npm run dev
# App: http://localhost:3000

# Terminal 4: Start BullMQ Worker
cd ~/driftwatch-app
npm run worker:dev
```

### 2. Verify Services Running

```bash
# Check PostgreSQL
psql -U postgres -c "SELECT version();"

# Check Redis
redis-cli ping
# Should return: PONG

# Check Next.js App
curl http://localhost:3000/api/health
# Should return: {"status":"ok"}

# Check Worker Logs
# Watch Terminal 4 for "🚀 Scan worker started"
```

---

## ✅ Feature Testing Checklist

### 🔐 Authentication Features (4/4 Complete)

#### ✅ 1. Email Verification with Confetti Animation
**What to Test:**
- Sign up flow shows confetti on successful verification
- Triple confetti burst (center + left + right)
- Auto-redirect to dashboard after 2 seconds
- Success message displays correctly

**Steps:**
1. Go to http://localhost:3000/signup
2. Enter email: `test@example.com`
3. Submit form
4. Check email for verification code
5. Enter 6-digit code on `/verify` page
6. **Expected:**
   - Confetti animation plays
   - Green success checkmark appears
   - Auto-redirects to `/dashboard` after 2 seconds

**Files:**
- `src/app/(auth)/verify/page.tsx:87-109`

---

#### ✅ 2. Auto-Redirect After Verification
**What to Test:**
- Automatic redirect happens without user action
- Redirect timing (2 seconds)
- Redirect URL respects `callbackUrl` parameter

**Steps:**
1. Complete email verification (step above)
2. **Expected:** Auto-redirect to `/dashboard` within 2 seconds

**Files:**
- `src/app/(auth)/verify/page.tsx:104-106`

---

#### ✅ 3. Resend Code with Cooldown Timer
**What to Test:**
- "Resend code" button is disabled for 60 seconds
- Countdown timer displays correctly
- Button becomes enabled after cooldown
- Can successfully resend code

**Steps:**
1. Go to `/verify` page with email parameter
2. Click "Resend code" button
3. **Expected:**
   - Button disabled
   - Shows "Resend code in 60s"
   - Countdown decreases every second
   - After 60s, shows "Resend code" again
4. Click "Resend code" again
5. **Expected:** New code sent to email

**Files:**
- `src/app/(auth)/verify/page.tsx:56-77`

---

#### ✅ 4. Password Reset / Account Recovery Flow
**What to Test:**
- Forgot password link on signin page
- Email submission triggers magic link
- Success state with helpful instructions
- Can navigate back to try again

**Steps:**
1. Go to http://localhost:3000/signin
2. Click "Trouble signing in?" link
3. **Expected:** Redirects to `/forgot-password`
4. Enter email: `existing@example.com`
5. Submit form
6. **Expected:**
   - Success screen appears
   - Shows "Check your email" message
   - Displays help text about spam folder
   - Shows "Back to Sign In" button
7. Check email for magic link
8. Click link in email
9. **Expected:** Logs in and redirects to `/dashboard`

**Files:**
- `src/app/(auth)/forgot-password/page.tsx:1-193`
- `src/app/api/auth/forgot-password/route.ts:1-37`
- `src/app/(auth)/signin/page.tsx:100-108`

---

### 🔍 Scanning Engine Features (3/3 Complete)

#### ✅ 5. Performance Scanning (Lighthouse Integration)
**What to Test:**
- Performance metrics are collected
- Lighthouse scores appear in results
- Progress updates during scan (60-70%)

**Steps:**
1. Sign in to http://localhost:3000/dashboard
2. Create new project or select existing
3. Click "New Scan"
4. Enter URL: `https://example.com`
5. **Enable:** "Performance Analysis" checkbox
6. Submit scan
7. Monitor progress bar
8. **Expected:**
   - Progress shows "Performance analysis..." at 60-70%
   - Console logs: `⚡ [runId] Phase 5: Performance analysis...`
   - Results page shows performance scores
   - Lighthouse metrics displayed (FCP, LCP, TTI, etc.)

**Check Database:**
```sql
SELECT id, status, progress, "currentPhase", "perfResults"
FROM "Run"
WHERE status = 'COMPLETED'
ORDER BY "createdAt" DESC
LIMIT 1;
```

**Expected JSON in `perfResults`:**
```json
[
  {
    "url": "https://example.com",
    "score": 85,
    "metrics": {
      "firstContentfulPaint": 1200,
      "largestContentfulPaint": 2400,
      "totalBlockingTime": 150,
      "cumulativeLayoutShift": 0.1,
      "speedIndex": 1800
    },
    "timestamp": "2025-10-05T..."
  }
]
```

**Files:**
- `src/workers/scan-worker.ts:277-320`
- `src/lib/scanner/performance.ts`

---

#### ✅ 6. SEO Analysis Scanner
**What to Test:**
- SEO checks run successfully
- Meta tag analysis working
- Open Graph / Twitter Card detection
- Image alt attributes checked
- H1 tag validation

**Steps:**
1. Go to http://localhost:3000/dashboard
2. Create/select project
3. Click "New Scan"
4. Enter URL: `https://example.com`
5. **Enable:** "SEO Analysis" checkbox
6. Submit scan
7. Monitor progress bar
8. **Expected:**
   - Progress shows "SEO analysis..." at 70-80%
   - Console logs: `🔍 [runId] Phase 6: SEO analysis...`
   - Results page shows SEO scores and issues

**Check Database:**
```sql
SELECT "seoResults"
FROM "Run"
WHERE status = 'COMPLETED'
ORDER BY "createdAt" DESC
LIMIT 1;
```

**Expected JSON in `seoResults`:**
```json
[
  {
    "url": "https://example.com",
    "score": 90,
    "title": "Example Domain",
    "description": "Example domain for testing",
    "h1Tags": ["Example Domain"],
    "images": {
      "total": 5,
      "missingAlt": 0
    },
    "links": {
      "total": 10,
      "internal": 8,
      "external": 2
    },
    "openGraph": {
      "title": "Example Domain",
      "description": "...",
      "image": "https://example.com/og.jpg"
    },
    "issues": [
      {
        "type": "warning",
        "category": "Meta Tags",
        "message": "Title length (13) should be between 30-60 characters"
      }
    ],
    "passed": 8,
    "timestamp": "2025-10-05T..."
  }
]
```

**SEO Checks Performed:**
- ✓ Title tag (30-60 chars optimal)
- ✓ Meta description (120-160 chars optimal)
- ✓ H1 tags (exactly one recommended)
- ✓ Image alt attributes
- ✓ Canonical URL
- ✓ Viewport meta tag
- ✓ Open Graph tags
- ✓ Twitter Card tags
- ✓ Robots meta tag
- ✓ Internal/external links

**Files:**
- `src/workers/scan-worker.ts:322-365`
- `src/lib/scanner/seo.ts:1-258`

---

#### ✅ 7. Visual Regression Testing Integration
**What to Test:**
- Visual diffs compared with previous scan
- Baseline detection works
- Pixel differences calculated
- Diff images generated

**Steps:**
1. Go to http://localhost:3000/dashboard
2. Select existing project (must have previous completed scan)
3. Click "New Scan"
4. Enter **same URL** as previous scan
5. **Enable:** "Visual Regression Testing" checkbox
6. Submit scan
7. Monitor progress bar
8. **Expected:**
   - Progress shows "Visual regression testing..." at 80-95%
   - Console logs: `📷 [runId] Phase 7: Visual regression testing...`
   - If baseline exists: `✅ [runId] Visual regression complete. X comparisons`
   - If no baseline: `ℹ️ [runId] No baseline run found. Skipping visual regression.`

**Check Database:**
```sql
SELECT "visualDiffResults"
FROM "Run"
WHERE status = 'COMPLETED'
ORDER BY "createdAt" DESC
LIMIT 1;
```

**Expected JSON in `visualDiffResults` (if baseline exists):**
```json
[
  {
    "url": "https://example.com",
    "baselinePath": "/screenshots/baseline_1234.png",
    "currentPath": "/screenshots/current_5678.png",
    "diffPath": "/screenshots/diff_9012.png",
    "pixelDifference": 234,
    "percentageDiff": 0.5,
    "passed": true,
    "timestamp": "2025-10-05T..."
  }
]
```

**Visual Regression Logic:**
- Compares current screenshots with previous run screenshots
- Uses Pixelmatch for pixel-level comparison
- Generates diff images highlighting changes
- Only runs if previous completed scan exists

**Files:**
- `src/workers/scan-worker.ts:367-431`
- `src/lib/scanner/visual-diff.ts`

---

## 🎯 Complete Scan Test (All Features)

**Full End-to-End Test:**

1. **Start Services:**
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Worker
npm run worker:dev
```

2. **Create Test Scan:**
   - Go to http://localhost:3000/dashboard
   - Create new project: "Full Test Project"
   - URL: `https://www.studyify.in`
   - Enable ALL scan options:
     - ✅ Accessibility
     - ✅ AI Design Critique
     - ✅ Performance Analysis
     - ✅ SEO Analysis
     - ✅ Visual Regression Testing
   - Max pages: 5
   - Max depth: 2
   - Submit scan

3. **Monitor Progress:**
   - Watch progress bar advance through phases:
     - 0-20%: Crawling ✅
     - 20-40%: Screenshots ✅
     - 40-60%: Accessibility ✅
     - 60%: AI Critique ✅
     - 60-70%: Performance ✅
     - 70-80%: SEO ✅
     - 80-95%: Visual Regression ✅
     - 95-100%: Finalize ✅

4. **Check Worker Logs (Terminal 2):**
```
🚀 Starting scan for https://www.studyify.in (Run: xxx)
📡 [xxx] Phase 1: Crawling website...
✅ [xxx] Crawled 5 pages
📸 [xxx] Phase 2: Capturing screenshots...
✅ [xxx] Captured 5 screenshots
♿ [xxx] Phase 3: Accessibility scanning...
✅ [xxx] Accessibility scan complete. Avg score: 95
🤖 [xxx] Phase 4: AI Design Critique...
✅ [xxx] AI critique complete. Avg score: 88
⚡ [xxx] Phase 5: Performance analysis...
✅ [xxx] Performance analysis complete. Avg score: 82
🔍 [xxx] Phase 6: SEO analysis...
✅ [xxx] SEO analysis complete. Avg score: 90
📷 [xxx] Phase 7: Visual regression testing...
ℹ️  [xxx] No baseline run found. Skipping visual regression.
✅ [xxx] Scan complete! Final score: 89/100
✅ Scan xxx completed successfully
```

5. **Verify Results Page:**
   - Click on completed scan
   - **Expected Sections:**
     - Overall score (weighted average of all scans)
     - Accessibility results with violations
     - AI critique with design feedback
     - Performance metrics (Lighthouse scores)
     - SEO analysis with issues
     - Visual regression diffs (if 2nd scan)
     - Screenshots gallery

6. **Check Score Calculation:**
   - Final score should be weighted average:
     - Accessibility: 25%
     - AI Critique: 25%
     - Performance: 25%
     - SEO: 25%

---

## 🐛 Common Issues & Troubleshooting

### Issue: Worker Not Processing Jobs
**Symptoms:** Scans stuck at 0% progress

**Check:**
```bash
# Is Redis running?
redis-cli ping

# Is worker running?
ps aux | grep "tsx.*scan-worker"

# Check Redis queue
redis-cli
> KEYS *
> LLEN bull:scans:wait
> LLEN bull:scans:active
```

**Fix:**
```bash
# Restart Redis
brew services restart redis

# Restart worker
cd ~/driftwatch-app
npm run worker:dev
```

---

### Issue: Database Connection Error
**Symptoms:** "Prisma Client initialization error"

**Check:**
```bash
# Is PostgreSQL running?
psql -U postgres -l

# Is DATABASE_URL correct in .env?
cat .env | grep DATABASE_URL
```

**Fix:**
```bash
# Start PostgreSQL
brew services start postgresql@14

# Run migrations
npx prisma migrate dev

# Regenerate Prisma Client
npx prisma generate
```

---

### Issue: Confetti Not Showing
**Symptoms:** No animation on email verification

**Check:**
1. Open browser DevTools Console
2. Look for errors
3. Check if `canvas-confetti` is loaded

**Fix:**
```bash
# Reinstall dependencies
npm install canvas-confetti

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

### Issue: Screenshots Not Capturing
**Symptoms:** Screenshots missing in results

**Check Worker Logs:**
- Look for Playwright errors
- Check timeout issues

**Fix:**
```bash
# Reinstall Playwright browsers
npx playwright install chromium

# Increase timeout in screenshot service
# Edit: src/lib/scanner/screenshot.ts
# Change: timeout: 30000 → timeout: 60000
```

---

### Issue: SEO Scanner Failing
**Symptoms:** SEO results empty or null

**Check:**
1. Worker logs for errors
2. URL accessibility
3. Page load time

**Fix:**
```bash
# Test URL manually
curl -I https://example.com

# Check if URL blocks bots
# Some sites block headless browsers

# Adjust user agent in SEO scanner
# Edit: src/lib/scanner/seo.ts
```

---

## 📊 Database Inspection

### View Recent Scans
```sql
SELECT
  id,
  status,
  progress,
  "currentPhase",
  score,
  "createdAt"
FROM "Run"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Check Scan Results
```sql
SELECT
  id,
  "a11yResults",
  "aiCritiqueResults",
  "perfResults",
  "seoResults",
  "visualDiffResults"
FROM "Run"
WHERE id = 'YOUR_RUN_ID';
```

### Count Scans by Status
```sql
SELECT status, COUNT(*)
FROM "Run"
GROUP BY status;
```

---

## 🔄 Reset Test Data

### Clear All Scans
```sql
TRUNCATE TABLE "Run" CASCADE;
TRUNCATE TABLE "Project" CASCADE;
```

### Clear Redis Queue
```bash
redis-cli FLUSHALL
```

### Reset Test User
```sql
DELETE FROM "User" WHERE email = 'test@example.com';
DELETE FROM "VerificationCode" WHERE email = 'test@example.com';
```

---

## 📝 Test Coverage Summary

| Feature | Status | Test Method |
|---------|--------|-------------|
| Email Verification Confetti | ✅ | Manual UI testing |
| Auto-Redirect | ✅ | Manual UI testing |
| Resend Code Cooldown | ✅ | Manual UI testing |
| Password Reset Flow | ✅ | Manual UI testing |
| Performance Scanning | ✅ | End-to-end scan + DB check |
| SEO Analysis | ✅ | End-to-end scan + DB check |
| Visual Regression | ✅ | End-to-end scan (2 runs) + DB check |

**Total Features Tested:** 7/7 (100%)

---

## 🎬 Quick Test Script

```bash
#!/bin/bash
# test-all-features.sh

echo "🚀 Starting DriftWatch Full Feature Test"

# 1. Check services
echo "1️⃣ Checking Redis..."
redis-cli ping || { echo "❌ Redis not running"; exit 1; }

echo "2️⃣ Checking PostgreSQL..."
psql -U postgres -c "SELECT 1" > /dev/null 2>&1 || { echo "❌ PostgreSQL not running"; exit 1; }

echo "3️⃣ Checking Next.js app..."
curl -s http://localhost:3000/api/health > /dev/null 2>&1 || { echo "❌ Next.js not running"; exit 1; }

echo "✅ All services running!"

# 2. Run database check
echo "4️⃣ Checking database schema..."
psql -U postgres driftwatch -c "\d Run" > /dev/null 2>&1 || { echo "❌ Database schema missing"; exit 1; }

echo "✅ Database schema OK!"

# 3. Check recent scans
echo "5️⃣ Recent scans:"
psql -U postgres driftwatch -c "SELECT id, status, score FROM \"Run\" ORDER BY \"createdAt\" DESC LIMIT 5;"

echo "✅ Test complete! Ready to test features manually."
```

Save and run:
```bash
chmod +x test-all-features.sh
./test-all-features.sh
```
