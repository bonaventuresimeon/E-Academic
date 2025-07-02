import { z } from "zod";
import type { 
  User, 
  Course, 
  Enrollment, 
  Assignment, 
  Submission, 
  PasswordReset,
  AiRecommendation,
  GeneratedSyllabus 
} from "@prisma/client";

// Export Prisma types for compatibility
export type { User, Course, Enrollment, Assignment, Submission, PasswordReset, AiRecommendation, GeneratedSyllabus };

// Legacy type aliases for backward compatibility
export type SelectUser = User;
export type InsertUser = Omit<User, 'id' | 'createdAt'>;
export type InsertCourse = Omit<Course, 'id' | 'createdAt'>;
export type InsertEnrollment = Omit<Enrollment, 'id' | 'enrolledAt'>;
export type InsertAssignment = Omit<Assignment, 'id' | 'createdAt'>;
export type InsertSubmission = Omit<Submission, 'id' | 'submittedAt' | 'gradedAt'>;
export type InsertPasswordReset = Omit<PasswordReset, 'id' | 'createdAt'>;

// Validation schemas for API endpoints
export const insertUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email(),
  phoneNumber: z.string().optional().nullable(),
  password: z.string().min(6),
  role: z.enum(['student', 'lecturer', 'admin']),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const insertCourseSchema = z.object({
  title: z.string().min(1).max(255),
  code: z.string().min(1).max(10),
  description: z.string().optional().nullable(),
  credits: z.number().min(1).max(10),
  department: z.string().min(1).max(100),
  lecturerId: z.number().optional().nullable(),
  syllabusUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const insertEnrollmentSchema = z.object({
  courseId: z.number(),
  studentId: z.number(),
  status: z.string().default('pending'),
});

export const insertAssignmentSchema = z.object({
  courseId: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  maxPoints: z.number().optional().nullable(),
});

export const insertSubmissionSchema = z.object({
  assignmentId: z.number(),
  studentId: z.number(),
  content: z.string().optional().nullable(),
  filePath: z.string().optional().nullable(),
  grade: z.number().optional().nullable(),
  feedback: z.string().optional().nullable(),
});

export const insertPasswordResetSchema = z.object({
  userId: z.number(),
  token: z.string(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
});

// AI schemas
export const recommendationSchema = z.object({
  interests: z.string().min(1),
  level: z.string().default("any"),
  existingCourses: z.array(z.string()).default([]),
});

export const syllabusSchema = z.object({
  courseTitle: z.string().min(1),
  courseDescription: z.string().min(1),
  duration: z.number().min(1).max(52),
  credits: z.number().min(1).max(10),
});