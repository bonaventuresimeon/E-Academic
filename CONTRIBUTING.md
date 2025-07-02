# Contributing to Academic Management Platform

Thank you for your interest in contributing to the Academic Management Platform! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/AcademicCRM.git
   cd AcademicCRM
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
5. **Initialize database:**
   ```bash
   npm run db:push
   ```
6. **Start development server:**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use camelCase for variables, PascalCase for components

### Architecture Patterns

- **Frontend**: React functional components with hooks
- **Backend**: Express.js with service layer architecture
- **Database**: Drizzle ORM with schema-first approach
- **Validation**: Zod schemas for all data validation
- **Error Handling**: Consistent error responses across API

### File Structure

```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utilities and configuration
├── server/
│   ├── services/      # Business logic
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Database operations
│   └── auth.ts        # Authentication logic
├── shared/
│   └── schema.ts      # Database schema and types
└── scripts/           # Deployment and utility scripts
```

## 🛠️ Development Process

### 1. Feature Development

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow existing code patterns
   - Add TypeScript types for new features
   - Include proper error handling

3. **Test your changes:**
   ```bash
   npm run check      # TypeScript checking
   npm run dev        # Test locally
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### 2. Database Changes

When modifying the database schema:

1. **Update schema:**
   ```typescript
   // In shared/schema.ts
   export const newTable = pgTable("new_table", {
     id: serial("id").primaryKey(),
     // ... other fields
   });
   ```

2. **Update types:**
   ```typescript
   export type NewTable = typeof newTable.$inferSelect;
   export type InsertNewTable = typeof newTable.$inferInsert;
   ```

3. **Update storage interface:**
   ```typescript
   // In server/storage.ts
   export interface IStorage {
     // Add new methods
     getNewTable(id: number): Promise<NewTable | undefined>;
     createNewTable(data: InsertNewTable): Promise<NewTable>;
   }
   ```

4. **Push schema changes:**
   ```bash
   npm run db:push
   ```

### 3. API Development

When adding new API endpoints:

1. **Add route:**
   ```typescript
   // In server/routes.ts
   app.get("/api/new-endpoint", requireAuth, async (req, res) => {
     try {
       const result = await storage.getNewData();
       res.json(result);
     } catch (error) {
       res.status(500).json({ message: "Error message" });
     }
   });
   ```

2. **Add validation:**
   ```typescript
   const newDataSchema = z.object({
     field: z.string().min(1),
   });
   
   app.post("/api/new-endpoint", requireAuth, async (req, res) => {
     try {
       const data = newDataSchema.parse(req.body);
       // Process data
     } catch (error) {
       res.status(400).json({ message: "Validation error" });
     }
   });
   ```

### 4. Frontend Development

When adding new components:

1. **Create component:**
   ```typescript
   // components/new-component.tsx
   interface NewComponentProps {
     data: SomeType;
     onAction: (id: number) => void;
   }
   
   export default function NewComponent({ data, onAction }: NewComponentProps) {
     // Component implementation
   }
   ```

2. **Add to page:**
   ```typescript
   // pages/some-page.tsx
   import NewComponent from "@/components/new-component";
   ```

3. **Use TanStack Query:**
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['/api/some-data'],
     enabled: !!someCondition,
   });
   ```

## 🧪 Testing

### Manual Testing

1. **Test all user roles:**
   - Create accounts for student, lecturer, admin
   - Test role-specific features

2. **Test database operations:**
   - Create, read, update operations
   - Test with different database types

3. **Test deployment:**
   ```bash
   npm run build
   npm start
   ```

### Automated Testing (Future)

We plan to add:
- Unit tests for utilities and services
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📝 Documentation

### Code Documentation

- **Comments**: Add JSDoc comments for functions
- **README**: Update README.md for new features
- **API**: Document new endpoints in README

### Example JSDoc:

```typescript
/**
 * Calculates the final grade for a student based on assignments
 * @param assignments - Array of assignment submissions
 * @param weights - Grade weights for each assignment
 * @returns Final calculated grade as percentage
 */
function calculateFinalGrade(assignments: Assignment[], weights: number[]): number {
  // Implementation
}
```

## 🔒 Security Guidelines

### Authentication

- **Always use requireAuth middleware** for protected routes
- **Validate user permissions** before operations
- **Hash passwords** using the existing auth system

### Database Security

- **Use parameterized queries** (automatic with Drizzle)
- **Validate all inputs** with Zod schemas
- **Sanitize file uploads** using existing upload middleware

### API Security

- **Rate limiting**: Implement for public endpoints
- **Input validation**: Always validate request data
- **Error handling**: Don't expose sensitive information

## 📦 Deployment

### Before Submitting

1. **Test locally:**
   ```bash
   npm run dev
   ```

2. **Check TypeScript:**
   ```bash
   npm run check
   ```

3. **Test build:**
   ```bash
   npm run build
   ```

4. **Test deployment script:**
   ```bash
   ./scripts/deploy.sh local
   ```

## 🐛 Bug Reports

When reporting bugs:

1. **Use GitHub Issues**
2. **Include reproduction steps**
3. **Provide environment details:**
   - Node.js version
   - Database type
   - Operating system
   - Browser (for frontend issues)

### Bug Report Template

```markdown
**Bug Description**
Brief description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Node.js version:
- Database:
- OS:
- Browser:

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and problem it solves
3. **Provide mockups** if applicable
4. **Consider implementation complexity**

### Feature Request Template

```markdown
**Feature Description**
Clear description of the requested feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, or other relevant information
```

## 🏆 Recognition

Contributors will be:
- **Listed in README.md**
- **Mentioned in release notes**
- **Credited in commit history**

## 📞 Getting Help

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check README.md and DEPLOYMENT.md

## 📜 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Focus on what's best** for the community
- **Show empathy** towards other community members
- **Accept constructive criticism** gracefully

### Unacceptable Behavior

- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

Thank you for contributing to the Academic Management Platform! Your efforts help make education technology better for institutions worldwide.