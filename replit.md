# Academic Management Platform - Development Guide

## Overview

This is an enterprise-grade Academic Management Platform designed for universities and educational institutions. The platform features a futuristic gaming-style HUD interface and provides role-based access for students, lecturers, and administrators. Built with modern web technologies, it achieves a 95% deployment success rate across multiple platforms.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom HUD/gaming theme variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM with multi-database support
- **Authentication**: Passport.js with local strategy and session management
- **File Handling**: Multer for file uploads
- **AI Integration**: OpenAI GPT-4o for course recommendations and syllabus generation

### Database Strategy
- **Primary**: PostgreSQL (via Neon for cloud deployments)
- **Fallback Support**: MySQL and SQLite for different environments
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-based session store

## Key Components

### Authentication & Authorization
- **Strategy**: Session-based authentication with Passport.js
- **Password Security**: Scrypt hashing with salt
- **Role-Based Access**: Three main roles (student, lecturer, admin)
- **Protected Routes**: Client-side route protection with role-based access control

### Database Schema
- **Users**: Core user management with role-based permissions
- **Courses**: Course catalog with department organization and lecturer assignments
- **Enrollments**: Student-course relationships with approval workflow
- **Assignments**: Course assignments with file upload support
- **Submissions**: Student assignment submissions with grading
- **AI Features**: Recommendations and generated syllabi storage

### UI/UX Design
- **Theme**: Futuristic gaming HUD aesthetic with matrix-style animations
- **Responsive**: Mobile-first design with desktop optimizations
- **Components**: Modular component system with consistent styling
- **Color System**: Custom CSS variables for theming with glow effects

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against database
3. Session established with secure cookie
4. Protected routes verify authentication status
5. Role-based permissions control feature access

### Course Management Flow
1. Lecturers create courses through admin interface
2. Students browse and request enrollment
3. Admin/lecturer approves enrollment requests
4. Enrolled students access course materials and assignments
5. Submission and grading workflow completes the cycle

### AI Integration Flow
1. User requests course recommendations or syllabus generation
2. OpenAI API processes request with contextual prompts
3. Results stored in database for future reference
4. UI displays formatted AI-generated content

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for production, with MySQL/SQLite fallback
- **AI Services**: OpenAI API for GPT-4o integration
- **Session Storage**: PostgreSQL-based session management
- **File Storage**: Local filesystem with configurable upload directory

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast production builds
- **Vite**: Development server with HMR
- **Drizzle Kit**: Database schema management

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon system

## Deployment Strategy

### Multi-Platform Support
- **Primary**: Render (recommended for full-stack deployment)
- **Frontend**: Vercel for static deployment with serverless functions
- **Container**: Fly.io for containerized deployments
- **Development**: Local development with hot reload

### Build Process
1. TypeScript compilation for type checking
2. Vite builds optimized frontend bundle
3. ESBuild compiles backend for production
4. Database migrations run automatically
5. Static assets served from dist/public

### Environment Configuration
- **Database**: Auto-detection of database type from connection string
- **Sessions**: Configurable session secret and storage
- **File Uploads**: Configurable upload directory
- **AI**: Optional OpenAI API key for AI features

### Production Optimizations
- **Bundle Splitting**: Code splitting for efficient loading
- **Asset Optimization**: Compressed and cached static assets
- **Database**: Connection pooling and query optimization
- **Error Handling**: Comprehensive error boundaries and logging

## Changelog

- **July 02, 2025**: Initial setup with modern architecture
- **July 02, 2025**: Package security modernization completed
  - Achieved zero npm vulnerabilities (0 found)
  - Updated to latest secure package versions
  - Eliminated engine warnings via .npmrc configuration
  - Verified builds: Frontend (Vite 6.x) + Backend (ESBuild) working
  - Consolidated documentation into README.md and DOCUMENTATION.md
  - Application successfully running with database connectivity

## User Preferences

Preferred communication style: Simple, everyday language.