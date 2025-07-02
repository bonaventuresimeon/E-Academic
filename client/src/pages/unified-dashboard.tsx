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
  Bookmark
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Interfaces
interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalAssignments: number;
  totalQuizzes: number;
  totalTests: number;
  completionRate: number;
  averageScore: number;
}

interface Course {
  id: number;
  title: string;
  code: string;
  description?: string;
  credits: number;
  department: string;
  isActive: boolean;
  studentsCount: number;
  assignmentsCount: number;
  quizzesCount: number;
  testsCount: number;
}

interface Assignment {
  id: number;
  title: string;
  description?: string;
  courseTitle: string;
  dueDate?: Date;
  maxPoints?: number;
  submissionsCount: number;
  status: 'draft' | 'published' | 'closed';
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard'],
    initialData: {
      totalCourses: 0,
      activeCourses: 0,
      totalStudents: 0,
      totalAssignments: 0,
      totalQuizzes: 0,
      totalTests: 0,
      completionRate: 0,
      averageScore: 0
    }
  });

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    initialData: []
  });

  // Fetch enrollments for students
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments/student', user?.id],
    enabled: user?.role === 'student' && !!user?.id,
    initialData: []
  });

  // Fetch submissions for students
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['/api/submissions/student', user?.id],
    enabled: user?.role === 'student' && !!user?.id,
    initialData: []
  });

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      count: null
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      count: stats?.totalCourses || 0
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: FileText,
      count: stats?.totalAssignments || 0
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: Brain,
      count: stats?.totalQuizzes || 0
    },
    {
      id: 'tests',
      label: 'Tests',
      icon: Award,
      count: stats?.totalTests || 0
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      count: stats?.totalStudents || 0,
      adminOnly: true
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      count: null
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: Zap,
      count: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      count: null
    }
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    !item.adminOnly || (item.adminOnly && (user?.role === 'admin' || user?.role === 'lecturer'))
  );

  // Stats cards data
  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Enrolled Courses',
          value: enrollments?.length || 0,
          icon: BookOpen,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        },
        {
          title: 'Assignments',
          value: submissions?.filter((s: any) => s.type === 'assignment')?.length || 0,
          icon: FileText,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        },
        {
          title: 'Completion Rate',
          value: `${stats?.completionRate || 0}%`,
          icon: Target,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        },
        {
          title: 'Average Score',
          value: `${stats?.averageScore || 0}%`,
          icon: Trophy,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        }
      ];
    } else {
      return [
        {
          title: 'Total Courses',
          value: stats?.totalCourses || 0,
          icon: BookOpen,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        },
        {
          title: 'Active Students',
          value: stats?.totalStudents || 0,
          icon: Users,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        },
        {
          title: 'Assignments',
          value: stats?.totalAssignments || 0,
          icon: FileText,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20'
        },
        {
          title: 'System Score',
          value: `${stats?.averageScore || 0}%`,
          icon: Trophy,
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
      {/* Unified Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white">AcademicCRM</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
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
                        "w-full justify-start h-10 transition-all duration-200",
                        isActive 
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10" 
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent",
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

            {/* Footer */}
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                  {user?.role}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
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
                        "bg-slate-800/50 backdrop-blur-sm border transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10",
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

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">New assignment submitted</p>
                              <p className="text-xs text-slate-400">2 minutes ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Completion Rate</span>
                            <span className="text-white">{stats?.completionRate || 0}%</span>
                          </div>
                          <Progress value={stats?.completionRate || 0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Average Score</span>
                            <span className="text-white">{stats?.averageScore || 0}%</span>
                          </div>
                          <Progress value={stats?.averageScore || 0} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Course Management</h2>
                  {(user?.role === 'admin' || user?.role === 'lecturer') && (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
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
                            <span className="text-slate-400">Students:</span>
                            <span className="text-white">{course.studentsCount}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {(user?.role === 'admin' || user?.role === 'lecturer') && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs content can be added here */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Assignment Management</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Assignment management interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Quiz Management</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Quiz management interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Test Management</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Test management interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'students' && (user?.role === 'admin' || user?.role === 'lecturer') && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Student Management</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Student management interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Analytics dashboard coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'ai-assistant' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">AI Assistant interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <p className="text-slate-400">Settings interface coming soon...</p>
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

export default UnifiedDashboard;