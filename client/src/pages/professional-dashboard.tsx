import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdvancedUserProfile } from "@/components/advanced-user-profile";
import { AdvancedMiniMenubar } from "@/components/advanced-mini-menubar";
import { AdvancedUserProfilePanel } from "@/components/advanced-user-profile-panel";
import { AdvancedNotifications } from "@/components/advanced-notifications";
import { AdvancedSidebar } from "@/components/advanced-sidebar";
import {
  Search,
  Bell,
  Settings,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  Play,
  Plus,
  Clock,
  Users,
  GraduationCap,
  Calendar,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Send
} from "lucide-react";
import '../styles/dashboard.css';

// Types from schema
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

interface Course {
  id: number;
  title: string;
  description: string;
  department: string;
  credits: number;
  lecturerId: number;
  lecturer?: Partial<User>;
  enrollmentCount?: number;
  maxEnrollment?: number;
  isEnrolled?: boolean;
  userRole?: string;
}

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: Date;
  maxPoints: number;
  courseTitle?: string;
  instructorName?: string;
  submission?: any;
  timeRemaining?: {
    days: number;
    hours: number;
    isOverdue: boolean;
  };
}

interface DashboardStats {
  totalCourses?: number;
  enrolledCourses?: number;
  completedAssignments?: number;
  totalAssignments?: number;
  avgGrade?: number;
  totalStudents?: number;
  activeCourses?: number;
  totalUsers?: number;
}

