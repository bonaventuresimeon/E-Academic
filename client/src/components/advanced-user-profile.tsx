import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Shield, 
  Activity, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Award,
  BookOpen,
  Clock,
  TrendingUp
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  profileImage?: string;
  createdAt: Date;
}

interface AdvancedUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}

export function AdvancedUserProfile({ isOpen, onClose, user }: AdvancedUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });

  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ['/api/user/preferences'],
    enabled: isOpen
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    enabled: isOpen
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/activity/recent'],
    enabled: isOpen
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsEditing(false);
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Profile Panel */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-50/95 via-white/95 to-blue-50/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-blue-950/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-b border-white/20 dark:border-slate-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-white/30 dark:ring-slate-600/30">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-white/90 dark:bg-slate-800/90 shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username || 'User'}
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {user?.role || 'Student'}
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                @{user?.username} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>
              
              {/* Quick Stats */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {stats?.totalCourses || 0}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {stats?.totalSubmissions || 0}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {stats?.averageGrade?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Avg Grade</div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <ScrollArea className="h-[60vh]">
          <div className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={editData.firstName}
                            onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                            {user?.firstName || 'Not set'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={editData.lastName}
                            onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                            {user?.lastName || 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md flex-1">
                            {user?.email}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editData.phoneNumber}
                            onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md flex-1">
                            {user?.phoneNumber || 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Performance Card */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
                        <Award className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                        <div className="font-bold text-lg">{stats?.completionRate?.toFixed(0) || 0}%</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                        <div className="font-bold text-lg">{stats?.totalAssignments || 0}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Assignments</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 rounded-lg">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                        <div className="font-bold text-lg">{stats?.upcomingDeadlines || 0}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Upcoming</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity?.map((activity: any) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</div>
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-slate-500">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
                      </div>
                      <Switch defaultChecked={preferences?.notifications?.email} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Desktop Notifications</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Show desktop notifications</p>
                      </div>
                      <Switch defaultChecked={preferences?.notifications?.desktop} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Activity</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Make your activity visible to others</p>
                      </div>
                      <Switch defaultChecked={preferences?.privacy?.showActivity} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Update your account password</div>
                      </div>
                      <Button variant="outline">
                        Change
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</div>
                      </div>
                      <Button variant="outline">
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium">Login Sessions</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Manage your active sessions</div>
                      </div>
                      <Button variant="outline">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}