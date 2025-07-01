# 🎓 Academic Management Platform

A comprehensive, enterprise-grade university CRM system built with modern web technologies, featuring role-based authentication, course management, assignment workflows, AI-powered recommendations, and production-ready infrastructure.

[![Build Status](https://github.com/bonaventuresimeon/AcademicCRM/workflows/CI/badge.svg)](https://github.com/bonaventuresimeon/AcademicCRM/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![Kubernetes Ready](https://img.shields.io/badge/Kubernetes-Ready-326CE5)](https://kubernetes.io/)

## 🌟 Key Features

### 🔐 Enterprise Security & Authentication
- Multi-role authentication (Student, Lecturer, Admin)
- Session-based security with PostgreSQL storage
- Role-based access control (RBAC)
- Kubernetes security policies and network restrictions

### 📚 Advanced Course Management
- Dynamic course creation and enrollment workflows
- Department-based course organization
- Real-time enrollment tracking and approval systems
- Comprehensive academic year and semester management

### 📝 Assignment & Submission System
- Multi-format file upload support (PDF, DOC, images)
- Automated grading workflows with weighted calculations
- Due date tracking with smart notifications
- Bulk assignment management for lecturers

### 🤖 AI-Powered Features
- Personalized course recommendations using OpenAI GPT-4o
- Automated syllabus generation with fallback systems
- Intelligent content analysis and suggestions
- Performance analytics and insights

### ⚡ Performance & Scalability
- Horizontal pod autoscaling (3-20 replicas)
- Advanced caching and optimization
- Real-time WebSocket connections
- Performance monitoring with Prometheus/Grafana

### 🏗️ Production Infrastructure
- **Kubernetes-native** with Helm charts
- **Multi-cloud support** (AWS, GCP, Azure)
- **Infrastructure as Code** with Terraform
- **CI/CD pipelines** with GitHub Actions
- **Monitoring stack** with observability tools

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **AI**: OpenAI GPT-4o integration
- **File Handling**: Multer for uploads

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- OpenAI API key (optional, has fallbacks)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/bonaventuresimeon/AcademicCRM.git
cd AcademicCRM
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for session encryption
- `OPENAI_API_KEY`: OpenAI API key (optional)

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to access the application.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This application is configured for deployment on multiple platforms:

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Render

1. Create a new Web Service from GitHub
2. Use the included `render.yaml` configuration
3. Set environment variables in Render dashboard

### Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `fly deploy`

### AWS (using Docker)

1. Build Docker image: `docker build -t academic-crm .`
2. Push to ECR or Docker Hub
3. Deploy to ECS, EC2, or Elastic Beanstalk

### Heroku

1. Create Heroku app: `heroku create your-app-name`
2. Set stack to container: `heroku stack:set container -a your-app-name`
3. Deploy: `git push heroku main`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key (min 32 chars) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Role-based (student/lecturer/admin)
- **Courses**: Course information and management
- **Enrollments**: Student-course relationships
- **Assignments**: Course assignments with file support
- **Submissions**: Student assignment submissions
- **AI Features**: Recommendations and syllabus data

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (lecturer/admin)
- `GET /api/courses/:id` - Get course details

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/pending` - Get pending enrollments (admin)
- `PATCH /api/enrollments/:id` - Update enrollment status (admin)

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (lecturer)
- `POST /api/submissions` - Submit assignment (student)

### AI Features
- `POST /api/ai/recommendations` - Get course recommendations
- `POST /api/ai/syllabus` - Generate course syllabus

## User Roles

### Student
- Browse and enroll in courses
- View assignments and submit work
- Track grades and progress
- Get AI course recommendations

### Lecturer
- Create and manage courses
- Create assignments and grade submissions
- View enrolled students
- Generate AI-powered syllabi

### Admin
- Manage all users and courses
- Approve/reject enrollments
- View system-wide statistics
- Access administrative dashboard

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and config
├── server/                # Express backend
│   ├── services/          # Business logic
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and schemas
└── uploads/              # File uploads (development)
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type checking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.