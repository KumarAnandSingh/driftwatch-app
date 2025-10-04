# Changelog

All notable changes to DriftWatch will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced scanner timeout handling for complex JavaScript-heavy websites
- Fallback navigation strategies for improved crawling reliability
- Multi-org dashboard with proper data isolation
- Share functionality for scan results (copy URL to clipboard)
- Export to PDF functionality for scan results
- Billing page with pricing plans (Free, Pro, Enterprise)
- Comprehensive development setup documentation

### Changed
- **BREAKING**: Increased default timeout from 30s to 60s for all scanners
- Crawler now uses `domcontentloaded` → `load` fallback instead of strict `networkidle`
- Screenshot service now uses same fallback strategy as crawler
- Accessibility scanner now uses same fallback strategy for consistency
- Screenshot paths changed from `/api/screenshots/` to `/artifacts/`
- Extended wait time for dynamic content from 1s to 2s

### Fixed
- **Critical**: Scans failing on JavaScript-heavy sites like chess.com
- Dashboard showing 0 projects due to incorrect Prisma queries (missing org relationship)
- Recent scans not appearing in dashboard (org membership query issue)
- Runtime error: "Cannot read properties of undefined (reading 'map')" in AI Insights tab
- Runtime error: "Cannot read properties of undefined (reading 'length')" in results page
- TypeError: "href.startsWith is not a function" when crawling links with non-string href values
- Null safety issues with `pageResult.issues` array in multiple locations
- Broken screenshot images in Screenshots tab
- Non-functional Share button in results page
- Non-functional Export PDF button in results page
- Billing page 404 error

### Security
- Added comprehensive `.gitignore` rules for sensitive files
- Protected API keys and credentials from Git tracking
- Added test output and artifact exclusions
- Verified no hardcoded secrets in source code

## [0.1.0] - 2024-10-02

### Added
- Initial release of DriftWatch
- 5-step project wizard for creating new scans
- Real-time scanning progress with live updates
- Multi-phase scanning: Crawl → Screenshots → Accessibility → AI Critique
- Comprehensive results page with 5 tabs (Overview, Accessibility, AI Insights, Screenshots, Pages)
- BullMQ + Redis queue architecture for background job processing
- Playwright-based web crawling with depth control
- Axe-core accessibility scanning (WCAG 2.1 AA compliance)
- Anthropic Claude AI-powered design critique
- Google OAuth authentication with NextAuth v5
- Multi-organization support with role-based access
- PostgreSQL database with Prisma ORM
- Responsive UI built with Tailwind CSS and shadcn/ui

---

## Migration Guide

### Upgrading to Unreleased Version

**Environment Variables:**
No new environment variables required. Existing scanners will automatically use new timeout and fallback strategies.

**Database:**
No schema changes required.

**Breaking Changes:**
1. Scans will now take slightly longer (up to 60s timeout instead of 30s) but will have higher success rates on complex sites.
2. Screenshot artifacts location changed - if you have existing screenshots, they should be in `/public/artifacts/` not `/public/api/screenshots/`.

**Benefits:**
- ✅ Scans now work on JavaScript-heavy sites (chess.com, complex SPAs)
- ✅ Dashboard correctly shows all projects across user's organizations
- ✅ Scan results display without runtime errors
- ✅ Share and export functionality now works
