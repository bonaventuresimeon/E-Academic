import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Activity,
  FileText,
  Users,
  Globe,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Check,
  AlertTriangle,
  Info,
  ChevronRight,
  Plus,
  Minus,
  Toggle,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Languages,
  Database,
  HardDrive,
  Wifi,
  Battery,
  Cpu
} from "lucide-react";

interface AdvancedUserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

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
  lastActive?: Date;
  settings?: UserSettings;
  stats?: UserStats;
  activity?: ActivityItem[];
  devices?: DeviceInfo[];
  notifications?: NotificationSettings;
  privacy?: PrivacySettings;
  security?: SecuritySettings;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  showOnlineStatus: boolean;
  compactMode: boolean;
}

interface UserStats {
  coursesCompleted: number;
  totalCourses: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageGrade: number;
  studyHours: number;
  streakDays: number;
  achievements: number;
}

interface ActivityItem {
  id: string;
  type: 'login' | 'course' | 'assignment' | 'achievement' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastActive: Date;
  isCurrentDevice: boolean;
  location?: string;
}

interface NotificationSettings {
  email: {
    courseUpdates: boolean;
    assignmentReminders: boolean;
    gradeNotifications: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };
  push: {
    immediateAlerts: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  inApp: {
    sounds: boolean;
    desktop: boolean;
    frequency: 'all' | 'important' | 'none';
  };
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLastActive: boolean;
  allowMessages: boolean;
  shareProgress: boolean;
  dataCollection: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  allowMultipleSessions: boolean;
  trustedDevices: string[];
  lastPasswordChange: Date;
}

export function AdvancedUserProfilePanel({ isOpen, onClose, user }: AdvancedUserProfilePanelProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch extended user profile data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/user/profile-extended'],
    enabled: isOpen && !!user,
  });

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: isOpen && !!user,
  });

  // Fetch user activity
  const { data: userActivity } = useQuery({
    queryKey: ['/api/user/activity'],
    enabled: isOpen && !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/user/profile', 'PATCH', data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile-extended'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/user/settings', 'PATCH', data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile-extended'] });
    },
  });

  // Upload profile image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiRequest('/api/user/profile-image', 'POST', formData);
    },
    onSuccess: (data) => {
      setProfileImage(data.imageUrl);
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile-extended'] });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadImageMutation.mutate(file);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    const newSettings = {
      ...userProfile?.settings,
      [category]: {
        ...userProfile?.settings?.[category],
        [setting]: value
      }
    };
    updateSettingsMutation.mutate({ settings: newSettings });
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'devices', label: 'Devices', icon: Monitor },
    { id: 'data', label: 'Data', icon: Database }
  ];

  if (!isOpen) return null;

  return (
    <div className="profile-panel-overlay">
      <div className="profile-panel-container">
        {/* Header */}
        <div className="panel-header">
          <div className="header-content">
            <div className="user-avatar-large">
              {profileImage || user?.profileImage ? (
                <img src={profileImage || user.profileImage} alt="Profile" />
              ) : (
                <span>{user?.firstName?.charAt(0) || 'U'}</span>
              )}
              <div className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="upload-input"
                  id="profile-image-upload"
                />
                <label htmlFor="profile-image-upload" className="upload-btn">
                  <Camera className="h-4 w-4" />
                </label>
              </div>
            </div>
            <div className="user-info">
              <h2 className="user-name">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="user-role">{user?.role}</p>
              <p className="user-email">{user?.email}</p>
              {userProfile?.lastActive && (
                <p className="user-activity">
                  Last active {formatLastActive(userProfile.lastActive)}
                </p>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="panel-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="panel-content">
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="section-header">
                <h3>Personal Information</h3>
                <button
                  className="edit-btn"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                      setEditData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        email: user?.email || '',
                        phoneNumber: user?.phoneNumber || '',
                      });
                    }
                  }}
                  disabled={updateProfileMutation.isPending}
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    <span>{user?.firstName || 'Not set'}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    <span>{user?.lastName || 'Not set'}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    <span>{user?.email}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phoneNumber}
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    <span>{user?.phoneNumber || 'Not set'}</span>
                  )}
                </div>

                <div className="info-item">
                  <label>Role</label>
                  <span className="role-badge">{user?.role}</span>
                </div>

                <div className="info-item">
                  <label>Member Since</label>
                  <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Statistics */}
              {userStats && (
                <div className="stats-section">
                  <h3>Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <BookOpen className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.coursesCompleted}/{userStats.totalCourses}</span>
                        <span className="stat-label">Courses Completed</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <FileText className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.assignmentsSubmitted}/{userStats.totalAssignments}</span>
                        <span className="stat-label">Assignments</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <BarChart3 className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.averageGrade}%</span>
                        <span className="stat-label">Average Grade</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <Clock className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.studyHours}h</span>
                        <span className="stat-label">Study Time</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <Target className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.streakDays} days</span>
                        <span className="stat-label">Current Streak</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <Award className="stat-icon" />
                      <div className="stat-content">
                        <span className="stat-value">{userStats.achievements}</span>
                        <span className="stat-label">Achievements</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-content">
              <div className="section-header">
                <h3>Recent Activity</h3>
                <button className="refresh-btn">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="activity-timeline">
                {userActivity?.map((activity: ActivityItem) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'login' && <User className="h-4 w-4" />}
                      {activity.type === 'course' && <BookOpen className="h-4 w-4" />}
                      {activity.type === 'assignment' && <FileText className="h-4 w-4" />}
                      {activity.type === 'achievement' && <Award className="h-4 w-4" />}
                      {activity.type === 'message' && <Mail className="h-4 w-4" />}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-description">{activity.description}</p>
                      <span className="activity-time">
                        {formatLastActive(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Theme</label>
                    <span>Choose your preferred theme</span>
                  </div>
                  <select 
                    value={userProfile?.settings?.theme || 'system'}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="setting-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Language</label>
                    <span>Select your preferred language</span>
                  </div>
                  <select 
                    value={userProfile?.settings?.language || 'en'}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Compact Mode</label>
                    <span>Use less space in the interface</span>
                  </div>
                  <button
                    className={`toggle-btn ${userProfile?.settings?.compactMode ? 'active' : ''}`}
                    onClick={() => handleSettingChange('appearance', 'compactMode', !userProfile?.settings?.compactMode)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Behavior</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto Save</label>
                    <span>Automatically save your work</span>
                  </div>
                  <button
                    className={`toggle-btn ${userProfile?.settings?.autoSave ? 'active' : ''}`}
                    onClick={() => handleSettingChange('behavior', 'autoSave', !userProfile?.settings?.autoSave)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Sound Effects</label>
                    <span>Play sounds for notifications and actions</span>
                  </div>
                  <button
                    className={`toggle-btn ${userProfile?.settings?.soundEnabled ? 'active' : ''}`}
                    onClick={() => handleSettingChange('behavior', 'soundEnabled', !userProfile?.settings?.soundEnabled)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Show Online Status</label>
                    <span>Let others see when you're active</span>
                  </div>
                  <button
                    className={`toggle-btn ${userProfile?.settings?.showOnlineStatus ? 'active' : ''}`}
                    onClick={() => handleSettingChange('behavior', 'showOnlineStatus', !userProfile?.settings?.showOnlineStatus)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add other tab content sections here */}
        </div>
      </div>

      <style>{`
        .profile-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .profile-panel-container {
          width: 100%;
          max-width: 64rem;
          max-height: 90vh;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .header-content {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .user-avatar-large {
          position: relative;
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .user-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-avatar-large span {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .avatar-upload {
          position: absolute;
          bottom: -0.25rem;
          right: -0.25rem;
        }

        .upload-input {
          display: none;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .user-role {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0 0 0.5rem 0;
          text-transform: capitalize;
        }

        .user-email {
          font-size: 0.875rem;
          opacity: 0.8;
          margin: 0 0 0.25rem 0;
        }

        .user-activity {
          font-size: 0.75rem;
          opacity: 0.7;
          margin: 0;
        }

        .close-btn {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 0.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .panel-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: #475569;
          background: #f1f5f9;
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
          background: white;
        }

        .tab-icon {
          width: 1rem;
          height: 1rem;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .edit-btn, .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn:hover, .refresh-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .edit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .info-item span {
          font-size: 0.875rem;
          color: #6b7280;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .edit-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #1f2937;
          transition: all 0.2s ease;
        }

        .edit-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          background: #dbeafe;
          color: #1d4ed8;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .stats-section {
          margin-top: 2rem;
        }

        .stats-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }

        .activity-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .activity-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .setting-info {
          flex: 1;
        }

        .setting-info label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .setting-info span {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .setting-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #1f2937;
          background: white;
          cursor: pointer;
        }

        .toggle-btn {
          position: relative;
          width: 3rem;
          height: 1.5rem;
          background: #e5e7eb;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: #3b82f6;
        }

        .toggle-slider {
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          background: white;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .toggle-btn.active .toggle-slider {
          transform: translateX(1.5rem);
        }

        @media (max-width: 768px) {
          .profile-panel-overlay {
            padding: 1rem;
          }

          .panel-header {
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }

          .panel-content {
            padding: 1.5rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tab-label {
            display: none;
          }

          .tab-btn {
            padding: 1rem;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}