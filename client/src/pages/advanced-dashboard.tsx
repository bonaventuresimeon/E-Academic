import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
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
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface Quiz {
  id: number;
  title: string;
  description?: string;
  courseTitle: string;
  timeLimit?: number;
  maxAttempts: number;
  isPublished: boolean;
  dueDate?: Date;
  questionsCount: number;
  attemptsCount: number;
  averageScore: number;
}

interface Test {
  id: number;
  title: string;
  description?: string;
  courseTitle: string;
  testType: 'EXAM' | 'QUIZ' | 'ASSESSMENT' | 'PRACTICE';
  duration: number;
  maxMarks: number;
  passingMarks: number;
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  resultsCount: number;
  averageScore: number;
}

export default function AdvancedDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = {
    totalCourses: 12,
    activeCourses: 8,
    totalStudents: 240,
    totalAssignments: 45,
    totalQuizzes: 32,
    totalTests: 18,
    completionRate: 87.5,
    averageScore: 82.3
  };

  const courses: Course[] = [
    {
      id: 1,
      title: "Advanced Web Development",
      code: "CS301",
      description: "Modern web technologies and frameworks",
      credits: 3,
      department: "Computer Science",
      isActive: true,
      studentsCount: 45,
      assignmentsCount: 8,
      quizzesCount: 6,
      testsCount: 3
    },
    {
      id: 2,
      title: "Database Systems",
      code: "CS302",
      description: "Database design and implementation",
      credits: 4,
      department: "Computer Science",
      isActive: true,
      studentsCount: 38,
      assignmentsCount: 6,
      quizzesCount: 4,
      testsCount: 2
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 1,
      title: "React Project Implementation",
      description: "Build a full-stack React application",
      courseTitle: "Advanced Web Development",
      dueDate: new Date('2025-01-15'),
      maxPoints: 100,
      submissionsCount: 42,
      status: 'published'
    },
    {
      id: 2,
      title: "Database Schema Design",
      description: "Design a normalized database schema",
      courseTitle: "Database Systems",
      dueDate: new Date('2025-01-20'),
      maxPoints: 80,
      submissionsCount: 35,
      status: 'published'
    }
  ];

  const quizzes: Quiz[] = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your understanding of JavaScript basics",
      courseTitle: "Advanced Web Development",
      timeLimit: 30,
      maxAttempts: 2,
      isPublished: true,
      dueDate: new Date('2025-01-10'),
      questionsCount: 15,
      attemptsCount: 43,
      averageScore: 85.2
    },
    {
      id: 2,
      title: "SQL Queries",
      description: "Practice complex SQL operations",
      courseTitle: "Database Systems",
      timeLimit: 45,
      maxAttempts: 3,
      isPublished: true,
      dueDate: new Date('2025-01-12'),
      questionsCount: 20,
      attemptsCount: 36,
      averageScore: 78.5
    }
  ];

  const tests: Test[] = [
    {
      id: 1,
      title: "Midterm Examination",
      description: "Comprehensive midterm covering all topics",
      courseTitle: "Advanced Web Development",
      testType: 'EXAM',
      duration: 120,
      maxMarks: 150,
      passingMarks: 90,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-01'),
      isPublished: false,
      resultsCount: 0,
      averageScore: 0
    }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalCourses}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {stats.activeCourses} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Students</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalStudents}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Assessments</CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.totalAssignments + stats.totalQuizzes + stats.totalTests}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {stats.totalQuizzes} quizzes, {stats.totalTests} tests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Score</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.averageScore}%</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {stats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <PlusCircle className="h-6 w-6" />
              Create Course
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <FileText className="h-6 w-6" />
              New Assignment
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Brain className="h-6 w-6" />
              Create Quiz
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <GraduationCap className="h-6 w-6" />
              Schedule Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New assignment submitted", course: "Advanced Web Development", time: "2 minutes ago", type: "submission" },
              { action: "Quiz completed", course: "Database Systems", time: "15 minutes ago", type: "quiz" },
              { action: "Course enrollment", course: "Advanced Web Development", time: "1 hour ago", type: "enrollment" },
              { action: "Test scheduled", course: "Database Systems", time: "2 hours ago", type: "test" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activity.type === 'submission' && "bg-green-500",
                    activity.type === 'quiz' && "bg-blue-500",
                    activity.type === 'enrollment' && "bg-purple-500",
                    activity.type === 'test' && "bg-orange-500"
                  )} />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.course}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CoursesTab = () => (
    <div className="space-y-6">
      {/* Courses Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Courses Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your courses and track student progress</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge variant={course.isActive ? "default" : "secondary"} className="mt-1">
                    {course.code}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Students</span>
                  <span className="font-medium">{course.studentsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                  <span className="font-medium">{course.assignmentsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                  <span className="font-medium">{course.quizzesCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tests</span>
                  <span className="font-medium">{course.testsCount}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{course.credits} Credits</span>
                  <Badge variant="outline">{course.department}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const AssignmentsTab = () => (
    <div className="space-y-6">
      {/* Assignments Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage course assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <Badge variant={
                      assignment.status === 'published' ? 'default' :
                      assignment.status === 'draft' ? 'secondary' : 'destructive'
                    }>
                      {assignment.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{assignment.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Course</span>
                      <p className="font-medium">{assignment.courseTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date</span>
                      <p className="font-medium">
                        {assignment.dueDate ? format(assignment.dueDate, 'MMM dd, yyyy') : 'No due date'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Points</span>
                      <p className="font-medium">{assignment.maxPoints || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Submissions</span>
                      <p className="font-medium">{assignment.submissionsCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const QuizzesTab = () => (
    <div className="space-y-6">
      {/* Quizzes Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <p className="text-gray-600 dark:text-gray-400">Create interactive quizzes for your students</p>
        </div>
        <Button className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{quiz.courseTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={quiz.isPublished ? "default" : "secondary"}>
                    {quiz.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{quiz.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Questions</span>
                  <span className="font-medium">{quiz.questionsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                  <span className="font-medium">{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Max Attempts</span>
                  <span className="font-medium">{quiz.maxAttempts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Attempts</span>
                  <span className="font-medium">{quiz.attemptsCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-medium">{quiz.averageScore}%</span>
                </div>
                <Progress value={quiz.averageScore} className="h-2" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const TestsTab = () => (
    <div className="space-y-6">
      {/* Tests Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tests & Examinations</h2>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage formal assessments</p>
        </div>
        <Button className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Schedule Test
        </Button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{test.courseTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    test.testType === 'EXAM' ? 'destructive' :
                    test.testType === 'QUIZ' ? 'default' :
                    test.testType === 'ASSESSMENT' ? 'secondary' : 'outline'
                  }>
                    {test.testType}
                  </Badge>
                  <Badge variant={test.isPublished ? "default" : "secondary"}>
                    {test.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{test.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium">{test.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Max Marks</span>
                    <span className="font-medium">{test.maxMarks}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Passing</span>
                    <span className="font-medium">{test.passingMarks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Results</span>
                    <span className="font-medium">{test.resultsCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                  <span className="font-medium">{format(test.startDate, 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">End Date</span>
                  <span className="font-medium">{format(test.endDate, 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>

              {test.resultsCount > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="font-medium">{test.averageScore}%</span>
                  </div>
                  <Progress value={test.averageScore} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Customize your dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assignment-alerts">Assignment Due Alerts</Label>
              <Switch id="assignment-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="quiz-reminders">Quiz Reminders</Label>
              <Switch id="quiz-reminders" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="grade-notifications">Grade Notifications</Label>
              <Switch id="grade-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-view">Default View</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="assignments">Assignments</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="items-per-page">Items per Page</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsTab />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizzesTab />
          </TabsContent>

          <TabsContent value="tests">
            <TestsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}