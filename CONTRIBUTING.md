# Contributing to DriftWatch 🤝

Thank you for your interest in contributing to DriftWatch! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Redis 7.x or higher
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/driftwatch.git
   cd driftwatch
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/driftwatch.git
   ```

### Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Set up database**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features (e.g., `feature/add-dark-mode`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `test/` - Test additions or updates (e.g., `test/add-unit-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add dark mode toggle"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit the PR

## 💻 Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Strict mode** is enabled - no `any` types
- **Define interfaces** for component props and API responses
- **Use type inference** where possible

**Example:**
```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function User({ name, email, role }: UserProps) {
  return <div>{name}</div>;
}

// ❌ Bad
function User(props: any) {
  return <div>{props.name}</div>;
}
```

### React Components

- **Use functional components** with hooks
- **Name components** with PascalCase
- **Keep components small** and focused
- **Use composition** over inheritance

**Example:**
```typescript
// ✅ Good
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <LoadingSpinner />;

  return (
    <div>
      <UserAvatar src={user.image} />
      <UserInfo name={user.name} email={user.email} />
    </div>
  );
}
```

### File Naming

- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Pages:** kebab-case (e.g., `user-profile/page.tsx`)
- **API routes:** kebab-case (e.g., `api/auth/signin/route.ts`)

### Code Style

- **Use 2 spaces** for indentation
- **Use single quotes** for strings
- **No semicolons** (optional, but be consistent)
- **Arrow functions** preferred
- **Destructure props** when possible
- **Use const** over let when possible

**Run ESLint:**
```bash
npm run lint
```

### CSS/Tailwind

- **Use Tailwind utility classes** first
- **Follow mobile-first** approach
- **Use design tokens** from globals.css
- **Group related classes** together

**Example:**
```typescript
// ✅ Good
<div className="flex items-center gap-4 p-6 rounded-lg bg-card border border-border">
  <UserAvatar />
  <UserInfo />
</div>

// ❌ Bad - inconsistent spacing, no semantic grouping
<div className="p-6 flex rounded-lg items-center bg-card gap-4 border border-border">
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no code change)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks, dependencies
- **ci:** CI/CD changes
- **revert:** Revert a previous commit

### Examples

```bash
# Feature
feat(auth): add Google OAuth login

# Bug fix
fix(dashboard): resolve project card rendering issue

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(api): simplify user authentication logic

# Multiple lines
feat(scanner): add accessibility scan feature

- Integrate aXe-core for WCAG compliance
- Add ARIA validation
- Generate detailed reports

Closes #123
```

### Rules

- **Subject line:**
  - Use imperative mood ("add" not "added")
  - Don't capitalize first letter
  - No period at the end
  - Max 72 characters

- **Body:**
  - Wrap at 72 characters
  - Explain what and why, not how
  - Reference issues/PRs

## 🔀 Pull Request Process

### Before Submitting

1. **Ensure tests pass**: `npm test`
2. **Run linting**: `npm run lint`
3. **Test locally**: Verify all functionality works
4. **Update documentation**: If needed
5. **Rebase on main**: Keep commits clean

### PR Title

Use the same format as commit messages:

```
feat(auth): add password reset functionality
```

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **At least one approval** from maintainers
3. **All conversations resolved**
4. **Up-to-date with main branch**

### After Approval

- Maintainers will merge using "Squash and merge"
- Your branch will be automatically deleted
- Changes will be deployed automatically

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run with coverage
npm test:coverage

# Run E2E tests
npm run test:e2e
```

### Writing Tests

**Unit Tests (Components):**
```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile name="John Doe" email="john@example.com" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays email when provided', () => {
    render(<UserProfile name="John Doe" email="john@example.com" />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

**API Tests:**
```typescript
import { POST } from '@/app/api/auth/signin/route';

describe('POST /api/auth/signin', () => {
  it('returns 400 for invalid email', async () => {
    const request = new Request('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### Test Coverage

- **Minimum coverage:** 80%
- **Critical paths:** 100% coverage
- **New features:** Must include tests

## 📚 Documentation

### Code Documentation

- **Complex logic:** Add comments explaining why
- **Public APIs:** Add JSDoc comments
- **Types:** Self-documenting with TypeScript

**Example:**
```typescript
/**
 * Generates a secure OTP code for email verification
 * @param length - Length of the OTP (default: 6)
 * @returns A random numeric OTP string
 */
export function generateOTP(length: number = 6): string {
  // Implementation
}
```

### Documentation Updates

When making changes, update:
- **README.md** - If affecting setup/usage
- **API documentation** - If adding/changing APIs
- **Component documentation** - If adding/changing components
- **Migration guides** - If breaking changes

## 🎯 What to Contribute

### Good First Issues

Look for issues labeled `good first issue`:
- Bug fixes
- Documentation improvements
- UI/UX enhancements
- Test coverage improvements

### Feature Requests

Before starting work on a new feature:
1. **Check existing issues/PRs**
2. **Open a discussion** to propose the feature
3. **Wait for feedback** from maintainers
4. **Create an issue** with detailed requirements
5. **Get approval** before starting work

### Bug Reports

When reporting bugs:
- **Use the issue template**
- **Provide reproduction steps**
- **Include error messages/screenshots**
- **Specify your environment** (OS, browser, Node version)

## 💬 Communication

### Channels

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - Questions, ideas
- **Pull Requests** - Code review, technical discussion

### Asking Questions

- Search existing issues/discussions first
- Provide context and examples
- Be respectful and patient

## 🏆 Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Given credit in documentation

## 📞 Getting Help

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/driftwatch/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/driftwatch/discussions)

---

**Thank you for contributing to DriftWatch! 🎉**

Your contributions help make web quality testing better for everyone.
