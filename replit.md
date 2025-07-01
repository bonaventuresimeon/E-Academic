# Academic Management Platform - Replit Guide

## Overview

The Academic Management Platform is a comprehensive university CRM system built with a full-stack TypeScript architecture. It provides role-based access control for students, lecturers, and administrators, with features including course management, assignment workflows, AI-powered course recommendations, and syllabus generation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy and session-based auth
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for file uploads
- **AI Integration**: OpenAI API for course recommendations and syllabus generation
- **Build**: ESBuild for production compilation

### Database Design
The system uses PostgreSQL with the following core entities:
- **Users**: Role-based (student/lecturer/admin) with authentication
- **Courses**: Course management with lecturer assignments
- **Enrollments**: Student-course relationships with approval workflow
- **Assignments**: Course assignments with file upload support
- **Submissions**: Student assignment submissions with grading
- **AI Features**: Recommendation and syllabus generation tracking

## Key Components

### Authentication System
- JWT-based session management with secure password hashing
- Role-based access control (RBAC) middleware
- Protected routes based on user roles
- Session storage using PostgreSQL

### Course Management Workflow
- **Lecturers**: Create and manage courses, upload syllabi
- **Students**: Browse, enroll, and drop courses
- **Admins**: Approve/reject enrollments, assign lecturers

### Assignment System
- File upload support for assignments and submissions
- Weighted grading system with automatic grade calculations
- Due date tracking and status management
- Support for both file and text submissions

### AI Integration
- **Course Recommendations**: Personalized suggestions based on student interests
- **Syllabus Generation**: AI-generated comprehensive course syllabi
- OpenAI GPT-4o integration with fallback handling

## Data Flow

1. **Authentication Flow**: Login → Session creation → Role-based routing
2. **Course Enrollment**: Browse courses → Request enrollment → Admin approval → Active enrollment
3. **Assignment Workflow**: Create assignment → Student submission → Lecturer grading → Grade calculation
4. **AI Features**: User input → OpenAI API → Processed recommendations/syllabus → Database storage

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm**: Type-safe database operations
- **passport**: Authentication middleware
- **multer**: File upload handling
- **openai**: AI feature integration

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development Setup
- Vite dev server for frontend with HMR
- TSX for TypeScript execution in development
- Environment variables for database and API keys
- File uploads stored locally in development

### Production Build
- Vite build for optimized frontend bundle
- ESBuild for server-side compilation
- Static file serving for production
- Database migrations via Drizzle Kit

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `OPENAI_API_KEY`: OpenAI API access

## Changelog

Changelog:
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.