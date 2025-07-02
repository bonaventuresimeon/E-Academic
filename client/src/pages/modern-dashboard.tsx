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
  User
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
  createdAt: Date;
}

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: Date;
  maxPoints: number;
  createdAt: Date;
}

// Hook for authentication
function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

export default function ModernDashboard() {
  const { user, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Fetch dashboard data
  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  const { data: assignments } = useQuery({
    queryKey: ["/api/assignments/extended"],
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth';
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Logo variant="light" size="sm" />
              <span className="text-xl font-bold text-white">EduLearn</span>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-blue-400 bg-blue-900/30">
                <Calendar className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Mailbox
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Group Chat
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <PieChart className="w-4 h-4 mr-2" />
                Apps
              </Button>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right Side - Actions and Profile */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">{(user as any)?.firstName || (user as any)?.username}</div>
                <div className="text-xs text-slate-400 capitalize">{(user as any)?.role}</div>
              </div>
              <Avatar 
                className="w-8 h-8 cursor-pointer"
                onClick={() => setShowUserProfile(true)}
              >
                <AvatarFallback className="bg-blue-600 text-white">
                  {(user as any)?.firstName?.[0] || (user as any)?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 border-0 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Learn With Effectively With Us!</h1>
                <p className="text-teal-100">Get 30% off every course on January.</p>
                
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Students</div>
                      <div className="text-sm text-teal-100">{(stats as any)?.totalUsers || '75,000+'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Expert Mentors</div>
                      <div className="text-sm text-teal-100">200+</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="w-80 h-40 bg-teal-400/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <div className="text-sm opacity-75">Learning Illustration</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-sm text-slate-400">Have More</h2>
            <p className="text-lg">knowledge to share?</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{(stats as any)?.coursesInProgress || 5}</div>
              <div className="text-sm text-slate-400">Courses in Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{(stats as any)?.forumDiscussions || 25}</div>
              <div className="text-sm text-slate-400">Forum Discussion</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Courses */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Popular Courses</h3>
              <Button variant="link" className="text-blue-400 text-sm">All Courses</Button>
            </div>
            <div className="space-y-3">
              {(courses as Course[])?.slice(0, 4).map((course: Course, index: number) => {
                const colors = ['bg-yellow-500', 'bg-pink-500', 'bg-teal-500', 'bg-blue-500'];
                const letters = ['U', 'M', 'W', 'M'];
                return (
                  <Card key={course.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${colors[index]} rounded-lg flex items-center justify-center text-white font-bold`}>
                            {letters[index]}
                          </div>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-slate-400">{course.department}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Course
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Current Activity */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Current Activity</h3>
            
            {/* Monthly Progress Chart */}
            <Card className="bg-slate-800 border-slate-700 mb-4">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Monthly Progress</h4>
                <p className="text-sm text-slate-400 mb-4">This is the latest improvement</p>
                
                {/* Simple progress visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{(stats as any)?.completionRate || 85}%</span>
                  </div>
                  <Progress value={(stats as any)?.completionRate || 85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-yellow-500 border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-white">450K+</div>
                  <div className="text-sm text-yellow-100">Online Course</div>
                  <div className="text-xs text-yellow-200 mt-1">This is the latest stats</div>
                  <Button size="sm" variant="ghost" className="mt-2 text-white hover:bg-yellow-600">
                    <Play className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-pink-500 border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-white">200K+</div>
                  <div className="text-sm text-pink-100">Video Course</div>
                  <Button size="sm" variant="ghost" className="mt-2 text-white hover:bg-pink-600">
                    <Play className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Best Instructors */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Best Instructors</h3>
              <Button variant="link" className="text-blue-400 text-sm">See All</Button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Nil Yeager", courses: "5 Design Course", avatar: "N" },
                { name: "Theron Trump", courses: "5 Design Course", avatar: "T" },
                { name: "Tyler Mark", courses: "5 Design Course", avatar: "T" },
                { name: "Johen Mark", courses: "5 Design Course", avatar: "J" }
              ].map((instructor, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {instructor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-slate-400">{instructor.courses}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Courses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* School Performance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 School Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Majira Qosimi', 'Sazban Maz', 'Presient haji', 'Daka agar', 'Majira Qosimi'].map((school, index) => {
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-yellow-500'];
                  const values = [100, 80, 75, 65, 50];
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{school}</span>
                        <span>{values[index]}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${values[index]}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Overall Pass Percentage */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Overall Pass Percentage</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent transform rotate-45"></div>
                <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">85%</div>
                    <div className="text-xs text-slate-400">Pass Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Usage */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Content Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-green-400">12.5% higher than last month</div>
                <div className="space-y-3">
                  {[
                    { label: 'Video Content', value: 45, color: 'bg-blue-500' },
                    { label: 'Reading Material', value: 30, color: 'bg-green-500' },
                    { label: 'Interactive Labs', value: 25, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* User Profile Modal */}
      <AdvancedUserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        user={user as any}
      />
    </div>
  );
}