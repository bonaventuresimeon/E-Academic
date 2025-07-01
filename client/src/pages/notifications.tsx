
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellRing, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Star, 
  Trash2, 
  UserPlus,
  AlertTriangle,
  Info,
  MessageSquare
} from "lucide-react";
import Header from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'enrollment' | 'announcement' | 'deadline' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  course?: {
    id: number;
    title: string;
    code: string;
  };
  actionUrl?: string;
}

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with actual API calls
  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Physics Lab Report due in 3 days",
      type: "assignment",
      priority: "high",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      course: { id: 1, title: "Physics 101", code: "PHYS101" },
      actionUrl: "/assignments/1"
    },
    {
      id: 2,
      title: "Grade Published",
      message: "Your grade for Mathematics Quiz is now available",
      type: "grade",
      priority: "medium",
      isRead: false,
      createdAt: "2024-01-15T09:15:00Z",
      course: { id: 2, title: "Mathematics 201", code: "MATH201" }
    },
    {
      id: 3,
      title: "Enrollment Approved",
      message: "Your enrollment in Computer Science 301 has been approved",
      type: "enrollment",
      priority: "medium",
      isRead: true,
      createdAt: "2024-01-14T16:45:00Z",
      course: { id: 3, title: "Computer Science 301", code: "CS301" }
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday 2 AM - 4 AM",
      type: "system",
      priority: "low",
      isRead: false,
      createdAt: "2024-01-14T14:20:00Z"
    },
    {
      id: 5,
      title: "Assignment Deadline Reminder",
      message: "Chemistry Lab Report due tomorrow",
      type: "deadline",
      priority: "urgent",
      isRead: false,
      createdAt: "2024-01-14T12:00:00Z",
      course: { id: 4, title: "Chemistry 201", code: "CHEM201" }
    }
  ];

  const { data: notifications = mockNotifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: () => mockNotifications, // Replace with actual API call
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
  });

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || notification.type === selectedType;
    const matchesPriority = selectedPriority === "all" || notification.priority === selectedPriority;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "unread" && !notification.isRead) ||
                      (activeTab === "read" && notification.isRead);
    
    return matchesSearch && matchesType && matchesPriority && matchesTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const priorityCount = notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return BookOpen;
      case 'grade':
        return Star;
      case 'enrollment':
        return UserPlus;
      case 'announcement':
        return MessageSquare;
      case 'deadline':
        return Clock;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
                <BellRing className="mr-3 h-8 w-8" />
                Notifications
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Stay updated with your academic activities
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-sm text-gray-600">Total Notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <BellRing className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                    <p className="text-sm text-gray-600">Unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{priorityCount}</p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Notifications
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="grade">Grade</SelectItem>
                      <SelectItem value="enrollment">Enrollment</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    {filteredNotifications.length > 0 ? (
                      <div className="space-y-4">
                        {filteredNotifications.map((notification) => {
                          const IconComponent = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                                notification.isRead 
                                  ? 'bg-gray-50 border-gray-200' 
                                  : 'bg-white border-blue-200 shadow-sm'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                                }`}>
                                  <IconComponent className={`h-5 w-5 ${
                                    notification.isRead ? 'text-gray-600' : 'text-blue-600'
                                  }`} />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`text-sm font-medium ${
                                    notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(notification.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                
                                <p className={`text-sm ${
                                  notification.isRead ? 'text-gray-500' : 'text-gray-700'
                                }`}>
                                  {notification.message}
                                </p>
                                
                                {notification.course && (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {notification.course.code} - {notification.course.title}
                                    </Badge>
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-2 mt-3">
                                  {!notification.isRead && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => markAsReadMutation.mutate(notification.id)}
                                      disabled={markAsReadMutation.isPending}
                                    >
                                      Mark as Read
                                    </Button>
                                  )}
                                  
                                  {notification.actionUrl && (
                                    <Button size="sm" variant="outline">
                                      View Details
                                    </Button>
                                  )}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                    disabled={deleteNotificationMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {activeTab === 'unread' 
                            ? "You're all caught up! No unread notifications." 
                            : "Try adjusting your search or filter criteria."
                          }
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
