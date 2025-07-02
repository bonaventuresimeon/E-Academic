# 🎓 Academic Management Platform

A comprehensive university Customer Relationship Management (CRM) system built with modern web technologies. Features role-based access control, course management, assignment workflows, and AI-powered educational tools.

![Academic Platform](https://img.shields.io/badge/Platform-Academic%20CRM-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## ✨ Features

### 👥 Role-Based Access Control
- **Students**: Course enrollment, assignment submission, grade tracking
- **Lecturers**: Course creation, assignment management, student grading
- **Administrators**: User management, enrollment approval, system oversight

### 📚 Course Management
- Course creation and catalog browsing
- Department-based organization
- Enrollment workflow with approval system
- File upload support for syllabi and materials

### 📝 Assignment System
- Assignment creation with due dates and weightings
- File and text submission support
- Automated grade calculations
- Feedback system for student submissions

### 🤖 AI Integration
- **Course Recommendations**: Personalized suggestions based on student interests
- **Syllabus Generation**: AI-powered comprehensive course syllabi
- **Smart Analytics**: Data-driven insights for educational outcomes

### 🗄️ Multi-Database Support
- **PostgreSQL** (recommended for production)
- **MySQL** (alternative for existing infrastructure)
- **SQLite** (local development)

## 🚀 Quick Start

### One-Click Deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Local Development

```bash
# Clone repository
git clone https://github.com/bonaventuresimeon/AcademicCRM.git
cd AcademicCRM

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:5000` to access the application.

## 🌐 Deployment Options

### Platform Support

| Platform | Complexity | Best For | Auto-Database |
|----------|------------|----------|---------------|
| **Render** | ⭐ Easy | Production apps | ✅ Yes |
| **Fly.io** | ⭐⭐ Medium | Global deployment | ❌ Manual |
| **Vercel** | ⭐⭐ Medium | Serverless apps | ❌ Manual |
| **Docker** | ⭐⭐⭐ Advanced | Self-hosting | ✅ Included |

### Universal Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to your platform of choice
./scripts/deploy.sh render    # Render (recommended)
./scripts/deploy.sh fly       # Fly.io
./scripts/deploy.sh vercel    # Vercel
./scripts/deploy.sh docker    # Docker
./scripts/deploy.sh local     # Local development
```

### Manual Platform Setup

<details>
<summary><strong>🔶 Render Deployment</strong></summary>

1. Fork this repository
2. Connect to [Render](https://render.com)
3. Render auto-detects `render.yaml` configuration
4. Database is automatically provisioned
5. Environment variables are auto-generated

**Deployment Time**: ~5 minutes
</details>

<details>
<summary><strong>🔷 Fly.io Deployment</strong></summary>

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch application
fly launch

# Set environment variables
fly secrets set DATABASE_URL="your_database_url"
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)"
fly secrets set OPENAI_API_KEY="your_openai_key"  # optional

# Deploy
fly deploy
```

**Deployment Time**: ~3 minutes
</details>

<details>
<summary><strong>🟢 Vercel Deployment</strong></summary>

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL production
vercel env add SESSION_SECRET production
vercel env add OPENAI_API_KEY production

# Deploy to production
vercel --prod
```

**Deployment Time**: ~2 minutes
</details>

<details>
<summary><strong>🐳 Docker Deployment</strong></summary>

```bash
# Quick start with Docker Compose
docker-compose up -d

# Or build manually
docker build -t academic-platform .
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e SESSION_SECRET="your-secret" \
  academic-platform
```

**Deployment Time**: ~1 minute
</details>

## 🗄️ Database Configuration

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://username:password@hostname:5432/database
SESSION_SECRET=your-super-secret-session-key

# Optional
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_TYPE=postgresql  # Override auto-detection
NODE_ENV=production
PORT=5000
```

### Database Providers

**PostgreSQL Options:**
- **Render PostgreSQL** (auto-provisioned)
- **Neon** (serverless): `postgresql://user:pass@hostname.neon.tech:5432/db`
- **Supabase**: `postgresql://postgres:pass@hostname.supabase.co:5432/postgres`
- **Local**: `postgresql://postgres:password@localhost:5432/academic_platform`

**MySQL Options:**
- **PlanetScale**: `mysql://user:pass@hostname.psdb.cloud/db?sslaccept=strict`
- **Local**: `mysql://root:password@localhost:3306/academic_platform`

**SQLite (Development):**
- `file:./dev.db`

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS with Shadcn/UI components
- TanStack Query for state management
- React Hook Form with Zod validation

**Backend:**
- Express.js with TypeScript
- Drizzle ORM with multi-database support
- Passport.js authentication
- OpenAI API integration
- Multer for file uploads

**Database:**
- PostgreSQL (primary)
- MySQL/SQLite (alternatives)
- Automated migrations with Drizzle Kit

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configuration
├── server/                # Express backend
│   ├── services/          # Business logic (AI, file upload)
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   └── auth.ts           # Authentication logic
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── scripts/              # Deployment and utility scripts
└── migrations/           # Database migrations
```

## 🔧 Development

### Prerequisites

- Node.js 20+
- Database (PostgreSQL recommended)
- Git

### Setup Instructions

1. **Clone and install:**
   ```bash
   git clone https://github.com/bonaventuresimeon/AcademicCRM.git
   cd AcademicCRM
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database initialization:**
   ```bash
   npm run db:push
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Push schema to database
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
```

### API Endpoints

```bash
# Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/user

# Courses
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PUT    /api/courses/:id

# Assignments
GET    /api/assignments
POST   /api/assignments
GET    /api/assignments/:id

# Enrollments
GET    /api/enrollments
POST   /api/enrollments
PUT    /api/enrollments/:id

# AI Features
POST   /api/ai/recommendations
POST   /api/ai/syllabus

# Health Check
GET    /api/health
```

## 🤖 AI Features

### Course Recommendations

```typescript
// Generate personalized course recommendations
POST /api/ai/recommendations
{
  "interests": "computer science, web development",
  "level": "intermediate",
  "goals": "full-stack development"
}
```

### Syllabus Generation

```typescript
// Generate comprehensive course syllabus
POST /api/ai/syllabus
{
  "title": "Web Development Fundamentals",
  "description": "Introduction to modern web development",
  "duration": 12,
  "credits": 3
}
```

## 🛡️ Security

### Authentication
- Session-based authentication with secure cookies
- Password hashing with scrypt
- Role-based access control (RBAC)
- CSRF protection

### Database Security
- Parameterized queries (SQL injection prevention)
- Connection pooling
- Environment-based configuration
- Encrypted session storage

### File Upload Security
- File type validation
- Size limits
- Secure file storage
- Path traversal prevention

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:5000/api/health

# Database connectivity
curl http://localhost:5000/api/health/db
```

### Logging

- Structured logging with timestamps
- Request/response logging
- Error tracking and reporting
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow existing code patterns
- Add tests for new features
- Update documentation
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com) for the component library
- [Drizzle ORM](https://orm.drizzle.team) for database operations
- [OpenAI](https://openai.com) for AI capabilities
- [Replit](https://replit.com) for development platform

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/bonaventuresimeon/AcademicCRM/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bonaventuresimeon/AcademicCRM/discussions)

---

**Made with ❤️ for educational institutions worldwide**