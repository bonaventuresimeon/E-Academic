import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdvancedUserProfile } from "@/components/advanced-user-profile";
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
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="professional-dashboard">
      {/* Professional Header */}
      <header className="professional-header">
        <nav className="professional-nav">
          {/* Left Navigation */}
          <div className="nav-left">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">E-Academic</span>
              </div>
            </div>
            
            <ul className={`nav-menu ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
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

      {/* User Profile Modal */}
      <AdvancedUserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </div>
  );
}