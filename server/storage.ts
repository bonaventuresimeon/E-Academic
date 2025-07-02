import {
  users,
  courses,
  enrollments,
  assignments,
  submissions,
  aiRecommendations,
  generatedSyllabi,
  type User,
  type InsertUser,
  type Course,
  type InsertCourse,
  type Enrollment,
  type InsertEnrollment,
  type Assignment,
  type InsertAssignment,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";
import { db } from "./database";
import { eq, and, desc, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./database";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(courses.title);
  }

  async getCoursesByDepartment(department: string): Promise<Course[]> {
    return await db.select().from(courses)
      .where(and(eq(courses.department, department), eq(courses.isActive, true)))
      .orderBy(courses.title);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  async getEnrollment(courseId: number, studentId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments)
      .where(and(eq(enrollments.courseId, courseId), eq(enrollments.studentId, studentId)));
    return enrollment || undefined;
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments)
      .where(eq(enrollments.studentId, studentId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments)
      .where(eq(enrollments.courseId, courseId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getPendingEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments)
      .where(eq(enrollments.status, 'pending'))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ status })
      .where(eq(enrollments.id, id))
      .returning();
    return updatedEnrollment || undefined;
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async getAssignmentsByCourse(courseId: number): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.courseId, courseId))
      .orderBy(assignments.dueDate);
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async getSubmission(assignmentId: number, studentId: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)));
    return submission || undefined;
  }

  async getSubmissionsByStudent(studentId: number): Promise<Submission[]> {
    return await db.select().from(submissions)
      .where(eq(submissions.studentId, studentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return await db.select().from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db
      .insert(submissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async updateSubmissionGrade(id: number, grade: number, feedback?: string): Promise<Submission | undefined> {
    const [updatedSubmission] = await db
      .update(submissions)
      .set({ 
        grade: grade.toString(), 
        feedback, 
        gradedAt: new Date() 
      })
      .where(eq(submissions.id, id))
      .returning();
    return updatedSubmission || undefined;
  }

  async saveRecommendations(userId: number, interests: string, recommendations: any): Promise<void> {
    await db.insert(aiRecommendations).values({
      userId,
      interests,
      recommendations,
    });
  }

  async saveSyllabus(userId: number, courseTitle: string, courseDescription: string, duration: number, credits: number, syllabus: any): Promise<void> {
    await db.insert(generatedSyllabi).values({
      userId,
      courseTitle,
      courseDescription,
      duration,
      credits,
      syllabus,
    });
  }

  async getUserStats(): Promise<{ totalUsers: number; activeStudents: number; activeLecturers: number }> {
    const [totalResult] = await db.select({ count: count() }).from(users);
    const [studentsResult] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
    const [lecturersResult] = await db.select({ count: count() }).from(users).where(eq(users.role, 'lecturer'));

    return {
      totalUsers: totalResult.count,
      activeStudents: studentsResult.count,
      activeLecturers: lecturersResult.count,
    };
  }

  async getCourseStats(): Promise<{ totalCourses: number; activeCourses: number }> {
    const [totalResult] = await db.select({ count: count() }).from(courses);
    const [activeResult] = await db.select({ count: count() }).from(courses).where(eq(courses.isActive, true));

    return {
      totalCourses: totalResult.count,
      activeCourses: activeResult.count,
    };
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

export const storage = new DatabaseStorage();