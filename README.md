# 🎓 Academic Management Platform

A comprehensive university Customer Relationship Management (CRM) system built with modern web technologies. Features role-based access control, course management, assignment workflows, AI-powered educational tools, and advanced video-game style HUD design with cross-platform deployment compatibility.

![Academic Platform](https://img.shields.io/badge/Platform-Academic%20CRM-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)

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

### 🎮 Advanced HUD Design
- **Futuristic Interface**: Video-game style HUD with matrix animations
- **Gradient Effects**: Advanced morphing gradients and energy pulse animations
- **Hologram Effects**: Scanning animations and holographic visual elements
- **Responsive Design**: Optimized for all devices with modern visual effects
- **Dark/Light Themes**: Complete theming system with smooth transitions

### 🗄️ Multi-Database Support
- **PostgreSQL** (recommended for production)
- **MySQL** (alternative for existing infrastructure)
- **SQLite** (local development)

## 🚀 Quick Start

### Automated Setup
```bash
git clone <repository-url>
cd academic-management-platform
./scripts/setup-deployment.sh
```

### One-Click Deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd academic-management-platform

# Install dependencies with legacy peer deps support
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:5000` to access the application.

## 🌐 Multi-Platform Deployment

### Supported Platforms

| Platform | Status | Configuration | Auto-Deploy | Health Checks |
|----------|--------|---------------|-------------|---------------|
| **Local Development** | ✅ Ready | Manual setup | - | ✅ |
| **Docker** | ✅ Ready | `Dockerfile` | ✅ | ✅ |
| **Vercel** | ✅ Ready | `vercel.json` | ✅ | ✅ |
| **Render** | ✅ Ready | `render.yaml` | ✅ | ✅ |
| **Fly.io** | ✅ Ready | `fly.toml` | ✅ | ✅ |
| **Kubernetes** | ✅ Ready | `k8s/` manifests | ✅ | ✅ |
| **GitHub Actions** | ✅ Ready | CI/CD pipeline | ✅ | ✅ |

### Quick Deployment Commands

#### Docker Deployment
```bash
# Build and run locally
docker build -t academic-platform .
docker run -p 5000:5000 --env-file .env academic-platform

# Multi-architecture build
docker buildx build --platform linux/amd64,linux/arm64 -t academic-platform .
```

#### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

#### Render Deployment
Connect your GitHub repository to Render dashboard for automatic deployment on git push.

#### Fly.io Deployment
```bash
npm install -g @fly.io/flyctl
fly auth login
fly launch
fly deploy
```

#### Kubernetes Deployment
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=academic-platform
```

### CI/CD Pipeline Features

Our GitHub Actions workflow provides:
- ✅ **Cross-platform testing** (Ubuntu, Windows)
- ✅ **Multi-Node.js version testing** (18, 20)
- ✅ **Security scanning** and dependency audits
- ✅ **Docker multi-architecture builds** (AMD64, ARM64)
- ✅ **Automated deployment** to multiple platforms
- ✅ **Health checks** and monitoring
- ✅ **Documentation generation** and GitHub Pages

## 📋 Configuration

### Environment Variables

Complete environment configuration:

```env
# ===========================================
# Application Configuration
# ===========================================
NODE_ENV=development
PORT=5000

# ===========================================
# Database Configuration (Choose one)
# ===========================================
# PostgreSQL (Recommended for production)
DATABASE_URL=postgresql://username:password@localhost:5432/academic_platform

# MySQL (Alternative option)
# DATABASE_URL=mysql://username:password@localhost:3306/academic_platform

# SQLite (Local development only)
# DATABASE_URL=file:./academic_platform.db

# ===========================================
# Session Configuration
# ===========================================
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# ===========================================
# AI Integration (Optional)
# ===========================================
OPENAI_API_KEY=sk-your-openai-api-key-here

# ===========================================
# File Upload Configuration
# ===========================================
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# ===========================================
# Security Configuration
# ===========================================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
TRUST_PROXY=false

# ===========================================
# Logging and Monitoring
# ===========================================
LOG_LEVEL=info
HEALTH_CHECK_ENABLED=true
```

### Health Check Endpoints

- `GET /api/health` - Comprehensive application health status
- `GET /health` - Simple health check for load balancers
- `GET /ready` - Readiness probe for Kubernetes deployments

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server with cross-env
npm run build        # Build for production (frontend + backend)
npm start           # Start production server
npm run check       # Run TypeScript type checking
npm run db:push     # Push database schema changes
npm run db:migrate  # Generate and apply database migrations
npm run clean       # Clean build artifacts and cache
```

### Project Architecture

```
academic-management-platform/
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend application
│   ├── routes.ts          # API route definitions
│   ├── auth.ts            # Authentication logic
│   ├── storage.ts         # Database operations
│   └── services/          # Business logic services
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── scripts/               # Deployment and setup scripts
├── .github/workflows/     # CI/CD pipelines
├── k8s/                   # Kubernetes manifests
├── devops/               # DevOps configurations
├── uploads/              # File upload storage
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── vercel.json           # Vercel deployment config
├── render.yaml           # Render deployment config
└── fly.toml              # Fly.io deployment config
```

### Database Schema

The application uses a flexible database schema supporting multiple database types:

- **Users**: Student, lecturer, and admin accounts with role-based permissions
- **Courses**: Course information, metadata, and department organization
- **Enrollments**: Student-course relationships with approval workflow
- **Assignments**: Course assignments with file upload and grading support
- **Submissions**: Student assignment submissions with feedback system
- **AI Data**: Recommendation and syllabus generation history

## 🔧 Advanced Features

### Cross-Platform Compatibility

| Feature | Ubuntu | Windows | macOS | Docker | Cloud |
|---------|--------|---------|-------|--------|-------|
| Development | ✅ | ✅ | ✅ | ✅ | ✅ |
| Production Build | ✅ | ✅ | ✅ | ✅ | ✅ |
| Database Support | ✅ | ✅ | ✅ | ✅ | ✅ |
| File Uploads | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Features | ✅ | ✅ | ✅ | ✅ | ✅ |
| Health Checks | ✅ | ✅ | ✅ | ✅ | ✅ |

### Performance Optimizations

- **Database connection pooling** for improved performance
- **Health check caching** to reduce overhead
- **Static file serving optimization** for production
- **Cross-platform compatibility layers** for seamless deployment
- **Multi-architecture Docker builds** for ARM64 and AMD64

### Security Features

- **Session-based authentication** with Passport.js
- **Role-based access control** (RBAC) middleware
- **Secure password hashing** with bcrypt
- **CORS configuration** for cross-origin requests
- **Environment variable validation** for secure deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests: `npm run check`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add comprehensive tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility
- Test on multiple database types when applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the comprehensive deployment documentation
- Review the automated setup scripts
- Use the cross-platform deployment guide

## 🔮 Roadmap

### Completed ✅
- [x] Cross-platform deployment support
- [x] Advanced HUD design with video-game style animations
- [x] Comprehensive CI/CD pipeline with GitHub Actions
- [x] Multi-database support (PostgreSQL, MySQL, SQLite)
- [x] Docker and Kubernetes deployment configurations
- [x] Health check endpoints and monitoring system
- [x] Automated deployment scripts
- [x] Security scanning and dependency audits

### In Progress 🚧
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard with real-time metrics
- [ ] Integration with external LMS systems
- [ ] Real-time collaboration features
- [ ] Enhanced AI capabilities with machine learning
- [ ] Progressive Web App (PWA) features
- [ ] Multi-tenant architecture support
- [ ] Advanced caching and performance optimizations

### Planned 📋
- [ ] Microservices architecture migration
- [ ] GraphQL API implementation
- [ ] Advanced security features (2FA, SSO)
- [ ] Internationalization (i18n) support
- [ ] Advanced reporting and analytics
- [ ] Integration with popular education platforms

## 📊 Deployment Status

Monitor the current deployment status of the platform across different environments:

- **Development**: Always ready for local development
- **Staging**: Automated deployment from `develop` branch
- **Production**: Automated deployment from `main` branch
- **Docker Registry**: Multi-architecture images available
- **Health Monitoring**: Real-time health checks across all platforms

For detailed deployment guides, see the `docs/deployment/` directory or run `./scripts/setup-deployment.sh` for automated setup.