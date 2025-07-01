import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, TrendingUp, Users, Plus, Check, Star, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import StatsCard from "@/components/stats-card";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: [`/api/enrollments/student/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: [`/api/submissions/student/${user?.id}`],
    enabled: !!user?.id,
  });

  if (statsLoading || enrollmentsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const recentActivities = [
    {
      id: 1,
      type: "submission",
      title: "Assignment submitted for Computer Science 101",
      time: "2 hours ago",
      icon: Check,
      color: "bg-green-500",
    },
    {
      id: 2,
      type: "grade",
      title: "Grade received for Mathematics 201 - A-",
      time: "1 day ago",
      icon: Star,
      color: "bg-blue-500",
    },
    {
      id: 3,
      type: "enrollment",
      title: "Enrolled in Physics 301",
      time: "3 days ago",
      icon: UserPlus,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.firstName}! Manage your courses and assignments
              </p>
            </div>
            <div className="flex space-x-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Enrolled Courses"
            value={stats?.enrolledCourses || 0}
            icon={BookOpen}
            color="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Pending Assignments"
            value={stats?.pendingAssignments || 0}
            icon={Clock}
            color="bg-orange-100 text-orange-600"
          />
          <StatsCard
            title="Completed Assignments"
            value={stats?.completedAssignments || 0}
            icon={Check}
            color="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Credits This Semester"
            value="18"
            icon={TrendingUp}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Recent Activity & Enrolled Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="relative">
                    {index < recentActivities.length - 1 && (
                      <span className="absolute top-8 left-4 -ml-px h-8 w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div className={`h-8 w-8 ${activity.color} rounded-full flex items-center justify-center`}>
                        <activity.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments && enrollments.length > 0 ? (
                  enrollments.slice(0, 3).map((enrollment: any) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Course {enrollment.courseId}
                          </h4>
                          <p className="text-xs text-gray-500">3 Credits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={enrollment.status === 'approved' ? 'default' : 'secondary'}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No enrolled courses</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by browsing available courses
                    </p>
                    <div className="mt-6">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Courses
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {enrollments && enrollments.length > 0 && (
                <div className="mt-4">
                  <Button variant="ghost" className="w-full">
                    View All Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
