# Academic Management Platform

## Overview

The Academic Management Platform is an enterprise-grade educational CRM system built with modern web technologies. This full-stack application provides comprehensive student information management, course administration, assignment tracking, and AI-powered academic assistance. The platform supports multiple user roles (students, lecturers, and administrators) with role-based access control and features a responsive, modern UI.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Form Management**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Context-based auth with protected routes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Authentication**: Passport.js with local strategy and session management
- **File Uploads**: Multer for handling multipart/form-data
- **API Design**: RESTful API with consistent error handling
- **Session Storage**: PostgreSQL-based session store

### Database Architecture
- **ORM**: Drizzle ORM with schema-first approach
- **Primary Database**: PostgreSQL (recommended for production)
- **Alternative Support**: MySQL and SQLite for development
- **Connection**: Neon serverless PostgreSQL with WebSocket support
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Core Modules
1. **User Management**: Multi-role authentication (student, lecturer, admin)
2. **Course Management**: Course creation, enrollment, and administration
3. **Assignment System**: Assignment creation, submission, and grading
4. **AI Assistant**: OpenAI-powered course recommendations and syllabus generation
5. **File Management**: Secure file upload and storage system
6. **Notification System**: Real-time notifications and alerts

### Database Schema
- **Users**: Authentication and profile management
- **Courses**: Course information and metadata
- **Enrollments**: Student-course relationships with status tracking
- **Assignments**: Assignment details with due dates and requirements
- **Submissions**: Student assignment submissions with grading
- **AI Recommendations**: Stored AI-generated course suggestions
- **Generated Syllabi**: AI-created course syllabi

### UI Components
- **Reusable Components**: Card-based layouts, stats displays, form controls
- **Role-Based Dashboards**: Customized interfaces for each user role
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against database
3. Session created and stored in PostgreSQL
4. Protected routes enforce authentication checks
5. Role-based access control filters functionality

### Course Management Flow
1. Lecturers create courses with metadata
2. Students browse and request enrollment
3. Admins approve/reject enrollment requests
4. Enrolled students gain access to course materials and assignments

### Assignment Workflow
1. Lecturers create assignments with requirements
2. Students submit assignments with optional file uploads
3. Lecturers grade submissions and provide feedback
4. Grades are calculated and displayed in dashboards

### AI Integration Flow
1. Users provide academic interests or course requirements
2. System calls OpenAI API with structured prompts
3. AI responses are parsed and validated
4. Results are stored in database and displayed to users

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **passport**: Authentication middleware
- **drizzle-orm**: Type-safe database ORM
- **multer**: File upload handling
- **openai**: AI service integration
- **zod**: Runtime type validation

### Development Dependencies
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler

### External Services
- **OpenAI API**: AI-powered features (course recommendations, syllabus generation)
- **Neon Database**: Serverless PostgreSQL hosting
- **File Storage**: Local file system with upload directory management

## Deployment Strategy

### Multi-Platform Support
The application supports deployment across multiple platforms:

1. **Render** (recommended): Auto-deployment with render.yaml configuration
2. **Vercel**: Serverless deployment with custom build configuration
3. **Fly.io**: Global edge deployment with flyctl integration
4. **Docker**: Containerized deployment for any platform
5. **Kubernetes**: Production-ready orchestration with comprehensive manifests

### Environment Configuration
- **Database**: Automatic database type detection from DATABASE_URL
- **Sessions**: Secure session management requires SESSION_SECRET
- **AI Features**: Optional OPENAI_API_KEY for enhanced functionality
- **File Uploads**: Configurable upload directory for different environments

### Build Process
- **Development**: `npm run dev` - Hot module replacement with Vite
- **Production**: `npm run build` - Optimized build with tree shaking
- **Database**: `npm run db:push` - Schema synchronization

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```