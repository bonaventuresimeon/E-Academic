import { prisma } from "./prisma-client";
import type { 
  User, 
  Course, 
  Enrollment, 
  Assignment, 
  Submission, 
  PasswordReset,
  InsertUser,
  InsertCourse,
  InsertEnrollment,
  InsertAssignment,
  InsertSubmission,
  InsertPasswordReset
} from "@shared/schema";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, newPassword: string): Promise<User | undefined>;

  // Password reset operations
  createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset>;
  getPasswordReset(token: string): Promise<PasswordReset | undefined>;
  markPasswordResetAsUsed(id: number): Promise<PasswordReset | undefined>;

  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByDepartment(department: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;

  // Enrollment operations
  getEnrollment(courseId: number, studentId: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  getPendingEnrollments(): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined>;

  // Assignment operations
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAssignmentsByCourse(courseId: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;

  // Submission operations
  getSubmission(assignmentId: number, studentId: number): Promise<Submission | undefined>;
  getSubmissionsByStudent(studentId: number): Promise<Submission[]>;
  getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionGrade(id: number, grade: number, feedback?: string): Promise<Submission | undefined>;

  // AI operations
  saveRecommendations(userId: number, interests: string, recommendations: any): Promise<void>;
  saveSyllabus(userId: number, courseTitle: string, courseDescription: string, duration: number, credits: number, syllabus: any): Promise<void>;

  // Stats
  getUserStats(): Promise<{ totalUsers: number; activeStudents: number; activeLecturers: number }>;
  getCourseStats(): Promise<{ totalCourses: number; activeCourses: number }>;

  // Admin operations
  getAllUsers(): Promise<User[]>;

  sessionStore: session.Store;
}

export class PrismaStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user || undefined;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return await prisma.user.create({ data: insertUser });
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const user = await prisma.user.update({
      where: { id },
      data: { password: newPassword }
    });
    return user || undefined;
  }

  // Password reset operations
  async createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset> {
    return await prisma.passwordReset.create({ data: reset });
  }

  async getPasswordReset(token: string): Promise<PasswordReset | undefined> {
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    return reset || undefined;
  }

  async markPasswordResetAsUsed(id: number): Promise<PasswordReset | undefined> {
    const reset = await prisma.passwordReset.update({
      where: { id },
      data: { used: true }
    });
    return reset || undefined;
  }

  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    const course = await prisma.course.findUnique({ where: { id } });
    return course || undefined;
  }

  async getAllCourses(): Promise<Course[]> {
    return await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' }
    });
  }

  async getCoursesByDepartment(department: string): Promise<Course[]> {
    return await prisma.course.findMany({
      where: { 
        department,
        isActive: true 
      },
      orderBy: { title: 'asc' }
    });
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    return await prisma.course.create({ data: course });
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: course
    });
    return updatedCourse || undefined;
  }

  // Enrollment operations
  async getEnrollment(courseId: number, studentId: number): Promise<Enrollment | undefined> {
    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId, studentId }
    });
    return enrollment || undefined;
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true }
    });
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return await prisma.enrollment.findMany({
      where: { courseId },
      include: { student: true }
    });
  }

  async getPendingEnrollments(): Promise<Enrollment[]> {
    return await prisma.enrollment.findMany({
      where: { status: 'pending' },
      include: { course: true, student: true }
    });
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    return await prisma.enrollment.create({ data: enrollment });
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined> {
    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { status }
    });
    return enrollment || undefined;
  }

  // Assignment operations
  async getAssignment(id: number): Promise<Assignment | undefined> {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    return assignment || undefined;
  }

  async getAssignmentsByCourse(courseId: number): Promise<Assignment[]> {
    return await prisma.assignment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    return await prisma.assignment.create({ data: assignment });
  }

  // Submission operations
  async getSubmission(assignmentId: number, studentId: number): Promise<Submission | undefined> {
    const submission = await prisma.submission.findFirst({
      where: { assignmentId, studentId }
    });
    return submission || undefined;
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return await prisma.submission.findMany({
      where: { studentId },
      include: { assignment: true }
    });
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return await prisma.submission.findMany({
      where: { assignmentId },
      include: { student: true }
    });
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    return await prisma.submission.create({ data: submission });
  }

  async updateSubmissionGrade(id: number, grade: number, feedback?: string): Promise<Submission | undefined> {
    const submission = await prisma.submission.update({
      where: { id },
      data: { 
        grade,
        feedback,
        gradedAt: new Date()
      }
    });
    return submission || undefined;
  }

  // AI operations
  async saveRecommendations(userId: number, interests: string, recommendations: any): Promise<void> {
    await prisma.aiRecommendation.create({
      data: {
        userId,
        interests,
        recommendations
      }
    });
  }

  async saveSyllabus(userId: number, courseTitle: string, courseDescription: string, duration: number, credits: number, syllabus: any): Promise<void> {
    await prisma.generatedSyllabus.create({
      data: {
        userId,
        courseTitle,
        courseDescription,
        duration,
        credits,
        syllabus
      }
    });
  }

  // Stats
  async getUserStats(): Promise<{ totalUsers: number; activeStudents: number; activeLecturers: number }> {
    const [totalUsers, activeStudents, activeLecturers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'lecturer' } })
    ]);

    return { totalUsers, activeStudents, activeLecturers };
  }

  async getCourseStats(): Promise<{ totalCourses: number; activeCourses: number }> {
    const [totalCourses, activeCourses] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { isActive: true } })
    ]);

    return { totalCourses, activeCourses };
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const storage = new PrismaStorage();