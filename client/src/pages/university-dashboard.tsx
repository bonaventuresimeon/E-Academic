import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  PlusCircle, 
  Settings, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  Trophy,
  Target,
  BarChart3,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Brain,
  Zap,
  Award,
  Timer,
  GraduationCap,
  Home,
  Bell,
  Database,
  Shield,
  MessageSquare,
  Grid,
  Activity,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Bookmark,
  UserCheck,
  BookMarked,
  PenTool,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  RefreshCw,
  Wifi,
  WifiOff,
  HelpCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { 
  User as PrismaUser, 
  Course, 
  Enrollment, 
  Assignment, 
  Submission, 
  Quiz, 
  Test 
} from '@prisma/client';

// Extended types for database relations
interface EnrollmentWithCourse extends Enrollment {
  course: Course & { lecturer?: PrismaUser };
}

interface CourseWithDetails extends Course {
  lecturer?: PrismaUser;
  _count: {
    enrollments: number;
    assignments: number;
    quizzes: number;
    tests: number;
  };
}

interface AssignmentWithDetails extends Assignment {
  course: Course;
  _count: {
    submissions: number;
  };
}

interface SubmissionWithDetails extends Submission {
  assignment: Assignment & { course: Course };
}

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalAssignments: number;
  totalSubmissions: number;
  totalQuizzes: number;
  totalTests: number;
  pendingEnrollments: number;
  activeStudents: number;
  activeLecturers: number;
  completionRate: number;
  averageGrade: number;
}

const UniversityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Start collapsed on mobile, expanded on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return true;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle screen resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard'],
    initialData: {
      totalUsers: 3,
      totalCourses: 0,
      totalEnrollments: 0,
      totalAssignments: 0,
      totalSubmissions: 0,
      totalQuizzes: 0,
      totalTests: 0,
      pendingEnrollments: 0,
      activeStudents: 1,
      activeLecturers: 1,
      completionRate: 85,
      averageGrade: 88.5
    }
  });

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery<CourseWithDetails[]>({
    queryKey: ['/api/courses'],
    initialData: []
  });

  // Fetch enrollments for current user
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ['/api/enrollments/student', user?.id],
    enabled: !!user?.id,
    initialData: []
  });

  // Fetch assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<AssignmentWithDetails[]>({
    queryKey: ['/api/assignments'],
    initialData: []
  });

  // Fetch submissions for students
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<SubmissionWithDetails[]>({
    queryKey: ['/api/submissions/student', user?.id],
    enabled: user?.role === 'student' && !!user?.id,
    initialData: []
  });

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Dashboard', icon: Home, roles: ['student', 'lecturer', 'admin'] },
      { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length, roles: ['student', 'lecturer', 'admin'] },
      { id: 'assignments', label: 'Assignments', icon: FileText, count: assignments.length, roles: ['student', 'lecturer', 'admin'] },
      { id: 'grades', label: 'Grades', icon: Trophy, roles: ['student', 'lecturer'] },
      { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['student', 'lecturer', 'admin'] },
      { id: 'library', label: 'Library', icon: BookMarked, roles: ['student', 'lecturer'] },
    ];

    if (user?.role === 'admin') {
      baseItems.push(
        { id: 'users', label: 'Users', icon: Users, count: stats.totalUsers, roles: ['admin'] },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
        { id: 'system', label: 'System', icon: Database, roles: ['admin'] }
      );
    }

    if (user?.role === 'lecturer') {
      baseItems.push(
        { id: 'students', label: 'Students', icon: Users, roles: ['lecturer'] },
        { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['lecturer'] }
      );
    }

    baseItems.push({ id: 'settings', label: 'Settings', icon: Settings, roles: ['student', 'lecturer', 'admin'] });

    return baseItems.filter(item => item.roles.includes(user?.role || 'student'));
  };

  const navigationItems = getNavigationItems();

  // Get role-specific stats
  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Enrolled Courses',
          value: enrollments.length,
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: '+2 this semester'
        },
        {
          title: 'Assignments Due',
          value: assignments.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length,
          icon: ClipboardList,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: '3 this week'
        },
        {
          title: 'Average Grade',
          value: `${stats.averageGrade.toFixed(1)}%`,
          icon: Trophy,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: '+2.3% from last semester'
        },
        {
          title: 'Completion Rate',
          value: `${stats.completionRate}%`,
          icon: Target,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: 'On track'
        }
      ];
    } else if (user?.role === 'lecturer') {
      return [
        {
          title: 'My Courses',
          value: courses.filter(c => c.lecturerId === user?.id).length,
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: 'Active this semester'
        },
        {
          title: 'Total Students',
          value: stats.activeStudents,
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: '+12 new enrollments'
        },
        {
          title: 'Assignments Created',
          value: stats.totalAssignments,
          icon: FileText,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: '5 this month'
        },
        {
          title: 'Pending Reviews',
          value: stats.totalSubmissions,
          icon: ClipboardList,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          trend: 'Awaiting review'
        }
      ];
    } else {
      return [
        {
          title: 'Total Users',
          value: stats.totalUsers,
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: '+3 this month'
        },
        {
          title: 'Active Courses',
          value: stats.totalCourses,
          icon: BookOpen,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: 'All departments'
        },
        {
          title: 'System Health',
          value: '99.9%',
          icon: Activity,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: 'Excellent'
        },
        {
          title: 'Storage Used',
          value: '2.4 GB',
          icon: Database,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: '12% of quota'
        }
      ];
    }
  };

  const statsCards = getStatsCards();

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      queryClient.setQueryData(['/api/user'], null);
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", darkMode ? "dark bg-slate-900" : "bg-gray-50")}>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* University Header/Navbar */}
      <header className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300",
        darkMode 
          ? "bg-slate-900/95 border-slate-800" 
          : "bg-white/95 border-gray-200"
      )}>
        <div className="flex items-center justify-between h-16 px-3 md:px-6">
          {/* Left Side - Menu Button and Logo */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "lg:hidden p-2 shrink-0",
                darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2 min-w-0">
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shrink-0"
              )}>
                <GraduationCap className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden md:block min-w-0">
                <h1 className={cn(
                  "text-sm lg:text-xl font-bold truncate",
                  darkMode ? "text-white" : "text-gray-900"
                )}>
                  University Portal
                </h1>
                <p className={cn(
                  "text-xs lg:text-sm truncate",
                  darkMode ? "text-slate-400" : "text-gray-600"
                )}>
                  Academic Management System
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                darkMode ? "text-slate-400" : "text-gray-400"
              )} />
              <Input
                placeholder="Search courses, assignments, students..."
                className={cn(
                  "pl-10 border-0 shadow-sm",
                  darkMode 
                    ? "bg-slate-800 text-white placeholder-slate-400 focus:bg-slate-700" 
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white"
                )}
              />
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-1">
            {/* Mobile Search Button - Hidden on large screens */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileSearch(true)}
              className={cn(
                "p-2 lg:hidden shrink-0",
                darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "p-2 shrink-0",
                darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative p-2 shrink-0",
                darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 min-w-0"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    {user?.firstName || user?.username}
                  </p>
                  <p className={cn(
                    "text-xs capitalize truncate",
                    darkMode ? "text-slate-400" : "text-gray-500"
                  )}>
                    {user?.role}
                  </p>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-200 hidden lg:block shrink-0",
                  showProfile && "rotate-180",
                  darkMode ? "text-slate-400" : "text-gray-400"
                )} />
              </Button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className={cn(
                  "absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50",
                  darkMode 
                    ? "bg-slate-800 border-slate-700" 
                    : "bg-white border-gray-200"
                )}>
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn(
                          "font-medium",
                          darkMode ? "text-white" : "text-gray-900"
                        )}>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className={cn(
                          "text-sm",
                          darkMode ? "text-slate-400" : "text-gray-500"
                        )}>
                          {user?.email}
                        </p>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className={darkMode ? "bg-slate-700" : "bg-gray-200"} />
                  
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Separator className={cn("my-2", darkMode ? "bg-slate-700" : "bg-gray-200")} />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* University Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 h-[calc(100vh-64px)] transition-all duration-300 z-40 border-r",
          // Mobile: hidden by default, show when not collapsed
          // Desktop: always visible, width changes based on collapsed state
          sidebarCollapsed 
            ? "-translate-x-full lg:translate-x-0 lg:w-16" 
            : "translate-x-0 w-64",
          darkMode 
            ? "bg-slate-900 border-slate-800" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex flex-col h-full">
            {/* Quick Stats */}
            {!sidebarCollapsed && (
              <div className="p-4 border-b border-slate-800">
                <div className={cn(
                  "rounded-lg p-3",
                  darkMode ? "bg-slate-800" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      darkMode ? "text-slate-300" : "text-gray-700"
                    )}>
                      Academic Year 2024-25
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Semester 2 • Week 8
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => {
                        setActiveTab(item.id);
                        // Auto-collapse sidebar on mobile after selection
                        if (window.innerWidth < 1024) {
                          setSidebarCollapsed(true);
                        }
                      }}
                      className={cn(
                        "w-full justify-start h-12 transition-all duration-200 touch-manipulation",
                        isActive 
                          ? darkMode
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-100 text-blue-700 shadow-sm"
                          : darkMode
                            ? "text-slate-400 hover:text-white hover:bg-slate-800"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                        sidebarCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", !sidebarCollapsed && "mr-3")} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.count !== undefined && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "ml-2 text-xs",
                                isActive 
                                  ? "bg-white/20 text-white" 
                                  : darkMode 
                                    ? "bg-slate-700 text-slate-300" 
                                    : "bg-gray-200 text-gray-600"
                              )}
                            >
                              {item.count}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Sidebar Toggle */}
            <div className="p-3 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={cn(
                  "w-full",
                  darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 pt-16",
          // Mobile: no margin (sidebar overlays)
          // Desktop: margin based on sidebar state
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome Header */}
                <div className={cn(
                  "rounded-xl p-4 md:p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white"
                )}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2">
                        Welcome back, {user?.firstName || user?.username}!
                      </h2>
                      <p className="text-blue-100 text-sm md:text-base">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs md:text-sm text-blue-100">Current Time</p>
                      <p className="text-lg md:text-xl font-bold">
                        {new Date().toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <Card key={index} className={cn(
                        "transition-all duration-200 hover:shadow-lg",
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                      )}>
                        <CardContent className="p-3 md:p-6">
                          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                            <div className="flex-1">
                              <p className={cn(
                                "text-xs md:text-sm font-medium",
                                darkMode ? "text-slate-400" : "text-gray-600"
                              )}>
                                {card.title}
                              </p>
                              <p className={cn(
                                "text-lg md:text-2xl font-bold mt-1 md:mt-2",
                                darkMode ? "text-white" : "text-gray-900"
                              )}>
                                {card.value}
                              </p>
                              <p className="text-xs text-green-600 mt-1 hidden md:block">
                                {card.trend}
                              </p>
                            </div>
                            <div className={cn(
                              "w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center self-end md:self-auto",
                              card.bgColor
                            )}>
                              <Icon className={cn("w-4 h-4 md:w-6 md:h-6", card.color)} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className={cn(
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  )}>
                    <CardHeader>
                      <CardTitle className={cn(
                        "flex items-center",
                        darkMode ? "text-white" : "text-gray-900"
                      )}>
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium",
                              darkMode ? "text-white" : "text-gray-900"
                            )}>
                              Successfully logged in
                            </p>
                            <p className={cn(
                              "text-xs",
                              darkMode ? "text-slate-400" : "text-gray-500"
                            )}>
                              Authentication verified • Just now
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium",
                              darkMode ? "text-white" : "text-gray-900"
                            )}>
                              Dashboard loaded
                            </p>
                            <p className={cn(
                              "text-xs",
                              darkMode ? "text-slate-400" : "text-gray-500"
                            )}>
                              All systems operational • 1 min ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium",
                              darkMode ? "text-white" : "text-gray-900"
                            )}>
                              Database synchronized
                            </p>
                            <p className={cn(
                              "text-xs",
                              darkMode ? "text-slate-400" : "text-gray-500"
                            )}>
                              Latest data available • 2 min ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className={cn(
                    darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                  )}>
                    <CardHeader>
                      <CardTitle className={cn(
                        "flex items-center",
                        darkMode ? "text-white" : "text-gray-900"
                      )}>
                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {user?.role === 'student' && (
                          <>
                            <Button className="h-10 md:h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Browse Courses
                            </Button>
                            <Button variant="outline" className="h-10 md:h-12 text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              View Schedule
                            </Button>
                            <Button variant="outline" className="h-10 md:h-12 text-sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Assignment
                            </Button>
                            <Button variant="outline" className="h-10 md:h-12 text-sm">
                              <Trophy className="w-4 h-4 mr-2" />
                              Check Grades
                            </Button>
                          </>
                        )}
                        {user?.role === 'lecturer' && (
                          <>
                            <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Create Course
                            </Button>
                            <Button variant="outline" className="h-12">
                              <FileText className="w-4 h-4 mr-2" />
                              New Assignment
                            </Button>
                            <Button variant="outline" className="h-12">
                              <Users className="w-4 h-4 mr-2" />
                              View Students
                            </Button>
                            <Button variant="outline" className="h-12">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Analytics
                            </Button>
                          </>
                        )}
                        {user?.role === 'admin' && (
                          <>
                            <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white">
                              <Users className="w-4 h-4 mr-2" />
                              Manage Users
                            </Button>
                            <Button variant="outline" className="h-12">
                              <Database className="w-4 h-4 mr-2" />
                              System Status
                            </Button>
                            <Button variant="outline" className="h-12">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Reports
                            </Button>
                            <Button variant="outline" className="h-12">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Other tabs - placeholder content */}
            {activeTab !== 'overview' && (
              <Card className={cn(
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
              )}>
                <CardHeader>
                  <CardTitle className={cn(
                    "capitalize",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    {activeTab.replace('-', ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    darkMode ? "text-slate-400" : "text-gray-600"
                  )}>
                    {activeTab === 'courses' && `${courses.length} courses available in the system`}
                    {activeTab === 'assignments' && `${assignments.length} assignments total`}
                    {activeTab === 'grades' && 'Grade management interface'}
                    {activeTab === 'calendar' && 'Academic calendar and schedule management'}
                    {activeTab === 'library' && 'Digital library and resources'}
                    {activeTab === 'users' && `${stats.totalUsers} registered users`}
                    {activeTab === 'analytics' && 'System analytics and reporting'}
                    {activeTab === 'system' && 'System configuration and monitoring'}
                    {activeTab === 'students' && `${stats.activeStudents} active students`}
                    {activeTab === 'reports' && 'Academic reports and analytics'}
                    {activeTab === 'settings' && 'User preferences and system settings'}
                    {activeTab === 'profile' && 'User profile management'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* University Footer */}
      <footer className={cn(
        "border-t mt-8 transition-colors duration-300",
        // Mobile: no margin (sidebar overlays)
        // Desktop: margin based on sidebar state
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
        darkMode 
          ? "bg-slate-900 border-slate-800" 
          : "bg-white border-gray-200"
      )}>
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs md:text-sm">
              <span className={cn(
                darkMode ? "text-slate-400" : "text-gray-600"
              )}>
                © 2024 University Portal
              </span>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <span className={cn(
                darkMode ? "text-slate-400" : "text-gray-600"
              )}>
                Academic Management System v2.0
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={cn(
                  "text-xs md:text-sm",
                  darkMode ? "text-slate-400" : "text-gray-600"
                )}>
                  System Status: Online
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <span className={cn(
                "text-xs md:text-sm",
                darkMode ? "text-slate-400" : "text-gray-600"
              )}>
                Last Updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className={cn(
            "fixed top-0 left-0 right-0 p-4 border-b",
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
          )}>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(false)}
                className={cn(
                  "p-2",
                  darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="relative flex-1">
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  darkMode ? "text-slate-400" : "text-gray-400"
                )} />
                <Input
                  placeholder="Search courses, assignments, students..."
                  className={cn(
                    "pl-10 border-0 shadow-sm h-12",
                    darkMode 
                      ? "bg-slate-800 text-white placeholder-slate-400 focus:bg-slate-700" 
                      : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white"
                  )}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard;