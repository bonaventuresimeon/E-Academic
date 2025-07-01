# Academic Management Platform

A comprehensive university CRM system with role-based authentication, course management, assignment workflows, and AI integrations.

## Features

### 🎓 Core Functionality
- **Role-based Access Control**: Student, Lecturer, and Admin dashboards
- **Course Management**: Create, browse, and enroll in courses
- **Assignment Workflow**: Submit assignments and receive grades
- **Grade Calculation**: Automated weighted average calculations
- **File Upload**: Support for assignment and syllabus documents

### 🤖 AI-Powered Features
- **Course Recommendations**: Personalized suggestions based on interests
- **Syllabus Generation**: AI-generated comprehensive course syllabi
- **Smart Analytics**: Insights and recommendations for academic planning

### 🔐 Security & Authentication
- JWT-based authentication with secure session management
- Role-based permissions and access control
- Password hashing and validation
- File upload security and validation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** for components
- **React Query** for state management
- **Wouter** for routing
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **Multer** for file uploads
- **OpenAI API** for AI features

### Development Tools
- **Vite** for development and building
- **ESBuild** for production builds
- **Drizzle Kit** for database migrations

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, has fallbacks)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd academic-management-platform
