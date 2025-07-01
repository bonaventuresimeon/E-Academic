import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, Plus, Search, Eye, Users } from "lucide-react";
import Header from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Courses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("POST", "/api/courses/enroll", { courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Success",
        description: "Enrollment request submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (courseId: number) => {
    enrollMutation.mutate(courseId);
  };

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(courses?.map((course: any) => course.department) || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="mt-1 text-sm text-gray-600">Browse and manage your courses</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {(user?.role === 'lecturer' || user?.role === 'admin') && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Courses
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by title, instructor, or course code"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="100">100-Level</SelectItem>
                      <SelectItem value="200">200-Level</SelectItem>
                      <SelectItem value="300">300-Level</SelectItem>
                      <SelectItem value="400">400-Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course: any) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline">{course.department}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.code} • {course.credits} Credits</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Prof. {course.lecturerId}</span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {user?.role === 'student' && (
                        <Button 
                          className="flex-1"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
