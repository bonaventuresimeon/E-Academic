
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Filter, 
  Plus, 
  Search, 
  Eye, 
  Users, 
  Star, 
  Clock, 
  Calendar,
  GraduationCap,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Heart,
  BookMarked,
  TrendingUp,
  Award
} from "lucide-react";
import Header from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  department: string;
  credits: number;
  level: string;
  instructor: string;
  enrollmentCount: number;
  maxEnrollment: number;
  rating: number;
  difficulty: string;
  prerequisites: string[];
  schedule: {
    days: string[];
    time: string;
    location: string;
  };
  tags: string[];
  isEnrolled: boolean;
  isFavorite: boolean;
  semester: string;
  academicYear: string;
}

export default function Courses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCredits, setSelectedCredits] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Mock enhanced course data
  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      code: "CS101",
      description: "Fundamental concepts of computer science including programming, algorithms, and data structures.",
      department: "Computer Science",
      credits: 3,
      level: "100",
      instructor: "Dr. Sarah Johnson",
      enrollmentCount: 45,
      maxEnrollment: 50,
      rating: 4.5,
      difficulty: "Beginner",
      prerequisites: [],
      schedule: {
        days: ["Monday", "Wednesday", "Friday"],
        time: "10:00 AM - 11:00 AM",
        location: "Room 101, CS Building"
      },
      tags: ["Programming", "Algorithms", "Python"],
      isEnrolled: false,
      isFavorite: false,
      semester: "Fall",
      academicYear: "2024"
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      code: "MATH301",
      description: "Advanced topics in calculus, linear algebra, and differential equations.",
      department: "Mathematics",
      credits: 4,
      level: "300",
      instructor: "Prof. Michael Chen",
      enrollmentCount: 28,
      maxEnrollment: 35,
      rating: 4.2,
      difficulty: "Advanced",
      prerequisites: ["MATH201", "MATH202"],
      schedule: {
        days: ["Tuesday", "Thursday"],
        time: "2:00 PM - 3:30 PM",
        location: "Room 205, Math Building"
      },
      tags: ["Calculus", "Linear Algebra", "Theory"],
      isEnrolled: true,
      isFavorite: true,
      semester: "Fall",
      academicYear: "2024"
    },
    {
      id: 3,
      title: "Physics Laboratory",
      code: "PHYS201",
      description: "Hands-on experiments in mechanics, thermodynamics, and electromagnetism.",
      department: "Physics",
      credits: 2,
      level: "200",
      instructor: "Dr. Emily Rodriguez",
      enrollmentCount: 20,
      maxEnrollment: 24,
      rating: 4.7,
      difficulty: "Intermediate",
      prerequisites: ["PHYS101"],
      schedule: {
        days: ["Wednesday"],
        time: "1:00 PM - 4:00 PM",
        location: "Physics Lab A"
      },
      tags: ["Laboratory", "Experiments", "Practical"],
      isEnrolled: false,
      isFavorite: true,
      semester: "Fall",
      academicYear: "2024"
    },
    {
      id: 4,
      title: "Database Systems",
      code: "CS301",
      description: "Design and implementation of database systems, SQL, and database management.",
      department: "Computer Science",
      credits: 3,
      level: "300",
      instructor: "Dr. James Wilson",
      enrollmentCount: 32,
      maxEnrollment: 40,
      rating: 4.3,
      difficulty: "Intermediate",
      prerequisites: ["CS201"],
      schedule: {
        days: ["Monday", "Wednesday"],
        time: "11:00 AM - 12:30 PM",
        location: "Room 301, CS Building"
      },
      tags: ["Database", "SQL", "Systems"],
      isEnrolled: false,
      isFavorite: false,
      semester: "Fall",
      academicYear: "2024"
    }
  ];

  const { data: courses = mockCourses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: () => mockCourses, // Replace with actual API call
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

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (courseId: number) => {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Success",
        description: "Favorites updated",
      });
    },
  });

  const handleEnroll = (courseId: number) => {
    enrollMutation.mutate(courseId);
  };

  const handleToggleFavorite = (courseId: number) => {
    toggleFavoriteMutation.mutate(courseId);
  };

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDepartment = !selectedDepartment || course.department === selectedDepartment;
      const matchesLevel = !selectedLevel || course.level === selectedLevel;
      const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
      const matchesCredits = !selectedCredits || course.credits.toString() === selectedCredits;
      const matchesTab = activeTab === "all" || 
                        (activeTab === "enrolled" && course.isEnrolled) ||
                        (activeTab === "favorites" && course.isFavorite) ||
                        (activeTab === "available" && !course.isEnrolled);
      
      return matchesSearch && matchesDepartment && matchesLevel && matchesDifficulty && matchesCredits && matchesTab;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          comparison = b.rating - a.rating;
          break;
        case "enrollment":
          comparison = b.enrollmentCount - a.enrollmentCount;
          break;
        case "credits":
          comparison = a.credits - b.credits;
          break;
        case "level":
          comparison = a.level.localeCompare(b.level);
          break;
        default:
          comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const departments = [...new Set(courses.map(course => course.department))];
  const levels = [...new Set(courses.map(course => course.level))];
  const difficulties = [...new Set(courses.map(course => course.difficulty))];
  const creditOptions = [...new Set(courses.map(course => course.credits.toString()))];

  const enrolledCount = courses.filter(c => c.isEnrolled).length;
  const favoritesCount = courses.filter(c => c.isFavorite).length;
  const availableCount = courses.filter(c => !c.isEnrolled).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="mr-3 h-8 w-8" />
                Course Catalog
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover and enroll in courses to advance your academic journey
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4 mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
              {(user?.role === 'lecturer' || user?.role === 'admin') && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <BookMarked className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{enrolledCount}</p>
                    <p className="text-sm text-gray-600">Enrolled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{favoritesCount}</p>
                    <p className="text-sm text-gray-600">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Courses
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by title, code, instructor, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}-Level</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <Select value={selectedCredits} onValueChange={setSelectedCredits}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Credits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Credits</SelectItem>
                      {creditOptions.sort().map((credits) => (
                        <SelectItem key={credits} value={credits}>{credits} Credits</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="enrollment">Popularity</SelectItem>
                      <SelectItem value="credits">Credits</SelectItem>
                      <SelectItem value="level">Level</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Courses ({courses.length})</TabsTrigger>
              <TabsTrigger value="available">Available ({availableCount})</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled ({enrolledCount})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favoritesCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Course Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredAndSortedCourses.length > 0 ? (
                  filteredAndSortedCourses.map((course) => (
                    <Card 
                      key={course.id} 
                      className={`hover:shadow-lg transition-all duration-200 ${
                        course.isEnrolled ? 'ring-2 ring-green-200' : ''
                      } ${viewMode === "list" ? 'flex' : ''}`}
                    >
                      <CardHeader className={viewMode === "list" ? 'flex-1' : ''}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{course.department}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFavorite(course.id)}
                              className="p-1"
                            >
                              <Heart className={`h-4 w-4 ${course.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{course.code} • {course.credits} Credits</p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(course.rating)}
                              <span className="ml-1 text-sm text-gray-600">({course.rating})</span>
                            </div>
                            <Badge className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className={viewMode === "list" ? 'flex-1' : ''}>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{course.instructor}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{course.schedule.days.join(", ")} • {course.schedule.time}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{course.schedule.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.enrollmentCount}/{course.maxEnrollment}
                            </span>
                            {course.isEnrolled && (
                              <Badge className="bg-green-100 text-green-800">Enrolled</Badge>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {user?.role === 'student' && !course.isEnrolled && (
                            <Button 
                              className="flex-1"
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrollMutation.isPending || course.enrollmentCount >= course.maxEnrollment}
                            >
                              {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
                            </Button>
                          )}
                          
                          {course.isEnrolled && (
                            <Button variant="outline" className="flex-1">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Open Course
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setSelectedCourse(course)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{course.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Course Details</h4>
                                  <p className="text-gray-600">{course.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Prerequisites</h4>
                                    {course.prerequisites.length > 0 ? (
                                      <ul className="text-sm text-gray-600">
                                        {course.prerequisites.map((prereq) => (
                                          <li key={prereq}>• {prereq}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-gray-600">None</p>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Schedule</h4>
                                    <div className="text-sm text-gray-600">
                                      <p>{course.schedule.days.join(", ")}</p>
                                      <p>{course.schedule.time}</p>
                                      <p>{course.schedule.location}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
