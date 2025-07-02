import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/logo";
import { AdvancedUserProfile } from "@/components/advanced-user-profile";
import {
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  Calendar,
  MessageSquare,
  Users,
  PieChart,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  Play,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  User,
  Home,
  GraduationCap,
  BarChart3,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";

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

export default function TutorDashboard({ user }: { user: User }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BookOpen, label: "My Courses", count: courses.length },
    { icon: FileText, label: "Assignments", count: assignments.length },
    { icon: Calendar, label: "Calendar" },
    { icon: MessageSquare, label: "Messages" },
    { icon: BarChart3, label: "Quiz Attempts" },
    { icon: GraduationCap, label: "Gradebook" },
    { icon: Settings, label: "Settings" },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Logo size="sm" />
              <div className="hidden lg:flex items-center ml-6 space-x-8">
                <nav className="flex space-x-8">
                  <a href="#" className="text-gray-900 font-medium text-sm">Dashboard</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Courses</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Assignments</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Gradebook</a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Calendar</a>
                </nav>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses, assignments, students..."
                  className="pl-10 pr-4 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 text-left p-2"
                  onClick={() => setIsProfileOpen(true)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                      {getInitials(user.firstName, user.lastName, user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{formatRole(user.role)}</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Professional Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Mobile Logo */}
            <div className="lg:hidden p-6 border-b border-gray-200">
              <Logo size="md" />
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-6">
              <div className="space-y-1">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                      item.active
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count && (
                      <span className={cn(
                        "ml-3 inline-block py-0.5 px-2 text-xs rounded-full",
                        item.active 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-gray-100 text-gray-600"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Quick Actions */}
            <div className="px-3 py-4 border-t border-gray-200">
              <div className="space-y-2">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
              </div>
            </div>

            {/* User Profile at Bottom */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {getInitials(user.firstName, user.lastName, user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{formatRole(user.role)}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-2 p-1">
                  <Settings className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6 space-y-8">
            {/* Professional Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user.firstName || user.username}
                      </h1>
                      <p className="text-gray-600">
                        {formatRole(user.role)} Dashboard - {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-lg font-semibold text-blue-900">
                            {stats?.enrolledCourses || courses.length}
                          </p>
                          <p className="text-sm text-blue-700">Active Courses</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-lg font-semibold text-green-900">
                            {assignments.length}
                          </p>
                          <p className="text-sm text-green-700">Total Assignments</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-lg font-semibold text-purple-900">
                            {stats?.completedAssignments || 0}
                          </p>
                          <p className="text-sm text-purple-700">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-semibold text-gray-900">
                        {courses.length}
                      </p>
                      <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-semibold text-gray-900">
                        {assignments.length}
                      </p>
                      <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.completedAssignments || 0}
                      </p>
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.avgGrade || 85}%
                      </p>
                      <p className="text-sm font-medium text-gray-500">Average Grade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* My Courses */}
              <div className="lg:col-span-2">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-900">My Courses</CardTitle>
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                      <Plus className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.department}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Users className="h-3 w-3" />
                                <span>{course.enrollmentCount || 0} students</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Award className="h-3 w-3" />
                                <span>{course.credits} credits</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {courses.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Browse Courses
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Assignments */}
              <div className="space-y-6">
                {/* Upcoming Assignments */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {assignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm text-gray-900 truncate">
                              {assignment.title}
                            </h5>
                            <p className="text-xs text-gray-600 truncate">
                              {assignment.courseTitle}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                Due {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {assignments.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-600">No assignments due</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Progress Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Course Completion</span>
                          <span className="font-semibold text-gray-900">75%</span>
                        </div>
                        <Progress value={75} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Assignment Completion</span>
                          <span className="font-semibold text-gray-900">60%</span>
                        </div>
                        <Progress value={60} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Overall Performance</span>
                          <span className="font-semibold text-gray-900">85%</span>
                        </div>
                        <Progress value={85} className="h-2 bg-gray-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* User Profile Modal */}
      <AdvancedUserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </div>
  );
}