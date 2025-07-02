import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { User, Course, Enrollment, Assignment, Submission, Quiz, Test, AiRecommendation, GeneratedSyllabus } from '@prisma/client';

// Extended types with relations
interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

interface CourseWithDetails extends Course {
  lecturer?: User;
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

interface QuizWithDetails extends Quiz {
  course: Course;
  creator: User;
  _count: {
    attempts: number;
    questions: number;
  };
}

interface TestWithDetails extends Test {
  course: Course;
  creator: User;
  _count: {
    results: number;
    sections: number;
  };
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
  recentActivity: number;
}

const AdvancedDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard'],
    initialData: {
      totalUsers: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      totalAssignments: 0,
      totalSubmissions: 0,
      totalQuizzes: 0,
      totalTests: 0,
      pendingEnrollments: 0,
      activeStudents: 0,
      activeLecturers: 0,
      recentActivity: 0
    }
  });

  // Fetch courses with details
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

  // Fetch quizzes
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery<QuizWithDetails[]>({
    queryKey: ['/api/quizzes'],
    initialData: []
  });

  // Fetch tests
  const { data: tests = [], isLoading: testsLoading } = useQuery<TestWithDetails[]>({
    queryKey: ['/api/tests'],
    initialData: []
  });

  // Fetch all users for admin
  const { data: allUsers = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'admin',
    initialData: []
  });

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      count: null,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      count: courses.length,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'enrollments',
      label: 'Enrollments',
      icon: UserCheck,
      count: enrollments.length,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: FileText,
      count: assignments.length,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: Upload,
      count: submissions.length,
      roles: ['student']
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: Brain,
      count: quizzes.length,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'tests',
      label: 'Tests',
      icon: Award,
      count: tests.length,
      roles: ['student', 'lecturer', 'admin']
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      count: allUsers.length,
      roles: ['admin']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      count: null,
      roles: ['lecturer', 'admin']
    },
    {
      id: 'ai-tools',
      label: 'AI Tools',
      icon: Zap,
      count: null,
      roles: ['lecturer', 'admin']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      count: null,
      roles: ['student', 'lecturer', 'admin']
    }
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  // Get role-specific stats cards
  const getStatsCards = () => {
    const baseCards = [
      {
        title: 'Total Courses',
        value: stats.totalCourses,
        icon: BookOpen,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
      },
      {
        title: 'Active Users',
        value: stats.totalUsers,
        icon: Users,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      }
    ];

    if (user?.role === 'student') {
      return [
        {
          title: 'My Courses',
          value: enrollments.length,
          icon: BookMarked,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        },
        {
          title: 'Assignments',
          value: submissions.length,
          icon: PenTool,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        },
        {
          title: 'Quizzes Available',
          value: quizzes.filter(q => q.isPublished).length,
          icon: Brain,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        },
        {
          title: 'Tests Available',
          value: tests.filter(t => t.isPublished).length,
          icon: Award,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        }
      ];
    } else if (user?.role === 'lecturer') {
      return [
        ...baseCards,
        {
          title: 'My Courses',
          value: courses.filter(c => c.lecturerId === user?.id).length,
          icon: BookMarked,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        },
        {
          title: 'Total Assignments',
          value: stats.totalAssignments,
          icon: ClipboardList,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        }
      ];
    } else {
      return [
        ...baseCards,
        {
          title: 'Total Assignments',
          value: stats.totalAssignments,
          icon: ClipboardList,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        },
        {
          title: 'System Activity',
          value: stats.recentActivity,
          icon: Activity,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        }
      ];
    }
  };

  const statsCards = getStatsCards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Advanced Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out hud-sidebar",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-glow">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white">AcademicCRM</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 btn-hud"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {filteredSidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full justify-start h-10 transition-all duration-200 btn-hud",
                        isActive && "active",
                        sidebarCollapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", !sidebarCollapsed && "mr-3")} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.count !== null && (
                            <Badge variant="secondary" className="ml-2 bg-slate-700/50 text-slate-300 border-slate-600/50">
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

            {/* User Profile */}
            <div className="p-4 border-t border-slate-700/50">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.firstName || user?.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="min-h-screen content-overlay">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-30 hud-navbar">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                </h1>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                  {user?.role}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white btn-hud">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white btn-hud">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white btn-hud">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <Card key={index} className={cn(
                        "hud-card stats-card transition-all duration-200",
                        card.borderColor
                      )}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-400">{card.title}</p>
                              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
                            </div>
                            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", card.bgColor)}>
                              <Icon className={cn("w-6 h-6", card.color)} />
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
                  <Card className="hud-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-blue-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {user?.role !== 'student' && (
                          <>
                            <Button className="h-12 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              New Course
                            </Button>
                            <Button className="h-12 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400">
                              <FileText className="w-4 h-4 mr-2" />
                              Assignment
                            </Button>
                            <Button className="h-12 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400">
                              <Brain className="w-4 h-4 mr-2" />
                              Create Quiz
                            </Button>
                            <Button className="h-12 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400">
                              <Award className="w-4 h-4 mr-2" />
                              Schedule Test
                            </Button>
                          </>
                        )}
                        {user?.role === 'student' && (
                          <>
                            <Button className="h-12 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Browse Courses
                            </Button>
                            <Button className="h-12 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400">
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Work
                            </Button>
                            <Button className="h-12 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400">
                              <Brain className="w-4 h-4 mr-2" />
                              Take Quiz
                            </Button>
                            <Button className="h-12 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Grades
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="hud-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">System initialized successfully</p>
                            <p className="text-xs text-slate-400">Database connected</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">User {user?.username} logged in</p>
                            <p className="text-xs text-slate-400">Authentication verified</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Dashboard loaded</p>
                            <p className="text-xs text-slate-400">All systems operational</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status */}
                <Card className="hud-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-400" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Database</span>
                          <span className="text-green-400">Online</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">API Services</span>
                          <span className="text-green-400">Active</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Authentication</span>
                          <span className="text-green-400">Secure</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Course Management</h2>
                  {user?.role !== 'student' && (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white btn-hud">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  )}
                </div>

                {coursesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="hud-card animate-pulse">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="h-4 bg-slate-700 rounded"></div>
                            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <Card className="hud-card">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No courses available</p>
                      <p className="text-slate-500 text-sm mt-2">
                        {user?.role !== 'student' ? 'Create your first course to get started' : 'Check back later for new courses'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} className="hud-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                              <CardDescription className="text-slate-400">{course.code}</CardDescription>
                            </div>
                            <Badge variant={course.isActive ? "default" : "secondary"} className="ml-2">
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-slate-300 line-clamp-2">{course.description || 'No description available'}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Department:</span>
                                <span className="text-white">{course.department}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Credits:</span>
                                <span className="text-white">{course.credits}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Enrollments:</span>
                                <span className="text-white">{course._count?.enrollments || 0}</span>
                              </div>
                              {course.lecturer && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Lecturer:</span>
                                  <span className="text-white">{course.lecturer.firstName} {course.lecturer.lastName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 btn-hud">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {(user?.role === 'admin' || course.lecturerId === user?.id) && (
                              <Button size="sm" variant="outline" className="flex-1 btn-hud">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            {user?.role === 'student' && (
                              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                <UserCheck className="w-4 h-4 mr-1" />
                                Enroll
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs content placeholders */}
            {activeTab === 'enrollments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Enrollment Management</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">
                      {user?.role === 'student' 
                        ? `You are enrolled in ${enrollments.length} courses`
                        : 'Enrollment management interface will be implemented here'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Assignment Management</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Assignment management interface will be implemented here</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'submissions' && user?.role === 'student' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">My Submissions</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">
                      You have {submissions.length} submissions across all courses
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Quiz Management</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">
                      {quizzes.length > 0 
                        ? `${quizzes.length} quizzes available`
                        : 'No quizzes available yet'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Test Management</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">
                      {tests.length > 0 
                        ? `${tests.length} tests available`
                        : 'No tests available yet'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'users' && user?.role === 'admin' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">User Management</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">
                      Total registered users: {allUsers.length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'analytics' && user?.role !== 'student' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Analytics dashboard will be implemented here</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'ai-tools' && user?.role !== 'student' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">AI Tools</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <p className="text-slate-400">AI-powered tools for course generation and recommendations</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <Card className="hud-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Dark Mode</h3>
                          <p className="text-slate-400 text-sm">Toggle dark mode theme</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator className="bg-slate-700" />
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Notifications</h3>
                          <p className="text-slate-400 text-sm">Receive system notifications</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;