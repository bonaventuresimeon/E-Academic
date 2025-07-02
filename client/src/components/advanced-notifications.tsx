import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  Mail,
  MessageSquare,
  Calendar,
  BookOpen,
  FileText,
  Award,
  Users,
  Settings,
  Trash2,
  Archive,
  Star,
  Clock,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  TrendingUp,
  Activity,
  Shield,
  Download,
  Upload,
  RefreshCw,
  SortAsc,
  SortDesc,
  Grid,
  List,
  CheckCircle,
  AlertCircle,
  InfoIcon,
  XCircle,
  Plus,
  Minus
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'assignment' | 'course' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  metadata?: any;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  soundEnabled: boolean;
  categories: {
    [key: string]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      sound: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface AdvancedNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export function AdvancedNotifications({ isOpen, onClose, user }: AdvancedNotificationsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCompactMode, setIsCompactMode] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isOpen,
  });

  // Fetch notification settings
  const { data: settings } = useQuery({
    queryKey: ['/api/notifications/settings'],
    enabled: isOpen,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      return apiRequest('/api/notifications/mark-read', 'POST', { ids: notificationIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Archive notifications mutation
  const archiveMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      return apiRequest('/api/notifications/archive', 'POST', { ids: notificationIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setSelectedNotifications(new Set());
    },
  });

  // Delete notifications mutation
  const deleteMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      return apiRequest('/api/notifications/delete', 'DELETE', { ids: notificationIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      setSelectedNotifications(new Set());
    },
  });

  // Star/unstar notification mutation
  const starMutation = useMutation({
    mutationFn: async ({ id, starred }: { id: string; starred: boolean }) => {
      return apiRequest(`/api/notifications/${id}/star`, 'PATCH', { starred });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      return apiRequest('/api/notifications/settings', 'PATCH', newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/settings'] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'message': return MessageSquare;
      case 'assignment': return FileText;
      case 'course': return BookOpen;
      case 'system': return Settings;
      default: return InfoIcon;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'message': return '#3b82f6';
      case 'assignment': return '#8b5cf6';
      case 'course': return '#06b6d4';
      case 'system': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const filteredNotifications = notifications
    .filter((notification: NotificationItem) => {
      if (activeTab === 'unread' && notification.isRead) return false;
      if (activeTab === 'starred' && !notification.isStarred) return false;
      if (activeTab === 'archived' && !notification.isArchived) return false;
      if (activeTab === 'all' && notification.isArchived) return false;
      
      if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && notification.category !== filterCategory) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query) ||
          notification.sender?.name.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a: NotificationItem, b: NotificationItem) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const unreadCount = notifications.filter((n: NotificationItem) => !n.isRead && !n.isArchived).length;
  const starredCount = notifications.filter((n: NotificationItem) => n.isStarred && !n.isArchived).length;

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map((n: NotificationItem) => n.id)));
    }
  };

  const handleMarkAsRead = (ids?: string[]) => {
    const notificationIds = ids || Array.from(selectedNotifications);
    markAsReadMutation.mutate(notificationIds);
    if (!ids) setSelectedNotifications(new Set());
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-overlay">
      <div className="notifications-panel">
        {/* Header */}
        <div className="panel-header">
          <div className="header-left">
            <Bell className="h-6 w-6" />
            <div className="header-title">
              <h2>Notifications</h2>
              <span className="notification-count">{unreadCount} unread</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="action-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button className="action-btn" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="notification-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
            <span className="tab-count">{notifications.filter((n: NotificationItem) => !n.isArchived).length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            <span className="tab-count">{unreadCount}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveTab('starred')}
          >
            Starred
            <span className="tab-count">{starredCount}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
          </button>
        </div>

        {/* Controls */}
        <div className="notification-controls">
          <div className="controls-left">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="course">Courses</option>
              <option value="assignment">Assignments</option>
              <option value="message">Messages</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="controls-right">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </button>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as any);
                setSortOrder(order as any);
              }}
              className="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority-desc">High Priority</option>
              <option value="category-asc">Category A-Z</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedNotifications.size} selected
            </span>
            <div className="bulk-buttons">
              <button
                className="bulk-btn"
                onClick={() => handleMarkAsRead()}
              >
                <Check className="h-4 w-4" />
                Mark Read
              </button>
              <button
                className="bulk-btn"
                onClick={() => archiveMutation.mutate(Array.from(selectedNotifications))}
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button
                className="bulk-btn danger"
                onClick={() => deleteMutation.mutate(Array.from(selectedNotifications))}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h3>Notification Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Email Notifications</label>
                <button
                  className={`toggle-btn ${settings?.emailNotifications ? 'active' : ''}`}
                  onClick={() => updateSettingsMutation.mutate({ 
                    emailNotifications: !settings?.emailNotifications 
                  })}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="setting-item">
                <label>Push Notifications</label>
                <button
                  className={`toggle-btn ${settings?.pushNotifications ? 'active' : ''}`}
                  onClick={() => updateSettingsMutation.mutate({ 
                    pushNotifications: !settings?.pushNotifications 
                  })}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="setting-item">
                <label>Sound Effects</label>
                <button
                  className={`toggle-btn ${settings?.soundEnabled ? 'active' : ''}`}
                  onClick={() => updateSettingsMutation.mutate({ 
                    soundEnabled: !settings?.soundEnabled 
                  })}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="setting-item">
                <label>Notification Frequency</label>
                <select
                  value={settings?.frequency || 'immediate'}
                  onChange={(e) => updateSettingsMutation.mutate({ frequency: e.target.value as any })}
                  className="setting-select"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className={`notifications-content ${viewMode} ${isCompactMode ? 'compact' : ''}`}>
          {isLoading ? (
            <div className="loading-state">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span>Loading notifications...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell className="h-12 w-12" />
              <h3>No notifications</h3>
              <p>You're all caught up! Check back later for new notifications.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {/* Select All */}
              <div className="select-all-row">
                <input
                  type="checkbox"
                  checked={selectedNotifications.size === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="select-checkbox"
                />
                <span>Select all visible notifications</span>
              </div>

              {filteredNotifications.map((notification: NotificationItem) => {
                const IconComponent = getNotificationIcon(notification.type);
                const isSelected = selectedNotifications.has(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="notification-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newSelected = new Set(selectedNotifications);
                          if (e.target.checked) {
                            newSelected.add(notification.id);
                          } else {
                            newSelected.delete(notification.id);
                          }
                          setSelectedNotifications(newSelected);
                        }}
                        className="select-checkbox"
                      />
                    </div>

                    <div 
                      className="notification-icon"
                      style={{ color: getTypeColor(notification.type) }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">{notification.title}</h4>
                        <div className="notification-meta">
                          <span 
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(notification.priority) }}
                          >
                            {notification.priority}
                          </span>
                          <span className="notification-time">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      <p className="notification-message">{notification.message}</p>

                      {notification.sender && (
                        <div className="notification-sender">
                          <div className="sender-avatar">
                            {notification.sender.avatar ? (
                              <img src={notification.sender.avatar} alt="" />
                            ) : (
                              notification.sender.name.charAt(0)
                            )}
                          </div>
                          <span className="sender-name">{notification.sender.name}</span>
                          <span className="sender-role">{notification.sender.role}</span>
                        </div>
                      )}

                      {notification.actionUrl && (
                        <div className="notification-actions">
                          <button className="action-link">
                            {notification.actionLabel || 'View Details'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="notification-controls">
                      <button
                        className="control-btn"
                        onClick={() => starMutation.mutate({ 
                          id: notification.id, 
                          starred: !notification.isStarred 
                        })}
                      >
                        <Star className={`h-4 w-4 ${notification.isStarred ? 'filled' : ''}`} />
                      </button>

                      {!notification.isRead && (
                        <button
                          className="control-btn"
                          onClick={() => handleMarkAsRead([notification.id])}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        className="control-btn"
                        onClick={() => archiveMutation.mutate([notification.id])}
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notifications-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .notifications-panel {
          width: 100%;
          max-width: 48rem;
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
          align-items: center;
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .notification-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .notification-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: #374151;
          background: #f1f5f9;
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
          background: white;
        }

        .tab-count {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          background: #e5e7eb;
          color: #6b7280;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .tab-btn.active .tab-count {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .notification-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .controls-left {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .controls-right {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          width: 1rem;
          height: 1rem;
          color: #9ca3af;
        }

        .search-input {
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #1f2937;
          background: white;
          width: 16rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-select, .sort-select, .setting-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #1f2937;
          background: white;
          cursor: pointer;
        }

        .view-btn {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .view-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: #dbeafe;
          border-bottom: 1px solid #bfdbfe;
        }

        .selected-count {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1d4ed8;
        }

        .bulk-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .bulk-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bulk-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .bulk-btn.danger {
          color: #dc2626;
          border-color: #fecaca;
        }

        .bulk-btn.danger:hover {
          background: #fef2f2;
          border-color: #fca5a5;
        }

        .settings-panel {
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .settings-panel h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .setting-item label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .toggle-btn {
          position: relative;
          width: 2.5rem;
          height: 1.25rem;
          background: #e5e7eb;
          border: none;
          border-radius: 0.625rem;
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
          width: 1rem;
          height: 1rem;
          background: white;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .toggle-btn.active .toggle-slider {
          transform: translateX(1.25rem);
        }

        .notifications-content {
          flex: 1;
          overflow-y: auto;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .loading-state span, .empty-state h3 {
          margin-top: 1rem;
          font-size: 1.125rem;
          font-weight: 500;
          color: #374151;
        }

        .empty-state p {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
        }

        .select-all-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item.unread {
          background: #fefcbf;
          border-left: 3px solid #f59e0b;
        }

        .notification-item.selected {
          background: #dbeafe;
          border-left: 3px solid #3b82f6;
        }

        .notification-checkbox {
          display: flex;
          align-items: center;
          margin-top: 0.25rem;
        }

        .select-checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: #3b82f6;
          cursor: pointer;
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .notification-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.25;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .priority-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #9ca3af;
          white-space: nowrap;
        }

        .notification-message {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 0.75rem 0;
        }

        .notification-sender {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .sender-avatar {
          width: 1.5rem;
          height: 1.5rem;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
        }

        .sender-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .sender-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }

        .sender-role {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .notification-actions {
          margin-top: 0.5rem;
        }

        .action-link {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-link:hover {
          background: #1d4ed8;
        }

        .notification-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .control-btn {
          padding: 0.375rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .control-btn .filled {
          color: #f59e0b;
        }

        .notifications-content.compact .notification-item {
          padding: 0.75rem 1.5rem;
        }

        .notifications-content.compact .notification-message {
          font-size: 0.75rem;
        }

        .notifications-content.grid .notifications-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }

        .notifications-content.grid .notification-item {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .notifications-overlay {
            padding: 1rem;
          }

          .controls-left {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .controls-right {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-input {
            width: 100%;
          }

          .notification-meta {
            flex-direction: column;
            align-items: flex-end;
            gap: 0.25rem;
          }

          .bulk-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}