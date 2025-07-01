import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Calendar, Weight, FileText, Clock, Star, CheckCircle } from "lucide-react";
import Header from "@/components/layout/header";

export default function Assignments() {
  const { user } = useAuth();
  
  const { data: submissions, isLoading } = useQuery({
    queryKey: [`/api/submissions/student/${user?.id}`],
    enabled: !!user?.id && user?.role === 'student',
  });

  // Mock assignments for demonstration
  const mockAssignments = [
    {
      id: 1,
      title: "Data Structures Project",
      courseTitle: "Computer Science 101",
      instructor: "Prof. Sarah Smith",
      description: "Implement a binary search tree with insert, delete, and search operations. Include comprehensive test cases and documentation.",
      dueDate: "2024-12-15",
      weight: 25,
      type: "File submission",
      status: "pending",
      priority: "due-soon"
    },
    {
      id: 2,
      title: "Calculus Problem Set 4",
      courseTitle: "Mathematics 201",
      instructor: "Prof. Michael Johnson",
      description: "Solve integration problems using various techniques including substitution and integration by parts.",
      dueDate: "2024-12-10",
      weight: 15,
      type: "Text submission",
      status: "overdue",
      priority: "overdue"
    },
    {
      id: 3,
      title: "Physics Lab Report",
      courseTitle: "General Physics 301",
      instructor: "Prof. David Wilson",
      description: "Analyze experimental data from the pendulum motion lab and draw conclusions about gravitational acceleration.",
      dueDate: "2024-12-08",
      weight: 20,
      type: "File submission",
      status: "graded",
      grade: "A-",
      priority: "completed"
    }
  ];

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

  const getStatusBadge = (status: string, priority: string) => {
    switch (priority) {
      case "due-soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Submitted</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (priority: string) => {
    switch (priority) {
      case "due-soon":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <Clock className="h-4 w-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const pendingAssignments = mockAssignments.filter(a => a.status === "pending");
  const submittedAssignments = mockAssignments.filter(a => a.status === "submitted");
  const gradedAssignments = mockAssignments.filter(a => a.status === "graded");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-1 text-sm text-gray-600">Submit and track your assignments</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Assignment Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="submitted">
                Submitted ({submittedAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="graded">
                Graded ({gradedAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-6">
                {pendingAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            {getStatusBadge(assignment.status, assignment.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {assignment.courseTitle} • {assignment.instructor}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{assignment.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Weight className="h-4 w-4 mr-1" />
                              Weight: {assignment.weight}%
                            </span>
                            <span className="flex items-center">
                              {getStatusIcon(assignment.priority)}
                              <span className="ml-1">{assignment.type}</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-end space-y-2">
                          <Button 
                            className={assignment.priority === "overdue" ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            {assignment.priority === "overdue" ? "Submit Late" : "Submit Assignment"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {pendingAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending assignments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All assignments are up to date
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="submitted">
              <div className="space-y-6">
                {submittedAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            {getStatusBadge(assignment.status, assignment.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {assignment.courseTitle} • {assignment.instructor}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{assignment.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Submitted: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Weight className="h-4 w-4 mr-1" />
                              Weight: {assignment.weight}%
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-end space-y-2">
                          <div className="text-sm text-gray-500">Awaiting Grade</div>
                          <Button variant="ghost" size="sm">
                            View Submission
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {submittedAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No submitted assignments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Assignments you submit will appear here
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="graded">
              <div className="space-y-6">
                {gradedAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            {getStatusBadge(assignment.status, assignment.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {assignment.courseTitle} • {assignment.instructor}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{assignment.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Submitted: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Weight className="h-4 w-4 mr-1" />
                              Weight: {assignment.weight}%
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              Grade: {assignment.grade}
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-end space-y-2">
                          <div className="text-2xl font-bold text-green-600">{assignment.grade}</div>
                          <Button variant="ghost" size="sm">
                            View Feedback
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {gradedAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No graded assignments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Graded assignments will appear here
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
