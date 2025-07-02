# 🚀 Academic Management Platform - Deployment Guide

## Quick Start

The platform supports multiple databases and deployment options for maximum flexibility:

### 📊 Supported Databases
- **PostgreSQL** (recommended for production)
- **MySQL** (alternative for existing MySQL infrastructure)
- **SQLite** (local development only)

### 🌐 Supported Platforms
- **Render** (easiest deployment)
- **Fly.io** (global edge deployment)
- **Vercel** (serverless deployment)
- **Docker** (containerized deployment)
- **Local** (development)

## 🔧 Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your database URL:**
   ```bash
   # PostgreSQL (recommended)
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   
   # MySQL
   DATABASE_URL=mysql://username:password@localhost:3306/database_name
   
   # SQLite (local only)
   DATABASE_URL=file:./dev.db
   ```

3. **Set other required variables:**
   ```bash
   SESSION_SECRET=your-super-secret-session-key-here
   OPENAI_API_KEY=your-openai-api-key-here  # optional
   ```

## 🚀 One-Click Deployment

### Option 1: Render (Recommended)

1. Fork this repository
2. Connect to Render
3. Render will automatically detect `render.yaml` and deploy
4. Database will be automatically provisioned

### Option 2: Quick Deploy Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to your platform of choice
./scripts/deploy.sh render    # Deploy to Render
./scripts/deploy.sh fly       # Deploy to Fly.io
./scripts/deploy.sh vercel    # Deploy to Vercel
./scripts/deploy.sh docker    # Run with Docker
./scripts/deploy.sh local     # Local development
```

## 🗄️ Database Configuration

### PostgreSQL Providers

**Render PostgreSQL:**
```bash
# Automatically provided by Render
DATABASE_URL=postgres://user:pass@hostname:5432/dbname
```

**Neon (Serverless):**
```bash
DATABASE_URL=postgresql://user:pass@hostname.neon.tech:5432/dbname
```

**Supabase:**
```bash
DATABASE_URL=postgresql://postgres:password@hostname.supabase.co:5432/postgres
```

**Local PostgreSQL:**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/academic_platform
```

### MySQL Configuration

**PlanetScale:**
```bash
DATABASE_URL=mysql://username:password@hostname.psdb.cloud/database_name?sslaccept=strict
```

**Local MySQL:**
```bash
DATABASE_URL=mysql://root:password@localhost:3306/academic_platform
```

### SQLite (Development Only)

```bash
DATABASE_URL=file:./dev.db
```

## 🔒 Environment Variables

### Required Variables
- `DATABASE_URL` - Database connection string
- `SESSION_SECRET` - Session encryption key (generate with `openssl rand -base64 32`)

### Optional Variables
- `OPENAI_API_KEY` - For AI features (course recommendations, syllabus generation)
- `DATABASE_TYPE` - Override auto-detection (`postgresql`, `mysql`, `sqlite`)
- `NODE_ENV` - Environment (`development`, `production`)
- `PORT` - Server port (default: 5000)

## 🐳 Docker Deployment

### Quick Start
```bash
docker-compose up -d
```

### Custom Database
```bash
# PostgreSQL
docker-compose up -d

# MySQL
docker-compose --profile mysql up -d
```

### Production Docker
```bash
docker build -t academic-platform .
docker run -p 5000:5000 -e DATABASE_URL="your_db_url" academic-platform
```

## ☁️ Platform-Specific Instructions

### Render
1. Connect GitHub repository
2. Render auto-detects `render.yaml`
3. Database is automatically provisioned
4. Environment variables are auto-generated

### Fly.io
```bash
fly launch
fly secrets set DATABASE_URL="your_database_url"
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)"
fly deploy
```

### Vercel
```bash
vercel
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel --prod
```

## 🔧 Manual Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Push schema to database
npm run db:push

# For development with migrations
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
```

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```

## 🚨 Troubleshooting

### Database Connection Issues

**PostgreSQL SSL Issues:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

**Connection Timeouts:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?connect_timeout=10
```

### Common Errors

**"DATABASE_URL must be set"**
- Ensure DATABASE_URL is set in your environment
- Check .env file exists and is properly formatted

**"Cannot find module 'pg'"**
- Database drivers are automatically installed based on DATABASE_URL
- For manual installation: `npm install pg @types/pg`

**"Port already in use"**
- Change PORT environment variable
- Kill existing processes: `pkill -f node`

### Platform-Specific Issues

**Render:**
- Database takes 2-3 minutes to provision
- Health checks may fail during initial deployment

**Fly.io:**
- Requires credit card for deployment
- Some regions may have connectivity issues

**Vercel:**
- Serverless functions have 10-second timeout
- Static file serving requires proper routing

## 🔍 Monitoring

### Health Check Endpoint
```
GET /api/health
```

### Database Connection Test
```bash
curl http://localhost:5000/api/health
```

## 📝 Migration Notes

### From v1 to v2
- Updated Drizzle to latest version
- Added multi-database support
- Improved deployment configurations

### Breaking Changes
- Environment variable names unchanged
- Database schema is backward compatible
- API endpoints remain the same

## 🆘 Support

For deployment issues:
1. Check environment variables are set correctly
2. Verify database connectivity
3. Check platform-specific logs
4. Refer to platform documentation

---

**Need help?** The deployment script handles most configurations automatically. For custom setups, refer to your platform's documentation.