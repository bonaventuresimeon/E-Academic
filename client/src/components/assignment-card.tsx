import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  Star,
  AlertCircle,
  CheckCircle,
  Weight,
  Eye,
} from "lucide-react";
import { Assignment, Submission } from "@shared/schema";

interface AssignmentCardProps {
  assignment: Assignment & {
    courseTitle?: string;
    instructorName?: string;
    submission?: Submission;
    timeRemaining?: {
      days: number;
      hours: number;
      isOverdue: boolean;
    };
  };
  onSubmit?: (assignmentId: number) => void;
  onView?: (assignmentId: number) => void;
  onGrade?: (assignmentId: number) => void;
  userRole?: string;
  isLoading?: boolean;
}

export default function AssignmentCard({
  assignment,
  onSubmit,
  onView,
  onGrade,
  userRole = "student",
  isLoading = false,
}: AssignmentCardProps) {
  const getStatusBadge = () => {
    if (assignment.submission?.grade) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Star className="w-3 h-3 mr-1" />
          Graded
        </Badge>
      );
    }
    
    if (assignment.submission) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Submitted
        </Badge>
      );
    }
    
    if (assignment.timeRemaining?.isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    
    if (assignment.timeRemaining && assignment.timeRemaining.days <= 3) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Due Soon
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        <FileText className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getStatusIcon = () => {
    if (assignment.submission?.grade) return <Star className="w-4 h-4 text-green-600" />;
    if (assignment.submission) return <CheckCircle className="w-4 h-4 text-blue-600" />;
    if (assignment.timeRemaining?.isOverdue) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-orange-600" />;
  };

  const getPriorityLevel = () => {
    if (assignment.timeRemaining?.isOverdue) return "high";
    if (assignment.timeRemaining && assignment.timeRemaining.days <= 1) return "high";
    if (assignment.timeRemaining && assignment.timeRemaining.days <= 3) return "medium";
    return "low";
  };

  const getProgressPercentage = () => {
    if (assignment.submission?.grade) return 100;
    if (assignment.submission) return 75;
    if (assignment.timeRemaining?.isOverdue) return 0;
    
    // Calculate progress based on time remaining
    const totalTime = 14; // Assume 2 weeks total time
    const remaining = assignment.timeRemaining?.days || 0;
    return Math.max(0, Math.min(100, ((totalTime - remaining) / totalTime) * 50));
  };

  const formatTimeRemaining = () => {
    if (!assignment.timeRemaining) return null;
    
    const { days, hours, isOverdue } = assignment.timeRemaining;
    
    if (isOverdue) {
      return <span className="text-red-600 font-medium">Overdue</span>;
    }
    
    if (days === 0) {
      return <span className="text-orange-600 font-medium">Due in {hours}h</span>;
    }
    
    if (days === 1) {
      return <span className="text-orange-600 font-medium">Due tomorrow</span>;
    }
    
    return <span className="text-gray-600">Due in {days} days</span>;
  };

  const priorityLevel = getPriorityLevel();
  const progress = getProgressPercentage();

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${
      priorityLevel === "high" ? "border-l-4 border-l-red-500" :
      priorityLevel === "medium" ? "border-l-4 border-l-yellow-500" :
      "border-l-4 border-l-gray-200"
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {assignment.title}
                </h3>
              </div>
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-medium">{assignment.courseTitle}</span>
              {assignment.instructorName && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{assignment.instructorName}</span>
                </>
              )}
            </div>
            
            {assignment.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {assignment.description}
              </p>
            )}
          </div>
          
          {assignment.submission?.grade && (
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold text-green-600">
                {assignment.submission.grade}%
              </div>
              <div className="text-xs text-gray-500">Grade</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Assignment Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {assignment.submission ? "Submitted" : "Due"}: {" "}
              {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Weight className="w-4 h-4" />
            <span>Weight: {assignment.weight}%</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{assignment.fileRequired ? "File required" : "Text submission"}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTimeRemaining() || (
              <span>Max points: {assignment.maxPoints}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {userRole === "student" && !assignment.submission && (
            <Button
              className={`flex-1 ${
                assignment.timeRemaining?.isOverdue
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              onClick={() => onSubmit?.(assignment.id)}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading
                ? "Submitting..."
                : assignment.timeRemaining?.isOverdue
                ? "Submit Late"
                : "Submit Assignment"}
            </Button>
          )}
          
          {userRole === "student" && assignment.submission && !assignment.submission.grade && (
            <Button variant="outline" className="flex-1" disabled>
              <Clock className="w-4 h-4 mr-2" />
              Awaiting Grade
            </Button>
          )}
          
          {userRole === "student" && assignment.submission?.grade && (
            <Button variant="outline" className="flex-1" onClick={() => onView?.(assignment.id)}>
              <Eye className="w-4 h-4 mr-2" />
              View Feedback
            </Button>
          )}
          
          {(userRole === "lecturer" || userRole === "admin") && (
            <>
              <Button
                className="flex-1"
                onClick={() => onGrade?.(assignment.id)}
                disabled={isLoading}
              >
                <Star className="w-4 h-4 mr-2" />
                Grade Submissions
              </Button>
              <Button
                variant="outline"
                onClick={() => onView?.(assignment.id)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {userRole === "student" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(assignment.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              View Details
            </Button>
          )}
        </div>

        {/* Submission Info */}
        {assignment.submission && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Submitted: {new Date(assignment.submission.submittedAt).toLocaleDateString()}
              </span>
              {assignment.submission.gradedAt && (
                <span>
                  Graded: {new Date(assignment.submission.gradedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {assignment.submission.feedback && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong className="text-gray-700">Feedback:</strong>
                <p className="text-gray-600 mt-1">{assignment.submission.feedback}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
