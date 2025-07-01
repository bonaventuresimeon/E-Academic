import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertCourseSchema, 
  insertEnrollmentSchema, 
  insertAssignmentSchema, 
  insertSubmissionSchema 
} from "@shared/schema";
import { generateCourseRecommendations, generateSyllabus } from "./services/ai";
import { handleFileUpload, getFileUrl } from "./services/fileUpload";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Middleware to check role
  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { department } = req.query;
      const courses = department 
        ? await storage.getCoursesByDepartment(department as string)
        : await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", requireAuth, requireRole(['lecturer', 'admin']), async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  app.put("/api/courses/:id", requireAuth, requireRole(['lecturer', 'admin']), async (req, res) => {
    try {
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(parseInt(req.params.id), courseData);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Enrollment routes
  app.post("/api/courses/enroll", requireAuth, requireRole(['student']), async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        studentId: req.user.id,
        status: 'pending'
      });
      
      // Check if already enrolled
      const existing = await storage.getEnrollment(enrollmentData.courseId, req.user.id);
      if (existing) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/enrollments/student/:id", requireAuth, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      if (req.user.role !== 'admin' && req.user.id !== studentId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const enrollments = await storage.getEnrollmentsByStudent(studentId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/pending", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const enrollments = await storage.getPendingEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending enrollments" });
    }
  });

  app.put("/api/enrollments/:id/status", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { status } = req.body;
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const enrollment = await storage.updateEnrollmentStatus(parseInt(req.params.id), status);
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update enrollment status" });
    }
  });

  // Assignment routes
  app.get("/api/courses/:courseId/assignments", requireAuth, async (req, res) => {
    try {
      const assignments = await storage.getAssignmentsByCourse(parseInt(req.params.courseId));
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/courses/:courseId/assignments", requireAuth, requireRole(['lecturer', 'admin']), async (req, res) => {
    try {
      const assignmentData = insertAssignmentSchema.parse({
        ...req.body,
        courseId: parseInt(req.params.courseId)
      });
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assignment data" });
    }
  });

  // Submission routes
  app.post("/api/assignments/:assignmentId/submit", requireAuth, requireRole(['student']), handleFileUpload('file'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const fileUrl = files && files.length > 0 ? getFileUrl(files[0].filename) : undefined;
      
      const submissionData = insertSubmissionSchema.parse({
        assignmentId: parseInt(req.params.assignmentId),
        studentId: req.user.id,
        content: req.body.content,
        fileUrl
      });
      
      // Check if already submitted
      const existing = await storage.getSubmission(submissionData.assignmentId, req.user.id);
      if (existing) {
        return res.status(400).json({ message: "Assignment already submitted" });
      }
      
      const submission = await storage.createSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit assignment" });
    }
  });

  app.get("/api/submissions/student/:studentId", requireAuth, async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      if (req.user.role !== 'admin' && req.user.id !== studentId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const submissions = await storage.getSubmissionsByStudent(studentId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.put("/api/submissions/:id/grade", requireAuth, requireRole(['lecturer', 'admin']), async (req, res) => {
    try {
      const { grade, feedback } = req.body;
      const submission = await storage.updateSubmissionGrade(parseInt(req.params.id), grade, feedback);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to grade submission" });
    }
  });

  // AI routes
  app.post("/api/ai/recommend", requireAuth, async (req, res) => {
    try {
      const { interests, level } = req.body;
      if (!interests) {
        return res.status(400).json({ message: "Interests are required" });
      }
      
      // Get user's existing courses
      const enrollments = await storage.getEnrollmentsByStudent(req.user.id);
      const existingCourses = enrollments.map(e => `Course ${e.courseId}`); // Simplified
      
      const recommendations = await generateCourseRecommendations(interests, level, existingCourses);
      
      // Save recommendations
      await storage.saveRecommendations(req.user.id, interests, recommendations);
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/ai/syllabus", requireAuth, requireRole(['lecturer', 'admin']), async (req, res) => {
    try {
      const { courseTitle, courseDescription, duration, credits } = req.body;
      if (!courseTitle || !courseDescription || !duration || !credits) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const syllabus = await generateSyllabus(courseTitle, courseDescription, duration, credits);
      
      // Save syllabus
      await storage.saveSyllabus(req.user.id, courseTitle, courseDescription, duration, credits, syllabus);
      
      res.json(syllabus);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate syllabus" });
    }
  });

  // Stats routes
  app.get("/api/stats/dashboard", requireAuth, async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      const courseStats = await storage.getCourseStats();
      
      let personalStats = {};
      if (req.user.role === 'student') {
        const enrollments = await storage.getEnrollmentsByStudent(req.user.id);
        const submissions = await storage.getSubmissionsByStudent(req.user.id);
        personalStats = {
          enrolledCourses: enrollments.filter(e => e.status === 'approved').length,
          pendingAssignments: submissions.filter(s => !s.grade).length,
          completedAssignments: submissions.filter(s => s.grade).length,
        };
      }
      
      res.json({
        ...userStats,
        ...courseStats,
        ...personalStats,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
