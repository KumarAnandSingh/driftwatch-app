# DriftWatch 🔍

> Unified quality report for your web app. Catch visual regressions, accessibility issues, and performance problems before your users do.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

![DriftWatch Hero](docs/images/hero-preview.png)

## ✨ Features

### 🔍 Comprehensive Scanning Engine
- ♿ **Accessibility Scanning** - WCAG 2.1 AA compliance checking with axe-core
- ⚡ **Performance Analysis** - Lighthouse integration for Core Web Vitals (FCP, LCP, TTI, CLS)
- 🔎 **SEO Analysis** - Meta tags, Open Graph, Twitter Cards, H1 validation, image alts
- 👁️ **Visual Regression** - Pixel-perfect screenshot comparison with diff highlighting
- 🤖 **AI Design Critique** - Intelligent UX/UI feedback powered by Claude AI
- 🔄 **Multi-Phase Scanning** - 7 scanning phases with real-time progress tracking

### 🔐 Authentication & Security
- 📧 **Email Verification** - Magic link with 6-digit OTP codes
- 🎉 **Enhanced UX** - Confetti animations on successful verification
- ⏱️ **Resend Cooldown** - 60-second timer to prevent spam
- 🔑 **Account Recovery** - Forgot password / trouble signing in flow
- 🔒 **Google OAuth** - One-click social authentication
- 🔐 **API Key Management** - Encrypted storage for user API keys (Anthropic)

### 📊 Dashboard & Monitoring
- 📈 **Real-time Progress** - Live scan progress with phase indicators
- 🎯 **Weighted Scoring** - Balanced 25% weights across all scan categories
- 📸 **Screenshot Gallery** - Full-page captures with responsive previews
- 📋 **Detailed Reports** - Comprehensive issue breakdown by severity
- 🔔 **Scan History** - Track changes over time with visual diffs

### 🛠️ Developer Experience
- ⚙️ **Background Jobs** - BullMQ worker for async scan processing
- 🗄️ **Prisma ORM** - Type-safe database operations
- 🎨 **Modern UI** - Tailwind CSS with shadcn/ui components
- 📱 **Responsive Design** - Mobile-first approach
- 🔥 **Hot Reload** - Fast development with tsx watch mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Redis 7.x or higher (for job queue)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/driftwatch.git
   cd driftwatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/driftwatch"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@yourdomain.com"

   # Redis
   REDIS_HOST="localhost"
   REDIS_PORT="6379"
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npm run db:migrate

   # Seed initial data (optional)
   npm run db:seed
   ```

5. **Start the development server**

   **IMPORTANT**: DriftWatch requires TWO processes to run:

   ```bash
   # Terminal 1: Start Next.js server
   npm run dev

   # Terminal 2: Start background worker
   npm run worker:dev
   ```

   Or use the convenience script:
   ```bash
   ./start-dev.sh
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

   > ⚠️ **Note**: Scans will not start without the worker process running! See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for detailed architecture information.

## 📦 Project Structure

```
driftwatch/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (marketing)/        # Marketing pages (home, features, pricing)
│   │   ├── (app)/              # Authenticated app pages (dashboard, projects)
│   │   ├── (auth)/             # Authentication pages (sign-in, sign-up, verify)
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components (15+ primitives)
│   │   ├── MarketingHeader.tsx # Marketing navigation
│   │   ├── AppHeader.tsx       # App navigation
│   │   ├── ProgressShimmer.tsx # Loading animations
│   │   ├── ScanHalo.tsx        # Gradient effects
│   │   └── SessionProvider.tsx # Auth provider
│   ├── lib/                    # Utilities and configurations
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── db.ts               # Prisma client
│   │   ├── email.ts            # Email service (Resend)
│   │   └── queue.ts            # BullMQ job queue
│   └── middleware.ts           # Next.js middleware
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Seed data
├── public/                     # Static assets
├── docs/                       # Documentation
│   ├── AI_FIX_ENGINE.md        # AI Fix Engine documentation
│   ├── PHASE2_COMPLETION_SUMMARY.md
│   ├── PHASE3_COMPLETION_SUMMARY.md
│   ├── DESIGN_FIX_REPORT.md
│   └── FIGMA_IMPLEMENTATION_COMPLETE.md
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Tech Stack

### Core
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[Redis](https://redis.io/)** - In-memory data store

### Authentication
- **[NextAuth.js v5](https://next-auth.js.org/)** - Authentication for Next.js
- **Email OTP** - Passwordless authentication
- **Google OAuth** - Social login

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives (24 components)
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component system
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set
- **[motion/react](https://motion.dev/)** - Animation library

### Job Queue
- **[BullMQ](https://docs.bullmq.io/)** - Redis-based job queue
- **[IORedis](https://github.com/luin/ioredis)** - Redis client

### Email
- **[Resend](https://resend.com/)** - Modern email API
- **[Nodemailer](https://nodemailer.com/)** - Email fallback

### Development
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (recommended)

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)

# Testing (to be implemented)
npm test             # Run tests
npm run test:e2e     # Run E2E tests
```

