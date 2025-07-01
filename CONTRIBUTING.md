# Contributing to Academic Management Platform

Thank you for considering contributing to the Academic Management Platform! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Architecture Guidelines](#architecture-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 20 or higher
- PostgreSQL database access
- Git configured with your GitHub account
- Basic knowledge of React, TypeScript, and Express.js

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AcademicCRM.git
   cd AcademicCRM
   ```

## Development Setup

1. Install dependencies:
   ```bash
   ./scripts/install-deps.sh
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Set up your database:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Prefer `interface` over `type` for object shapes
- Use strict mode and avoid `any` type

### React Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Use React Query for server state management

### CSS Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic HTML elements
- Maintain consistent spacing and typography

### Database Guidelines

- Use Drizzle ORM for all database operations
- Define proper relations in schema
- Use migrations for schema changes
- Follow PostgreSQL naming conventions

## Commit Guidelines

We follow conventional commits specification:

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add role-based access control
fix(api): resolve course enrollment validation
docs(readme): update deployment instructions
style(ui): improve button component styling
refactor(db): optimize course queries
test(auth): add unit tests for login flow
chore(deps): update dependencies to latest versions
```

## Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Add/update tests as needed
   - Ensure all tests pass

3. **Test your changes**:
   ```bash
   npm run check
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure CI/CD pipeline passes

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Issue Reporting

When reporting issues, please include:

### Bug Reports

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

### Feature Requests

- **Description**: Clear description of the feature
- **Use Case**: Why this feature is needed
- **Acceptance Criteria**: How to know when it's complete
- **Mockups**: If applicable

## Architecture Guidelines

### File Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and config
├── server/                # Express backend
│   ├── services/          # Business logic
│   └── ...               # Server configuration
├── shared/               # Shared types and schemas
└── scripts/              # Build and deployment scripts
```

### Adding New Features

1. **Database Changes**:
   - Update `shared/schema.ts`
   - Add relations if needed
   - Run `npm run db:push`

2. **API Endpoints**:
   - Add to `server/routes.ts`
   - Use proper validation
   - Implement in `server/storage.ts`

3. **Frontend Components**:
   - Create in appropriate directory
   - Use TypeScript interfaces
   - Follow existing patterns

4. **Testing**:
   - Add unit tests for utilities
   - Test API endpoints
   - Test UI components

### Security Considerations

- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines
- Sanitize file uploads

### Performance Guidelines

- Optimize database queries
- Use React Query for caching
- Implement proper loading states
- Minimize bundle sizes
- Use lazy loading where appropriate

## Getting Help

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Be respectful and constructive

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards other contributors

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special mentions for outstanding contributions

Thank you for contributing to the Academic Management Platform!