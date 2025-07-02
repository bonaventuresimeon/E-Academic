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
export type { 
  User, 
  Course, 
  Enrollment, 
  Assignment, 
  Submission, 
  PasswordReset, 
  AiRecommendation, 
  GeneratedSyllabus
};

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

// Quiz and Test schemas
export const insertQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  description: z.string().optional(),
  courseId: z.number().int().positive(),
  timeLimit: z.number().int().positive().optional(),
  maxAttempts: z.number().int().positive().default(1),
  isPublished: z.boolean().default(false),
  dueDate: z.date().optional(),
});

export const insertQuestionSchema = z.object({
  quizId: z.number().int().positive(),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'FILL_IN_BLANK']),
  question: z.string().min(1, "Question is required"),
  options: z.any().optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().int().positive().default(1),
  explanation: z.string().optional(),
  order: z.number().int().positive(),
});

export const insertTestSchema = z.object({
  title: z.string().min(1, "Test title is required"),
  description: z.string().optional(),
  courseId: z.number().int().positive(),
  testType: z.enum(['EXAM', 'QUIZ', 'ASSESSMENT', 'PRACTICE']),
  duration: z.number().int().positive(),
  maxMarks: z.number().int().positive(),
  passingMarks: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  isPublished: z.boolean().default(false),
});

export const insertTestSectionSchema = z.object({
  testId: z.number().int().positive(),
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional(),
  order: z.number().int().positive(),
  timeLimit: z.number().int().positive().optional(),
});

export const insertQuizAttemptSchema = z.object({
  quizId: z.number().int().positive(),
  studentId: z.number().int().positive(),
  maxScore: z.number().positive(),
});

export const insertTestResultSchema = z.object({
  testId: z.number().int().positive(),
  studentId: z.number().int().positive(),
  score: z.number().positive(),
  maxScore: z.number().positive(),
  percentage: z.number().min(0).max(100),
  grade: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED']),
});