import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Star,
  TrendingUp,
  User as UserIcon,
  Users,
  X,
  BarChart3,
  Target,
  Award,
  Activity,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Calendar as CalendarIcon,
  Clock4,
  Brain,
  Lightbulb,
  Zap,
  Shield,
  Moon,
  Sun,
  Globe,
  Palette,
  Volume2,
  Wifi,
  Monitor,
  Smartphone,
  Filter,
  SortAsc,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  StopCircle,
} from "lucide-react";
import type { User, Course, Assignment, Submission, Enrollment } from "@shared/schema";

// Mock useAuth hook since it doesn't exist yet
function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

// Mock apiRequest function
async function apiRequest(url: string, options?: any) {
  const method = typeof options === 'string' ? 'GET' : options?.method || 'GET';
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

interface DashboardStats {
  totalCourses: number;
  totalAssignments: number;
  totalSubmissions: number;
  totalQuizzes: number;
  totalTests: number;
  completionRate: number;
  averageGrade: number;
  upcomingDeadlines: number;
  recentActivity: number;
}

interface ExtendedCourse extends Course {
  lecturer?: User;
  enrollmentCount?: number;
  isEnrolled?: boolean;
  assignments?: Assignment[];
}

interface ExtendedAssignment extends Assignment {
  course?: Course;
  submission?: Submission;
  timeRemaining?: {
    days: number;
    hours: number;
    isOverdue: boolean;
  };
}

interface NotificationItem {
  id: string;
  type: 'assignment' | 'quiz' | 'test' | 'grade' | 'enrollment' | 'announcement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface ActivityItem {
  id: string;
  type: 'submission' | 'enrollment' | 'grade' | 'quiz_completion' | 'test_completion';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  dashboard: {
    compactMode: boolean;
    showGrades: boolean;
    defaultTab: string;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showActivity: boolean;
  };
}

export default function AdvancedDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  
  // Data fetching
  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated,
  });

  const { data: courses } = useQuery<ExtendedCourse[]>({
    queryKey: ['/api/courses/extended'],
    enabled: isAuthenticated,
  });

  const { data: assignments } = useQuery<ExtendedAssignment[]>({
    queryKey: ['/api/assignments/extended'],
    enabled: isAuthenticated,
  });

  const { data: notifications } = useQuery<NotificationItem[]>({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
  });

  const { data: recentActivity } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activity/recent'],
    enabled: isAuthenticated,
  });

  const { data: userPreferences } = useQuery<UserPreferences>({
    queryKey: ['/api/user/preferences'],
    enabled: isAuthenticated,
  });

  // Theme management
  useEffect(() => {
    if (userPreferences?.theme) {
      if (userPreferences.theme === 'dark' || 
          (userPreferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, [userPreferences?.theme]);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'assignments', label: 'Assignments', icon: FileText },
      { id: 'grades', label: 'Grades', icon: Star },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { id: 'quizzes', label: 'Quizzes', icon: Brain },
        { id: 'tests', label: 'Tests', icon: Target },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'progress', label: 'Progress', icon: TrendingUp },
      ];
    } else if (user?.role === 'lecturer') {
      return [
        ...baseItems,
        { id: 'create', label: 'Create Content', icon: PlusCircle },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'ai-tools', label: 'AI Tools', icon: Lightbulb },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'system', label: 'System', icon: Settings },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Logout handler
  const handleLogout = async () => {
    try {
      await apiRequest('/api/logout', { method: 'POST' });
      queryClient.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Welcome to Academic-CRM</CardTitle>
            <CardDescription>Please log in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    )}>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Advanced Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out",
        "border-r backdrop-blur-xl",
        darkMode 
          ? "bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 border-slate-700" 
          : "bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 border-slate-200",
        sidebarCollapsed ? "w-20" : "w-80",
        "lg:translate-x-0",
        sidebarCollapsed && "lg:w-20",
        !sidebarCollapsed && "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Academic-CRM
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Advanced Dashboard</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto lg:ml-0"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Quick Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
              <Avatar className="w-12 h-12 ring-2 ring-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize truncate">
                  {user?.role}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Online
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarCollapsed(true);
                }}
                className={cn(
                  "w-full justify-start h-12 transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Icon className={cn("w-5 h-5", !sidebarCollapsed && "mr-3")} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {!sidebarCollapsed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="w-full justify-start"
              >
                {darkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
              sidebarCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className={cn("w-4 h-4", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
      )}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300 bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search courses, assignments, students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications && notifications.some(n => !n.isRead) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab stats={dashboardStats} user={user} />}
          {activeTab === 'courses' && <CoursesTab courses={courses} user={user} />}
          {activeTab === 'assignments' && <AssignmentsTab assignments={assignments} user={user} />}
          {activeTab === 'grades' && <GradesTab user={user} />}
          {activeTab === 'analytics' && user?.role === 'lecturer' && <AnalyticsTab />}
          {activeTab === 'users' && user?.role === 'admin' && <UsersTab />}
          {/* Add more tab components as needed */}
        </div>
      </main>

      {/* Profile Panel */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 pr-8">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowProfile(false)}
          />
          <Card className="relative w-96 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 border-2 border-blue-200/50 dark:border-blue-700/50">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(false)}
                className="absolute top-2 right-2 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user?.firstName || user?.username}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <Badge variant="outline" className="mx-auto mt-2 capitalize">
                {user?.role}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" onClick={() => setActiveTab('profile')}>
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, user }: { stats?: DashboardStats; user?: User }) {
  const statsCards = [
    {
      title: "Total Courses",
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Assignments",
      value: stats?.totalAssignments || 0,
      icon: FileText,
      color: "bg-green-500",
      change: "+5%"
    },
    {
      title: "Average Grade",
      value: `${stats?.averageGrade || 0}%`,
      icon: Star,
      color: "bg-yellow-500",
      change: "+2%"
    },
    {
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+8%"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || user?.username}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Ready to continue your learning journey? You have {stats?.upcomingDeadlines || 0} upcoming deadlines.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {card.change} from last month
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", card.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Submit Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Brain className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Assignment submitted</p>
                      <p className="text-xs text-slate-500">Mathematics - Calculus I</p>
                      <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Courses Tab Component
function CoursesTab({ courses, user }: { courses?: ExtendedCourse[]; user?: User }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          {user?.role === 'lecturer' ? 'Create Course' : 'Enroll in Course'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </div>
                <Badge variant="outline">{course.credits} Credits</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center text-sm text-slate-500">
                <User className="w-4 h-4 mr-1" />
                {course.lecturer?.firstName} {course.lecturer?.lastName}
              </div>
              
              <div className="flex items-center text-sm text-slate-500">
                <Users className="w-4 h-4 mr-1" />
                {course.enrollmentCount || 0} students enrolled
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {user?.role === 'lecturer' && (
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ assignments, user }: { assignments?: ExtendedAssignment[]; user?: User }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {assignments?.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {assignment.course?.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center text-slate-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                    <div className="flex items-center text-slate-500">
                      <Star className="w-4 h-4 mr-1" />
                      {assignment.maxPoints || 0} points
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {assignment.submission ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Submitted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {!assignment.submission && (
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-1" />
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Grades Tab Component
function GradesTab({ user }: { user?: User }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Grades & Performance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Current GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">3.85</div>
              <p className="text-sm text-slate-500 mt-1">Out of 4.0</p>
              <Progress value={96.25} className="mt-4" />
            </div>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+5.2%</div>
              <p className="text-sm text-slate-500 mt-1">Improvement this semester</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Semester</span>
                  <span className="font-medium">3.85</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Semester</span>
                  <span className="font-medium">3.65</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Rank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-500" />
              Class Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">#15</div>
              <p className="text-sm text-slate-500 mt-1">Out of 245 students</p>
              <div className="mt-4">
                <div className="text-sm text-slate-600">Top 6% of class</div>
                <Progress value={94} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { course: "Advanced Mathematics", grade: "A", points: 4.0, progress: 95 },
              { course: "Computer Science", grade: "A-", points: 3.7, progress: 88 },
              { course: "Physics", grade: "B+", points: 3.3, progress: 82 },
              { course: "Literature", grade: "A", points: 4.0, progress: 92 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex-1">
                  <h4 className="font-medium">{item.course}</h4>
                  <Progress value={item.progress} className="mt-2 w-full max-w-xs" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{item.grade}</div>
                  <div className="text-sm text-slate-500">{item.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics Tab Component (for lecturers)
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Students", value: "245", icon: Users, color: "bg-blue-500" },
          { title: "Active Courses", value: "8", icon: BookOpen, color: "bg-green-500" },
          { title: "Avg. Grade", value: "85%", icon: Star, color: "bg-yellow-500" },
          { title: "Completion Rate", value: "92%", icon: CheckCircle, color: "bg-purple-500" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Chart placeholder - Student performance over time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Chart placeholder - Assignment submission rates
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Users Tab Component (for admins)
function UsersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "John Doe", email: "john@example.com", role: "Student", status: "Active" },
              { name: "Jane Smith", email: "jane@example.com", role: "Lecturer", status: "Active" },
              { name: "Bob Johnson", email: "bob@example.com", role: "Student", status: "Inactive" },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}