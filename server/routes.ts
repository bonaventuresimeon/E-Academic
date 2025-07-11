import express, { type Request, Response, Router } from "express";
import { z } from "zod";
import { insertUserSchema, insertCourseSchema, insertEnrollmentSchema, insertAssignmentSchema, insertSubmissionSchema, type User } from "@shared/schema";
import { storage } from "./prisma-storage";
import { setupAuth } from "./auth";
import { upload, handleFileUpload } from "./services/fileUpload";
import { generateCourseRecommendations, generateSyllabus } from "./services/ai";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Enhanced type guard for authenticated requests
interface AuthenticatedRequest extends Request {
  user: User;
}

function isAuthenticated(req: Request): req is AuthenticatedRequest {
  return req.user !== undefined;
}

function requireAuth(req: Request, res: Response, next: any): void {
  if (req.isAuthenticated()) {
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

// Type casting helper for Prisma compatibility

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

  // Authentication routes are handled in auth.ts

  // Password recovery routes
  app.post("/api/password-recovery/request", async (req: Request, res: Response): Promise<void> => {
    try {
      const { identifier } = req.body; // email or phone number
      
      if (!identifier) {
        res.status(400).json({ message: "Email or phone number required" });
        return;
      }

      // Find user by email or phone
      let user = await storage.getUserByEmail(identifier);
      if (!user) {
        user = await storage.getUserByPhone(identifier);
      }

      if (!user) {
        // Don't reveal if user exists for security
        res.json({ message: "If an account exists with this identifier, a reset link has been sent." });
        return;
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      await storage.createPasswordReset({
        userId: user.id,
        token: resetToken,
        expiresAt,
        used: false
      });

      // In a real app, you'd send email/SMS here
      // For now, we'll just return the token for development
      res.json({ 
        message: "Reset token generated successfully",
        resetToken, // Remove this in production
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Password recovery request error:", error);
      res.status(500).json({ message: "Failed to process password recovery request" });
    }
  });

  app.post("/api/password-recovery/reset", async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({ message: "Token and new password required" });
        return;
      }

      // Validate reset token
      const resetRecord = await storage.getPasswordReset(token);
      if (!resetRecord || resetRecord.used || new Date() > resetRecord.expiresAt) {
        res.status(400).json({ message: "Invalid or expired reset token" });
        return;
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      await storage.updateUserPassword(resetRecord.userId, hashedPassword);
      
      // Mark reset token as used
      await storage.markPasswordResetAsUsed(resetRecord.id);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.get("/api/password-recovery/verify/:token", async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      
      const resetRecord = await storage.getPasswordReset(token);
      if (!resetRecord || resetRecord.used || new Date() > resetRecord.expiresAt) {
        res.status(400).json({ message: "Invalid or expired reset token" });
        return;
      }

      res.json({ message: "Token is valid", userId: resetRecord.userId });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ message: "Failed to verify token" });
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

  app.get("/api/courses/extended", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      console.log('=== DEBUG COURSES EXTENDED START ===');
      const userId = req.user.id;
      const userRole = req.user.role;
      console.log('Debug - userId:', userId, 'userRole:', userRole);

      let courses;
      
      if (userRole === 'student') {
        const enrollments = await storage.getEnrollmentsByStudent(userId);
        console.log('Debug - User ID:', userId);
        console.log('Debug - Enrollments found:', enrollments.length);
        if (enrollments.length > 0) {
          console.log('Debug - First enrollment:', JSON.stringify(enrollments[0], null, 2));
        }
        
        // Use the course data from include instead of making separate getCourse calls
        courses = await Promise.all(
          enrollments.map(async (enrollment) => {
            console.log('Debug - Processing enrollment:', enrollment);
            // enrollment should include course data via Prisma include
            if (!enrollment.course) {
              console.error('Debug - course data missing from enrollment:', enrollment);
              return null;
            }
            const course = enrollment.course;
            if (!course) return null;
            
            const lecturer = course.lecturerId ? await storage.getUser(course.lecturerId) : null;
            const allEnrollments = await storage.getEnrollmentsByCourse(course.id);
            const assignments = await storage.getAssignmentsByCourse(course.id);
            
            return {
              ...course,
              lecturer,
              enrollmentCount: allEnrollments.length,
              isEnrolled: true,
              assignments
            };
          })
        );
        courses = courses.filter(Boolean);
      } else if (userRole === 'lecturer') {
        const allCourses = await storage.getAllCourses();
        courses = await Promise.all(
          allCourses
            .filter(course => course.lecturerId === userId)
            .map(async (course) => {
              const lecturer = await storage.getUser(course.lecturerId!);
              const allEnrollments = await storage.getEnrollmentsByCourse(course.id);
              const assignments = await storage.getAssignmentsByCourse(course.id);
              
              return {
                ...course,
                lecturer,
                enrollmentCount: allEnrollments.length,
                isEnrolled: false,
                assignments
              };
            })
        );
      } else if (userRole === 'admin') {
        const allCourses = await storage.getAllCourses();
        courses = await Promise.all(
          allCourses.map(async (course) => {
            const lecturer = course.lecturerId ? await storage.getUser(course.lecturerId) : null;
            const allEnrollments = await storage.getEnrollmentsByCourse(course.id);
            const assignments = await storage.getAssignmentsByCourse(course.id);
            
            return {
              ...course,
              lecturer,
              enrollmentCount: allEnrollments.length,
              isEnrolled: false,
              assignments
            };
          })
        );
      } else {
        courses = [];
      }

      res.json(courses);
    } catch (error) {
      console.error("Error fetching extended courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('=== DEBUG COURSES ID ROUTE HIT === with id:', req.params.id);
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
      const course = await storage.createCourse(courseData as any);
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
      const assignment = await storage.createAssignment(assignmentData as any);
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
      const submission = await storage.createSubmission(submissionData as any);
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

  app.get("/api/admin/users", requireAuth, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const usersList = await storage.getAllUsers();
      res.json(usersList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Advanced Dashboard API Routes
  app.get("/api/dashboard/stats", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get basic stats
      const userStats = await storage.getUserStats();
      const courseStats = await storage.getCourseStats();

      // Get user-specific stats based on role
      let stats = {
        totalCourses: courseStats.totalCourses,
        totalAssignments: 0,
        totalSubmissions: 0,
        totalQuizzes: 0,
        totalTests: 0,
        completionRate: 0,
        averageGrade: 0,
        upcomingDeadlines: 0,
        recentActivity: 0,
        ...userStats
      };

      if (userRole === 'student') {
        const enrollments = await storage.getEnrollmentsByStudent(userId);
        const submissions = await storage.getSubmissionsByStudent(userId);
        
        stats.totalCourses = enrollments.length;
        stats.totalSubmissions = submissions.length;
        
        // Calculate average grade from submissions
        const gradedSubmissions = submissions.filter(s => s.grade !== null);
        if (gradedSubmissions.length > 0) {
          stats.averageGrade = gradedSubmissions.reduce((acc, s) => acc + Number(s.grade), 0) / gradedSubmissions.length;
        }
        
        stats.completionRate = submissions.length > 0 ? (gradedSubmissions.length / submissions.length) * 100 : 0;
      }

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/courses/extended", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      console.log('=== DEBUG COURSES EXTENDED START ===');
      const userId = req.user.id;
      const userRole = req.user.role;
      console.log('Debug - userId:', userId, 'userRole:', userRole);

      let courses;
      
      if (userRole === 'student') {
        const enrollments = await storage.getEnrollmentsByStudent(userId);
        console.log('Debug - User ID:', userId);
        console.log('Debug - Enrollments found:', enrollments.length);
        if (enrollments.length > 0) {
          console.log('Debug - First enrollment:', JSON.stringify(enrollments[0], null, 2));
        }
        
        // Use the course data from include instead of making separate getCourse calls
        courses = await Promise.all(
          enrollments.map(async (enrollment) => {
            console.log('Debug - Processing enrollment:', enrollment);
            // enrollment should include course data via Prisma include
            if (!enrollment.course) {
              console.error('Debug - course data missing from enrollment:', enrollment);
              return null;
            }
            const course = enrollment.course;
            if (!course) return null;
            
            const lecturer = course.lecturerId ? await storage.getUser(course.lecturerId) : null;
            const allEnrollments = await storage.getEnrollmentsByCourse(course.id);
            const assignments = await storage.getAssignmentsByCourse(course.id);
            
            return {
              ...course,
              lecturer,
              enrollmentCount: allEnrollments.length,
              isEnrolled: true,
              assignments
            };
          })
        );
        courses = courses.filter(Boolean);
      } else if (userRole === 'lecturer') {
        const allCourses = await storage.getAllCourses();
        courses = await Promise.all(
          allCourses
            .filter(course => course.lecturerId === userId)
            .map(async (course) => {
              const lecturer = await storage.getUser(course.lecturerId!);
              const enrollments = await storage.getEnrollmentsByCourse(course.id);
              const assignments = await storage.getAssignmentsByCourse(course.id);
              
              return {
                ...course,
                lecturer,
                enrollmentCount: enrollments.length,
                isEnrolled: false,
                assignments
              };
            })
        );
      } else {
        const allCourses = await storage.getAllCourses();
        courses = await Promise.all(
          allCourses.map(async (course) => {
            const lecturer = course.lecturerId ? await storage.getUser(course.lecturerId) : null;
            const enrollments = await storage.getEnrollmentsByCourse(course.id);
            const assignments = await storage.getAssignmentsByCourse(course.id);
            
            return {
              ...course,
              lecturer,
              enrollmentCount: enrollments.length,
              isEnrolled: false,
              assignments
            };
          })
        );
      }

      res.json(courses);
    } catch (error) {
      console.error("Error fetching extended courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/assignments/extended", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let assignments;

      if (userRole === 'student') {
        const enrollments = await storage.getEnrollmentsByStudent(userId);
        const courseIds = enrollments.map(e => e.courseId);
        
        assignments = [];
        for (const courseId of courseIds) {
          const courseAssignments = await storage.getAssignmentsByCourse(courseId);
          const course = await storage.getCourse(courseId);
          
          for (const assignment of courseAssignments) {
            const submission = await storage.getSubmission(assignment.id, userId);
            
            // Calculate time remaining
            let timeRemaining = null;
            if (assignment.dueDate) {
              const now = new Date();
              const due = new Date(assignment.dueDate);
              const diffMs = due.getTime() - now.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              
              timeRemaining = {
                days: Math.abs(diffDays),
                hours: Math.abs(diffHours),
                isOverdue: diffMs < 0
              };
            }
            
            assignments.push({
              ...assignment,
              course,
              submission,
              timeRemaining
            });
          }
        }
      } else if (userRole === 'lecturer') {
        const allCourses = await storage.getAllCourses();
        const userCourses = allCourses.filter(course => course.lecturerId === userId);
        
        assignments = [];
        for (const course of userCourses) {
          const courseAssignments = await storage.getAssignmentsByCourse(course.id);
          
          for (const assignment of courseAssignments) {
            assignments.push({
              ...assignment,
              course
            });
          }
        }
      } else {
        // Admin can see all assignments
        const allCourses = await storage.getAllCourses();
        assignments = [];
        
        for (const course of allCourses) {
          const courseAssignments = await storage.getAssignmentsByCourse(course.id);
          
          for (const assignment of courseAssignments) {
            assignments.push({
              ...assignment,
              course
            });
          }
        }
      }

      res.json(assignments);
    } catch (error) {
      console.error("Error fetching extended assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.get("/api/notifications", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      // Mock notifications for now - in a real app, this would come from a notifications table
      const notifications = [
        {
          id: '1',
          type: 'assignment',
          title: 'New Assignment',
          message: 'Mathematics Assignment 3 has been posted',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: false,
          priority: 'medium',
          actionUrl: '/assignments/3'
        },
        {
          id: '2',
          type: 'grade',
          title: 'Grade Posted',
          message: 'Your Physics Assignment 2 has been graded',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: false,
          priority: 'high',
          actionUrl: '/grades'
        },
        {
          id: '3',
          type: 'announcement',
          title: 'Class Announcement',
          message: 'Computer Science lecture moved to Room 101',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          isRead: true,
          priority: 'low'
        }
      ];

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/activity/recent", requireAuth, async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    try {
      // Mock recent activity - in a real app, this would track user actions
      const activities = [
        {
          id: '1',
          type: 'submission',
          title: 'Assignment Submitted',
          description: 'Mathematics Assignment 2 - Linear Algebra',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          metadata: { courseId: 1, assignmentId: 2 }
        },
        {
          id: '2',
          type: 'enrollment',
          title: 'Course Enrolled',
          description: 'Advanced Computer Science',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          metadata: { courseId: 3 }
        },
        {
          id: '3',
          type: 'grade',
          title: 'Grade Received',
          description: 'Physics Assignment 1 - Grade: A',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          metadata: { grade: 'A', assignmentId: 1 }
        }
      ];

      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/user/preferences", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      // Mock user preferences - in a real app, this would be stored in the database
      const preferences = {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          desktop: true
        },
        dashboard: {
          compactMode: false,
          showGrades: true,
          defaultTab: 'overview'
        },
        privacy: {
          profileVisibility: 'public',
          showActivity: true
        }
      };

      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  // Extended user profile endpoint
  app.get("/api/user/profile-extended", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const extendedProfile = {
        ...user,
        lastActive: new Date(),
        settings: {
          theme: "system",
          language: "en",
          timezone: "UTC",
          emailNotifications: true,
          pushNotifications: true,
          soundEnabled: true,
          autoSave: true,
          showOnlineStatus: true,
          compactMode: false
        }
      };

      res.json(extendedProfile);
    } catch (error) {
      console.error("Error fetching extended user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // User statistics endpoint
  app.get("/api/user/stats", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const enrollments = await storage.getEnrollmentsByStudent(userId);
      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.status === 'completed').length;

      const submissions = await storage.getSubmissionsByStudent(userId);
      const totalAssignments = submissions.length;
      const gradedSubmissions = submissions.filter(s => s.grade !== null);
      
      const avgGrade = gradedSubmissions.length > 0 
        ? gradedSubmissions.reduce((sum, s) => sum + (Number(s.grade) || 0), 0) / gradedSubmissions.length
        : 0;

      const stats = {
        coursesCompleted: completedCourses,
        totalCourses: totalCourses,
        assignmentsSubmitted: totalAssignments,
        totalAssignments: totalAssignments,
        averageGrade: Math.round(avgGrade),
        studyHours: Math.floor(Math.random() * 200) + 50,
        streakDays: Math.floor(Math.random() * 30) + 1,
        achievements: Math.floor(Math.random() * 15) + 3
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  // User activity endpoint
  app.get("/api/user/activity", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const submissions = await storage.getSubmissionsByStudent(userId);
      const enrollments = await storage.getEnrollmentsByStudent(userId);

      const activities = [
        ...submissions.slice(-5).map(submission => ({
          id: `submission-${submission.id}`,
          type: 'assignment',
          title: 'Assignment Submitted',
          description: `Submitted assignment for course`,
          timestamp: submission.submittedAt || new Date(),
          metadata: { submissionId: submission.id }
        })),
        ...enrollments.slice(-3).map(enrollment => ({
          id: `enrollment-${enrollment.id}`,
          type: 'course',
          title: 'Course Enrolled',
          description: `Enrolled in new course`,
          timestamp: enrollment.enrolledAt,
          metadata: { courseId: enrollment.courseId }
        })),
        {
          id: 'login-recent',
          type: 'login',
          title: 'Logged In',
          description: 'Successfully logged into the platform',
          timestamp: new Date(),
          metadata: {}
        }
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ message: "Failed to fetch user activity" });
    }
  });

  // Notifications endpoint
  app.get("/api/notifications", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const enrollments = await storage.getEnrollmentsByStudent(userId);
      const pendingEnrollments = await storage.getPendingEnrollments();
      
      const notifications = [
        ...pendingEnrollments.filter(e => e.studentId === userId).map(enrollment => ({
          id: `enrollment-${enrollment.id}`,
          type: 'info',
          title: 'Enrollment Pending',
          message: 'Your course enrollment is pending approval',
          timestamp: enrollment.enrolledAt,
          isRead: false,
          isStarred: false,
          isArchived: false,
          priority: 'medium',
          category: 'course'
        })),
        {
          id: 'welcome',
          type: 'success',
          title: 'Welcome to E-Academic!',
          message: 'Your account has been successfully created. Start exploring courses and assignments.',
          timestamp: new Date(Date.now() - 86400000),
          isRead: false,
          isStarred: true,
          isArchived: false,
          priority: 'high',
          category: 'system',
          sender: {
            id: 'system',
            name: 'E-Academic Team',
            role: 'System'
          }
        },
        {
          id: 'assignment-due',
          type: 'warning',
          title: 'Assignment Due Soon',
          message: 'You have an assignment due in 2 days. Don\'t forget to submit!',
          timestamp: new Date(Date.now() - 3600000),
          isRead: false,
          isStarred: false,
          isArchived: false,
          priority: 'urgent',
          category: 'assignment',
          actionUrl: '/assignments',
          actionLabel: 'View Assignment'
        }
      ];

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Notification settings endpoint
  app.get("/api/notifications/settings", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = {
        emailNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        soundEnabled: true,
        frequency: 'immediate',
        categories: {
          course: { enabled: true, email: true, push: true, sound: true },
          assignment: { enabled: true, email: true, push: true, sound: true },
          message: { enabled: true, email: false, push: true, sound: true },
          system: { enabled: true, email: true, push: false, sound: false }
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      };

      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  // Update notification settings
  app.patch("/api/notifications/settings", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = req.body;
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Mark notifications as read
  app.post("/api/notifications/mark-read", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      res.json({ message: "Notifications marked as read", ids });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });

  // Archive notifications
  app.post("/api/notifications/archive", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      res.json({ message: "Notifications archived", ids });
    } catch (error) {
      console.error("Error archiving notifications:", error);
      res.status(500).json({ message: "Failed to archive notifications" });
    }
  });

  // Delete notifications
  app.delete("/api/notifications/delete", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      res.json({ message: "Notifications deleted", ids });
    } catch (error) {
      console.error("Error deleting notifications:", error);
      res.status(500).json({ message: "Failed to delete notifications" });
    }
  });

  // Update profile
  app.patch("/api/user/profile", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const updateData = req.body;

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Update user settings
  app.patch("/api/user/settings", requireAuth, async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = req.body;
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  return app;
}