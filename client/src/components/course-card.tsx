import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Clock, Star, Eye, UserPlus } from "lucide-react";
import { Course, User } from "@shared/schema";

interface CourseCardProps {
  course: Course & {
    lecturer?: Partial<User>;
    enrollmentCount?: number;
    maxEnrollment?: number;
    isEnrolled?: boolean;
    userRole?: string;
  };
  onEnroll?: (courseId: number) => void;
  onView?: (courseId: number) => void;
  onManage?: (courseId: number) => void;
  isLoading?: boolean;
}

export default function CourseCard({
  course,
  onEnroll,
  onView,
  onManage,
  isLoading = false,
}: CourseCardProps) {
  const getDepartmentColor = (department: string) => {
    const colors = {
      "Computer Science": "bg-blue-100 text-blue-800",
      "Mathematics": "bg-green-100 text-green-800",
      "Physics": "bg-purple-100 text-purple-800",
      "Engineering": "bg-orange-100 text-orange-800",
      "Biology": "bg-emerald-100 text-emerald-800",
      "Chemistry": "bg-red-100 text-red-800",
    };
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Computer Science":
        return "💻";
      case "Mathematics":
        return "📊";
      case "Physics":
        return "⚛️";
      case "Engineering":
        return "⚙️";
      case "Biology":
        return "🧬";
      case "Chemistry":
        return "🧪";
      default:
        return "📚";
    }
  };

  const getEnrollmentStatus = () => {
    const enrolled = course.enrollmentCount || 0;
    const max = course.maxEnrollment || 50;
    const percentage = (enrolled / max) * 100;

    if (percentage >= 90) return { status: "Almost Full", color: "text-red-600" };
    if (percentage >= 70) return { status: "Filling Up", color: "text-orange-600" };
    return { status: "Available", color: "text-green-600" };
  };

  const enrollmentStatus = getEnrollmentStatus();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center text-lg">
              {getDepartmentIcon(course.department)}
            </div>
            <Badge className={getDepartmentColor(course.department)}>
              {course.department.split(" ")[0]}
            </Badge>
          </div>
          {course.isEnrolled && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              <UserPlus className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-gray-600">{course.code}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{course.credits} Credits</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {course.description || "Course description not available."}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {course.lecturer && (
            <div className="flex items-center gap-1">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs bg-gray-100">
                  {course.lecturer.firstName?.[0]}{course.lecturer.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-20">
                Prof. {course.lecturer.lastName}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {course.enrollmentCount || 0}/{course.maxEnrollment || 50}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 ${enrollmentStatus.color}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            <span className="text-xs font-medium">{enrollmentStatus.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {course.userRole === "student" && !course.isEnrolled && (
            <Button
              className="flex-1"
              onClick={() => onEnroll?.(course.id)}
              disabled={isLoading || (course.enrollmentCount || 0) >= (course.maxEnrollment || 50)}
            >
              {isLoading ? "Enrolling..." : "Enroll"}
            </Button>
          )}
          
          {course.userRole === "student" && course.isEnrolled && (
            <Button variant="outline" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Open Course
            </Button>
          )}
          
          {(course.userRole === "lecturer" || course.userRole === "admin") && (
            <Button
              className="flex-1"
              onClick={() => onManage?.(course.id)}
            >
              Manage Course
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView?.(course.id)}
            className="shrink-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Additional Info for Lecturers/Admins */}
        {(course.userRole === "lecturer" || course.userRole === "admin") && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Created {new Date(course.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {course.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
