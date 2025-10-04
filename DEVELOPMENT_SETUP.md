# DriftWatch Development Setup

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14
- Redis

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Run database migrations
npm run db:migrate

# 4. Seed database (optional)
npm run db:seed
```

### Running DriftWatch

**Option 1: Easy Start (Recommended)**
```bash
./start-dev.sh
```

**Option 2: Manual Start (two terminals)**

Terminal 1 - Next.js Server:
```bash
npm run dev
```

Terminal 2 - Background Worker:
```bash
npm run worker:dev
```

### Architecture

DriftWatch uses a **queue-based architecture**:

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Browser   │─────▶│  Next.js API │─────▶│   Redis    │
│  (Frontend) │      │   (Server)   │      │   Queue    │
└─────────────┘      └──────────────┘      └────────────┘
                                                   │
                                                   ▼
                                           ┌────────────┐
                                           │   Worker   │
                                           │  Process   │
                                           └────────────┘
                                                   │
                                                   ▼
                                           ┌────────────┐
                                           │ PostgreSQL │
                                           └────────────┘
```

**Required Processes:**
1. ✅ **PostgreSQL** - Database (runs as system service)
2. ✅ **Redis** - Job queue (runs as system service)
3. ✅ **Next.js Server** - API + Frontend (`npm run dev`)
4. ⚠️ **Background Worker** - Processes scan jobs (`npm run worker:dev`)

### Common Issues

#### Scan stuck at "Preparing Scan... 0%"
**Cause:** Background worker is not running
**Solution:** Run `npm run worker:dev` in a separate terminal

#### "Failed to create project"
**Cause:** NextAuth v5 API migration issue
**Solution:** Already fixed in latest commit (7d0d051)

#### Google OAuth Error 400
**Cause:** Redirect URI not configured in Google Cloud Console
**Solution:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run worker:dev       # Start background worker (REQUIRED!)
./start-dev.sh          # Start both server + worker

# Database
npm run db:migrate      # Run Prisma migrations
npm run db:seed         # Seed database with test data
npm run db:studio       # Open Prisma Studio GUI

# Build
npm run build           # Production build
npm run start           # Start production server

# Testing
npm run test            # Run Playwright tests
npm run test:ui         # Run tests with UI
```

### Environment Variables

Required variables in `.env`:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Redis (defaults work for local dev)
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Email (optional - logs to console if not set)
RESEND_API_KEY="re_..."

# Anthropic AI (for AI Critique feature)
ANTHROPIC_API_KEY="sk-ant-..."
```

### Development Workflow

1. **Create a new feature:**
   ```bash
   git checkout -b feature/my-feature
   # Make changes
   git add .
   git commit -m "feat: Add new feature"
   ```

2. **Test locally:**
   - Frontend: http://localhost:3000
   - Database: `npm run db:studio`
   - Check worker logs for scan progress

3. **Push to GitHub:**
   ```bash
   git push origin feature/my-feature
   ```

### Production Deployment

DriftWatch requires:
- Next.js hosting (Vercel, Railway, etc.)
- PostgreSQL database
- Redis instance
- **Separate worker dyno/instance**

Example (Railway):
1. Main service: `npm start` (Next.js server)
2. Worker service: `npm run worker` (background jobs)
3. Add-ons: PostgreSQL + Redis

### Troubleshooting

**Worker not processing jobs:**
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG

# Check Redis queue
redis-cli
> KEYS *
> LLEN bull:scans:wait
```

**Database connection errors:**
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@14
```

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Project Structure

```
driftwatch-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (app)/          # Authenticated app pages
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── (marketing)/    # Public marketing pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   │   ├── scanner/        # Scanning logic (crawler, a11y, etc.)
│   │   └── queue.ts        # BullMQ configuration
│   └── workers/            # Background job processors
│       └── scan-worker.ts  # Main scan worker (CRITICAL!)
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
├── start-dev.sh           # Development startup script
└── package.json           # Dependencies & scripts
```

### Support

- Issues: [GitHub Issues](https://github.com/KumarAnandSingh/driftwatch-app/issues)
- Documentation: See `PRODUCT_EXPERIENCE_PLAN.md` for feature roadmap
- Status: See `IMPLEMENTATION_STATUS.md` for completion status

---

**Remember:** Always run **both** the Next.js server AND the background worker!
