.PHONY: help verify install dev build test lint typecheck clean docker-dev

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

verify: ## Run full verification (THE command to use)
	@echo "🚀 Running full verification..."
	@bash scripts/verify.sh | tee verify.log
	@node scripts/parse-verify.js verify.log
	@cat verify.json

install: ## Install dependencies with locked versions
	@if [ -f "pnpm-lock.yaml" ]; then \
		echo "📦 Installing with pnpm..."; \
		pnpm install --frozen-lockfile; \
	elif [ -f "package-lock.json" ]; then \
		echo "📦 Installing with npm..."; \
		npm ci; \
	elif [ -f "yarn.lock" ]; then \
		echo "📦 Installing with yarn..."; \
		yarn install --frozen-lockfile; \
	else \
		echo "⚠️  No lockfile found, using npm install"; \
		npm install; \
	fi

dev: ## Start development server
	@npm run dev

build: ## Build for production
	@npm run build

test: ## Run tests
	@npm test

lint: ## Run linter
	@npm run lint

typecheck: ## Run type checking
	@npm run typecheck

clean: ## Clean build artifacts and dependencies
	@echo "🧹 Cleaning..."
	@rm -rf node_modules dist build .next out verify.log verify.json
	@echo "✅ Clean complete"

docker-dev: ## Start development environment in Docker
	@docker-compose up --build

docker-verify: ## Run verification in Docker (CI-like environment)
	@docker-compose run --rm app make verify

# Security and supply chain
security: ## Run security checks
	@echo "🔒 Running security checks..."
	@bash scripts/security-check.sh

sbom: ## Generate Software Bill of Materials
	@echo "📋 Generating SBOM..."
	@npx @cyclonedx/cyclonedx-npm --output-file sbom.json || \
		echo "⚠️  Install @cyclonedx/cyclonedx-npm for SBOM generation"

# Database operations
db-migrate-up: ## Run database migrations (forward)
	@npm run migrate:up

db-migrate-down: ## Rollback database migrations
	@npm run migrate:down

db-test: ## Test migration safety (up + down)
	@bash scripts/test-migrations.sh

# Preview and smoke tests
preview: ## Start preview server
	@npm run preview

smoke: ## Run smoke tests against running server
	@bash scripts/smoke.sh ${URL:-http://localhost:5173}

# Coverage
coverage: ## Run tests with coverage
	@npm test -- --coverage

# Lighthouse (performance budgets)
lighthouse: ## Run Lighthouse CI checks
	@npx @lhci/cli@0.12.x autorun || \
		echo "⚠️  Configure lighthouserc.json for Lighthouse CI"

# Accessibility
a11y: ## Run accessibility checks
	@npx @axe-core/cli http://localhost:5173 || \
		echo "⚠️  Start dev server first: make dev"

# API contract tests
contracts: ## Run API contract tests
	@if [ -f "openapi.yaml" ]; then \
		npx schemathesis run openapi.yaml --base-url ${API_URL:-http://localhost:3000}; \
	else \
		echo "⚠️  No openapi.yaml found"; \
	fi

# Git hooks
hooks: ## Install git hooks
	@echo "🪝 Installing git hooks..."
	@if [ -f "scripts/pre-commit.sh" ]; then \
		ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit; \
		chmod +x .git/hooks/pre-commit; \
		echo "✅ Pre-commit hook installed"; \
	fi
	@if [ -f "scripts/pre-push.sh" ]; then \
		ln -sf ../../scripts/pre-push.sh .git/hooks/pre-push; \
		chmod +x .git/hooks/pre-push; \
		echo "✅ Pre-push hook installed"; \
	fi
