import express, { type Request, Response } from "express";
import { z } from "zod";
import { insertUserSchema, insertCourseSchema, insertEnrollmentSchema, insertAssignmentSchema, insertSubmissionSchema, type User } from "@shared/schema";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { upload, handleFileUpload } from "./services/fileUpload";
import { generateCourseRecommendations, generateSyllabus } from "./services/ai";

// Enhanced type guard for authenticated requests
interface AuthenticatedRequest extends Request {
  user: User;
}

function isAuthenticated(req: Request): req is AuthenticatedRequest {
  return req.user !== undefined;
}

function requireAuth(req: Request, res: Response, next: any): void {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: any): void => {
    if (!isAuthenticated(req) || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }
    next();
  };
}

const recommendationSchema = z.object({
  interests: z.string().min(1, "Interests are required"),
});

const syllabusSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  courseDescription: z.string().min(1, "Course description is required"),
  duration: z.number().min(1, "Duration must be at least 1 week"),
  credits: z.number().min(1, "Credits must be at least 1"),
});

export function registerRoutes(app: express.Express) {
  setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response): void => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Authentication routes
  app.post("/api/register", async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
    // Passport handles the actual authentication
    res.json({ message: "Login handled by passport middleware" });
  });

  app.post("/api/logout", (req: Request, res: Response): void => {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req: Request, res: Response): void => {
    if (isAuthenticated(req)) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req: Request, res: Response): Promise<void> => {
    try {
      const department = req.query.department as string;
      const courses = department
        ? await storage.getCoursesByDepartment(department)
        : await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", requireAuth, requireRole(['lecturer', 'admin']), async (req: Request, res: Response): Promise<void> => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  app.put("/api/courses/:id", requireAuth, requireRole(['lecturer', 'admin']), async (req: Request, res: Response): Promise<void> => {
    try {
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(parseInt(req.params.id), courseData);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: "Invalid course data" });
    }
  });

  // Enrollment routes
  app.post("/api/courses/enroll", requireAuth, requireRole(['student']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        studentId: req.user.id,
        status: 'pending'
      });
      
      // Check if already enrolled
      const existing = await storage.getEnrollment(enrollmentData.courseId, req.user.id);
      if (existing) {
        res.status(400).json({ message: "Already enrolled in this course" });
        return;
      }
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Invalid enrollment data" });
    }
  });

  app.put("/api/enrollments/:id", requireAuth, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const { status } = req.body;
      const enrollment = await storage.updateEnrollmentStatus(parseInt(req.params.id), status);
      if (!enrollment) {
        res.status(404).json({ message: "Enrollment not found" });
        return;
      }
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to update enrollment" });
    }
  });

  app.get("/api/enrollments", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const enrollments = req.user.role === 'admin'
        ? await storage.getPendingEnrollments()
        : await storage.getEnrollmentsByStudent(req.user.id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Assignment routes
  app.post("/api/courses/:id/assignments", requireAuth, requireRole(['lecturer', 'admin']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const assignmentData = insertAssignmentSchema.parse({
        ...req.body,
        courseId: parseInt(req.params.id),
        instructorId: req.user.id
      });
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assignment data" });
    }
  });

  app.get("/api/courses/:id/assignments", async (req: Request, res: Response): Promise<void> => {
    try {
      const assignments = await storage.getAssignmentsByCourse(parseInt(req.params.id));
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  // Submission routes
  app.post("/api/assignments/:id/submit", requireAuth, requireRole(['student']), upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const submissionData = insertSubmissionSchema.parse({
        assignmentId: parseInt(req.params.id),
        studentId: req.user.id,
        content: req.body.content,
        filePath: req.file?.path
      });
      const submission = await storage.createSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ message: "Invalid submission data" });
    }
  });

  app.get("/api/students/:studentId/submissions", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const studentId = parseInt(req.params.studentId);
      
      // Students can only view their own submissions
      if (req.user.role === 'student' && req.user.id !== studentId) {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      const submissions = await storage.getSubmissionsByStudent(studentId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.put("/api/submissions/:id/grade", requireAuth, requireRole(['lecturer', 'admin']), async (req: Request, res: Response): Promise<void> => {
    try {
      const { grade, feedback } = req.body;
      const submission = await storage.updateSubmissionGrade(parseInt(req.params.id), grade, feedback);
      if (!submission) {
        res.status(404).json({ message: "Submission not found" });
        return;
      }
      res.json(submission);
    } catch (error) {
      res.status(400).json({ message: "Failed to update grade" });
    }
  });

  // AI features
  app.post("/api/ai/recommendations", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const { interests } = recommendationSchema.parse(req.body);
      const recommendations = await generateCourseRecommendations(interests);
      await storage.saveRecommendations(req.user.id, interests, recommendations);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/ai/syllabus", requireAuth, requireRole(['lecturer', 'admin']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const data = syllabusSchema.parse(req.body);
      const syllabus = await generateSyllabus(data.courseTitle, data.courseDescription, data.duration, data.credits);
      await storage.saveSyllabus(req.user.id, data.courseTitle, data.courseDescription, data.duration, data.credits, syllabus);
      res.json(syllabus);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate syllabus" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAuth, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const userStats = await storage.getUserStats();
      const courseStats = await storage.getCourseStats();
      res.json({ ...userStats, ...courseStats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return app.listen(parseInt(process.env.PORT || "5000"), "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}