## 🎨 Design System

### Colors
- **Primary:** `hsl(262 80% 50%)` - Indigo brand color
- **Accent:** Purple gradients for emphasis
- **Success:** Green for completed states
- **Warning:** Amber for warnings
- **Error:** Red for errors

### Typography
- System fonts with proper fallbacks
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Animations
- Smooth fade-in transitions
- Gradient halo effects (4s loop)
- Hover scale interactions
- Shimmer loading states

### Responsive Breakpoints
- Mobile: 0-639px
- Tablet: 640-767px
- Desktop: 768-1023px
- Large: 1024px+

## 🔐 Authentication Flow

1. **Sign Up**
   - User enters email
   - Receives OTP code via email
   - Verifies OTP with confetti animation 🎉
   - Auto-redirects to dashboard (2s)
   - Alternative: Sign up with Google

2. **Sign In**
   - User enters email
   - Receives OTP code via email
   - Verifies OTP to access account
   - Alternative: Sign in with Google

3. **Account Recovery**
   - Click "Trouble signing in?" on login page
   - Enter email address
   - Receive magic link via email
   - Click link to sign in

4. **Session Management**
   - JWT-based sessions
   - Automatic session refresh
   - Secure cookie storage

## 🔍 Scan Phases

DriftWatch performs comprehensive multi-phase scanning with real-time progress tracking:

### Phase 1: Web Crawling (0-20%)
- Discovers pages from seed URL
- Respects `maxDepth` and `maxPages` limits
- Extracts internal links
- Builds sitemap for scanning

### Phase 2: Screenshot Capture (20-40%)
- Full-page screenshots for each URL
- High-quality 90% compression
- Mobile and desktop viewports
- Stored for visual regression

### Phase 3: Accessibility Scanning (40-60%)
- WCAG 2.1 AA compliance checks
- Powered by axe-core engine
- Categorizes issues by severity:
  - **Critical**: Major barriers
  - **Serious/Moderate**: Important issues
  - **Minor**: Best practice violations
- Reports violations with detailed explanations

### Phase 4: AI Design Critique (60%)
- Analyzes screenshots with Claude AI
- Evaluates UX/UI design quality
- Checks:
  - Visual hierarchy
  - Color contrast
  - Typography
  - Layout consistency
  - Brand alignment
- Provides actionable feedback

### Phase 5: Performance Analysis (60-70%)
- Lighthouse integration
- Metrics collected:
  - **FCP**: First Contentful Paint
  - **LCP**: Largest Contentful Paint
  - **TTI**: Time to Interactive
  - **TBT**: Total Blocking Time
  - **CLS**: Cumulative Layout Shift
- Performance score (0-100)

### Phase 6: SEO Analysis (70-80%)
- Comprehensive SEO checks:
  - Title tags (30-60 chars optimal)
  - Meta descriptions (120-160 chars optimal)
  - H1 tags (exactly one recommended)
  - Image alt attributes
  - Canonical URLs
  - Open Graph tags (Facebook/social)
  - Twitter Card tags
  - Robots meta tags
  - Viewport meta tags
  - Internal/external link analysis
- SEO score (0-100)

### Phase 7: Visual Regression (80-95%)
- Compares with previous scan (if exists)
- Pixel-perfect diff detection
- Highlights visual changes
- Generates diff images
- Percentage difference calculation
- Skips if no baseline found

### Phase 8: Finalize (95-100%)
- Calculates weighted final score:
  - Accessibility: 25%
  - AI Critique: 25%
  - Performance: 25%
  - SEO: 25%
- Saves results to database
- Cleans up temporary files
- Marks scan as complete

## 📊 Database Schema

### Users
- Email, name, profile image
- Email verification status
- Created/updated timestamps

### Verification Tokens
- Email OTP tokens
- Expiration timestamps
- One-time use enforcement

### Sessions
- User sessions
- Session tokens
- Expiration management

### Accounts
- OAuth provider accounts
- Provider-specific tokens

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub** (this repository)

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure environment variables**
   - Add all variables from `.env`
   - Ensure `NEXTAUTH_URL` matches your domain

