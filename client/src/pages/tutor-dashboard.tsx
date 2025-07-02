import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "../components/logo";
import { Bell, Search, Settings, User, BookOpen, Users, TrendingUp, Award, Calendar, MessageSquare, Star, BarChart3, Play, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  totalProgress: number;
  studyTime: string;
}

interface Course {
  id: number;
  title: string;
  instructor: {
    name: string;
    image?: string;
  };
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  image?: string;
  rating: number;
  students: number;
}

interface Instructor {
  id: number;
  name: string;
  image?: string;
  specialization: string;
  rating: number;
  students: number;
  courses: number;
}

export default function TutorDashboard() {
  const { user } = useAuth();

  // Mock data matching TutorLMS design
  const dashboardStats: DashboardStats = {
    enrolledCourses: 8,
    completedCourses: 3,
    totalProgress: 68,
    studyTime: "42h 30m"
  };

  const featuredCourses: Course[] = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: { name: "Sarah Johnson", image: "" },
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      category: "Web Development",
      rating: 4.9,
      students: 1250
    },
    {
      id: 2,
      title: "Digital Marketing Mastery",
      instructor: { name: "Mike Chen", image: "" },
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      category: "Marketing",
      rating: 4.8,
      students: 892
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: { name: "Emma Wilson", image: "" },
      progress: 90,
      totalLessons: 20,
      completedLessons: 18,
      category: "Design",
      rating: 4.9,
      students: 1580
    }
  ];

  const topInstructors: Instructor[] = [
    {
      id: 1,
      name: "Dr. Alexander Smith",
      image: "",
      specialization: "Computer Science",
      rating: 4.9,
      students: 2480,
      courses: 12
    },
    {
      id: 2,
      name: "Prof. Maria Garcia",
      image: "",
      specialization: "Digital Marketing",
      rating: 4.8,
      students: 1920,
      courses: 8
    },
    {
      id: 3,
      name: "John Peterson",
      image: "",
      specialization: "Graphic Design",
      rating: 4.9,
      students: 1650,
      courses: 6
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo className="text-blue-600" size="md" />
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="text-blue-600 font-medium">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-gray-600">
                My Courses
              </Button>
              <Button variant="ghost" className="text-gray-600">
                Browse
              </Button>
              <Button variant="ghost" className="text-gray-600">
                Progress
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                className="pl-10 w-80 bg-gray-50 border-gray-200"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.firstName?.[0] || user?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || user?.username || 'Student'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{dashboardStats.enrolledCourses}</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{dashboardStats.completedCourses}</p>
                </div>
                <Award className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Progress</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalProgress}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-1">Study Time</p>
                  <p className="text-3xl font-bold">{dashboardStats.studyTime}</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Continue Learning</span>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {featuredCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {course.instructor.name} • {course.category}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray={`${dashboardStats.totalProgress}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {dashboardStats.totalProgress}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Overall Progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Instructors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topInstructors.map((instructor, index) => (
                    <div key={instructor.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {instructor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {instructor.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {instructor.specialization}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {instructor.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">
                            {instructor.students} students
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Study Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join Discussion
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}