export default function ProfessionalDashboard({ user }: { user: User }) {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdvancedProfileOpen, setIsAdvancedProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch dashboard data
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses/extended"],
  });

  const { data: assignments = [] } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments/extended"],
  });

  // Helper functions
  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };



  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="desktop-only">
        <AdvancedSidebar
          user={user}
          onProfileClick={() => setIsAdvancedProfileOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onLogout={() => window.location.href = '/api/logout'}
        />
      </div>

      {/* Mobile Menubar - Hidden on Desktop */}
      <div className="mobile-only">
        <AdvancedMiniMenubar
          user={user}
          onProfileClick={() => setIsAdvancedProfileOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      </div>

      <div className="dashboard-content">
      {/* Professional Header */}
      <header className="professional-header">
        <nav className="professional-nav">
          {/* Left Navigation */}
          <div className="nav-left">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">E-Academic</span>
            </div>
            
            <ul className="nav-menu hidden md:flex">
              <li><a href="#" className="nav-link active">Dashboard</a></li>
              <li><a href="#" className="nav-link">Courses</a></li>
              <li><a href="#" className="nav-link">Assignments</a></li>
              <li><a href="#" className="nav-link">Gradebook</a></li>
              <li><a href="#" className="nav-link">Calendar</a></li>
              <li><a href="#" className="nav-link">Reports</a></li>
            </ul>
          </div>

          {/* Search Bar */}
          <div className="nav-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search courses, assignments, students..."
              className="search-input"
            />
          </div>

          {/* Right Section */}
          <div className="nav-right">
            <button className="notification-btn">
              <Bell className="h-5 w-5" />
              <span className="notification-badge"></span>
            </button>
            
            <button 
              className="user-profile-btn"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="user-avatar">
                {getInitials(user.firstName, user.lastName, user.username)}
              </div>
              <div className="user-info hidden md:block">
                <div className="user-name">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username}
                </div>
                <div className="user-role">{formatRole(user.role)}</div>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-info">
              <div className="welcome-header">
                <div className="welcome-icon">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="welcome-text">
                  <h1>Welcome back, {user.firstName || user.username}!</h1>
                  <p>{formatRole(user.role)} Dashboard • {getCurrentDate()}</p>
                </div>
              </div>
              
              <div className="welcome-metrics">
                <div className="metric-item">
                  <div className="metric-header">
                    <BookOpen className="metric-icon text-blue" />
                  </div>
                  <div className="metric-value">{courses.length}</div>
                  <div className="metric-label">Active Courses</div>
                </div>
                
                <div className="metric-item">
                  <div className="metric-header">
                    <FileText className="metric-icon text-green" />
                  </div>
                  <div className="metric-value">{assignments.length}</div>
                  <div className="metric-label">Assignments</div>
                </div>
                
                <div className="metric-item">
                  <div className="metric-header">
                    <Award className="metric-icon text-purple" />
                  </div>
                  <div className="metric-value">{stats?.completedAssignments || 0}</div>
                  <div className="metric-label">Completed</div>
                </div>
                
                <div className="metric-item">
                  <div className="metric-header">
                    <TrendingUp className="metric-icon text-orange" />
                  </div>
                  <div className="metric-value">{stats?.avgGrade || 85}%</div>
                  <div className="metric-label">Avg Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="performance-grid">
          <div className="performance-card">
            <div className="card-content">
              <div className="card-icon-wrapper bg-blue">
                <BookOpen className="card-icon" />
              </div>
              <div className="card-details">
                <h3>{courses.length}</h3>
                <p>Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <div className="card-content">
              <div className="card-icon-wrapper bg-green">
                <FileText className="card-icon" />
              </div>
              <div className="card-details">
                <h3>{assignments.length}</h3>
                <p>Total Assignments</p>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <div className="card-content">
              <div className="card-icon-wrapper bg-purple">
                <Award className="card-icon" />
              </div>
              <div className="card-details">
                <h3>{stats?.completedAssignments || 0}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <div className="card-content">
              <div className="card-icon-wrapper bg-orange">
                <TrendingUp className="card-icon" />
              </div>
              <div className="card-details">
                <h3>{stats?.avgGrade || 85}%</h3>
                <p>Average Performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="content-layout">
          {/* Courses Panel */}
          <div className="courses-panel">
            <div className="panel-header">
              <h2 className="panel-title">My Courses</h2>
              <button className="panel-action">
                <Plus className="h-4 w-4" />
                View All
              </button>
            </div>
            <div className="panel-content">
              <div className="course-grid">
                {courses.slice(0, 4).map((course) => (
                  <div key={course.id} className="course-card">
                    <div className="course-icon">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="course-info">
                      <div className="course-title">{course.title}</div>
                      <div className="course-department">{course.department}</div>
                      <div className="course-meta">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrollmentCount || 0} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {course.credits} credits
                        </span>
                      </div>
                    </div>
                    <div className="course-actions">
                      <button className="course-btn">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="course-btn">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {courses.length === 0 && (
                  <div className="empty-state">
                    <BookOpen className="empty-icon" />
                    <p className="empty-message">No courses enrolled yet</p>
                    <button className="empty-action">Browse Courses</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Panels */}
          <div className="sidebar-panels">
            {/* Assignments Panel */}
            <div className="assignments-panel">
              <div className="panel-header">
                <h3 className="panel-title">Upcoming Assignments</h3>
              </div>
              <div className="panel-content">
                <div className="assignment-list">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="assignment-item">
                      <div className="assignment-icon">
                        <FileText className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="assignment-details">
                        <div className="assignment-title">{assignment.title}</div>
                        <div className="assignment-course">{assignment.courseTitle}</div>
                        <div className="assignment-due">
                          <Clock className="h-3 w-3" />
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {assignments.length === 0 && (
                    <div className="empty-state">
                      <FileText className="empty-icon" />
                      <p className="empty-message">No assignments due</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Panel */}
            <div className="progress-panel">
              <div className="panel-header">
                <h3 className="panel-title">Progress Overview</h3>
              </div>
              <div className="panel-content">
                <div className="progress-list">
                  <div className="progress-item">
                    <div className="progress-header">
                      <span className="progress-label">Course Completion</span>
                      <span className="progress-percentage">75%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="progress-item">
                    <div className="progress-header">
                      <span className="progress-label">Assignment Progress</span>
                      <span className="progress-percentage">60%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="progress-item">
                    <div className="progress-header">
                      <span className="progress-label">Overall Performance</span>
                      <span className="progress-percentage">85%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced Footer */}
      <footer className="advanced-footer">
        <div className="footer-container">
          {/* Footer Stats */}
          <div className="footer-stats">
            <div className="footer-stat">
              <div className="footer-stat-value">{courses.length}+</div>
              <div className="footer-stat-label">Active Courses</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">{stats?.totalStudents || 250}+</div>
              <div className="footer-stat-label">Students Enrolled</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">95%</div>
              <div className="footer-stat-label">Success Rate</div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="footer-logo-text">E-Academic</span>
              </div>
              <p className="footer-description">
                Empowering education through innovative technology. Our comprehensive academic management platform transforms the way institutions deliver learning experiences.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="social-link">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="social-link">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="social-link">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Platform</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">
                  <BookOpen className="footer-link-icon" />
                  Courses
                </a>
                <a href="#" className="footer-link">
                  <FileText className="footer-link-icon" />
                  Assignments
                </a>
                <a href="#" className="footer-link">
                  <BarChart3 className="footer-link-icon" />
                  Analytics
                </a>
                <a href="#" className="footer-link">
                  <Calendar className="footer-link-icon" />
                  Schedule
                </a>
                <a href="#" className="footer-link">
                  <MessageSquare className="footer-link-icon" />
                  Messages
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h3 className="footer-title">Resources</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">
                  <ExternalLink className="footer-link-icon" />
                  Help Center
                </a>
                <a href="#" className="footer-link">
                  <ExternalLink className="footer-link-icon" />
                  Documentation
                </a>
                <a href="#" className="footer-link">
                  <ExternalLink className="footer-link-icon" />
                  API Reference
                </a>
                <a href="#" className="footer-link">
                  <ExternalLink className="footer-link-icon" />
                  Status Page
                </a>
                <a href="#" className="footer-link">
                  <ExternalLink className="footer-link-icon" />
                  Tutorials
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <div className="footer-links">
                <a href="#" className="footer-link">About Us</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Press</a>
                <a href="#" className="footer-link">Partners</a>
                <a href="#" className="footer-link">Blog</a>
              </div>
            </div>

            {/* Contact & Newsletter */}
            <div className="footer-section">
              <h3 className="footer-title">Contact</h3>
              {/* Contact Info */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>contact@bonaventure.org.ng</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+234 (081) 2222-5406</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>Awka, Anambra, Nigeria</span>
                </div>
              </div>
              
              <div className="footer-newsletter">
                <h4 className="footer-title">Newsletter</h4>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2025 E-Academic. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
              <a href="#" className="footer-bottom-link">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* Advanced Components */}
      <AdvancedUserProfilePanel
        isOpen={isAdvancedProfileOpen}
        onClose={() => setIsAdvancedProfileOpen(false)}
        user={user}
      />

      <AdvancedNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        user={user}
      />

      {/* User Profile Modal */}
      <AdvancedUserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: block;
        }

        .dashboard-content {
          flex: 1;
          overflow-x: hidden;
          margin-top: 4rem; /* Space for mobile menubar */
        }

        /* Desktop Layout */
        @media (min-width: 1024px) {
          .desktop-only {
            display: block;
          }

          .mobile-only {
            display: none;
          }

          .dashboard-content {
            margin-left: 20rem; /* Space for sidebar */
            margin-top: 0;
          }
        }

        /* Remove old professional dashboard styles on desktop */
        @media (min-width: 1024px) {
          .professional-header {
            display: none;
          }
        }

        /* Adjust content spacing */
        .dashboard-content .main-content {
          margin-top: 0;
        }

        @media (max-width: 1023px) {
          .dashboard-content .main-content {
            margin-top: 2rem;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-content {
            margin-top: 4.5rem;
          }
        }
      `}</style>
    </div>
  );
}