4. **Deploy**
   - Vercel automatically deploys on push to `main`

### Environment Variables Checklist
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your production URL
- [ ] `NEXTAUTH_SECRET` - Random secret (run `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)
- [ ] `RESEND_API_KEY` - Email service API key
- [ ] `EMAIL_FROM` - Sender email address
- [ ] `REDIS_URL` - Redis connection URL
- [ ] `ANTHROPIC_API_KEY` - Anthropic API key for AI critique

### Database Setup (Production)

**Option 1: Vercel Postgres**
```bash
# Install Vercel CLI
npm i -g vercel

# Link to Vercel project
vercel link

# Create Postgres database
vercel postgres create

# Connect database
vercel env pull .env.local
```

**Option 2: Supabase**
- Create project at [supabase.com](https://supabase.com)
- Copy connection string to `DATABASE_URL`

**Option 3: Railway**
- Create project at [railway.app](https://railway.app)
- Add PostgreSQL service
- Copy connection string to `DATABASE_URL`

### Run Migrations
```bash
# Production migration
npx prisma migrate deploy
```

## 🧪 Testing (Planned)

### Unit Tests
- Component testing with Jest
- React Testing Library
- Coverage: 80%+ target

### Integration Tests
- API route testing
- Database operations
- Auth flow testing

### E2E Tests
- Playwright for browser automation
- Critical user journeys
- Visual regression testing

## 📈 Performance

### Build Metrics
- **Total Routes:** 13
- **Static Pages:** 10
- **Dynamic Pages:** 3
- **Build Time:** ~20 seconds

### Bundle Sizes
- **Home Page:** 40.6 kB → 143 kB first load
- **Dashboard:** 3.27 kB → 106 kB first load
- **Auth Pages:** ~3 kB each → ~110 kB first load

### Optimizations
- ✅ Static generation for marketing pages
- ✅ Code splitting per route
- ✅ Optimized images and assets
- ✅ Lazy loading animations
- ✅ Efficient CSS (Tailwind)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 🤖 AI Fix Engine

DriftWatch includes an intelligent AI-powered fix engine that automatically generates production-ready code fixes for accessibility, design, and performance issues.

### Key Features
- **Multi-Stage Algorithm**: 4-stage processing for high-quality fixes
  1. Issue Classification & Prioritization
  2. Context Analysis & Pattern Recognition
  3. Enhanced Fix Generation with WCAG 2.1 AA compliance
  4. Quality Validation & Best Practices Check

- **No Subscription Required**: Free with your own Anthropic API key
- **Smart Prioritization**: Automatically handles critical issues first
- **WCAG Compliance**: Ensures all fixes meet accessibility standards
- **Rate Limiting**: Built-in protection against API throttling
- **Fallback Handling**: Graceful degradation when generation fails

### How It Works

1. **Add Your API Key** (one-time setup)
   - Get free API key from [Anthropic Console](https://console.anthropic.com/settings/keys)
   - Go to Settings → API Keys
   - Paste your key (encrypted with AES-256)

2. **Generate Fixes**
   - View scan results with issues
   - Click "Fix It For Me" button
   - AI analyzes and generates fixes
   - See before/after code comparison

3. **Apply Fixes**
   - Copy optimized code snippets
   - Get detailed explanations
   - Understand the impact

### Documentation
For detailed technical documentation, see [AI_FIX_ENGINE.md](docs/AI_FIX_ENGINE.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Hosting platform
- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [shadcn/ui](https://ui.shadcn.com/) - Component system
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/driftwatch/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/driftwatch/discussions)

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Next.js 14 setup
- [x] Prisma + PostgreSQL
- [x] Authentication (Email OTP + Google OAuth)
- [x] BullMQ job queue
- [x] Figma design implementation

### Phase 2: Core Features ✅
- [x] Web crawler implementation
- [x] Screenshot capture service
- [x] Visual diff algorithm
- [x] Accessibility scanner integration
- [x] Performance metrics collection (Lighthouse)
- [x] SEO analysis scanner
- [x] AI critique service
- [x] Email verification with confetti
- [x] Account recovery flow

### Phase 3: Dashboard 📋
- [ ] Project management
- [ ] Run history
- [ ] Issue tracking
- [ ] Report generation
- [ ] Notifications

### Phase 4: Advanced Features 🎯
- [ ] Scheduled scans
- [ ] CI/CD integration
- [ ] Team collaboration
- [ ] Custom rule engine
- [ ] API for integrations

---

**Made with ❤️ by the DriftWatch team**

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** 2025-09-30
