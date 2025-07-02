import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Database,
  Shield,
  HelpCircle,
  Clock,
  Star,
  Archive,
  Trash2,
  Download,
  Upload,
  Globe,
  Layers,
  Grid,
  Filter,
  SortAsc,
  Bookmark,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Wifi,
  Battery,
  User,
  LogOut,
  ChevronLeft,
  ChevronUp,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";

interface AdvancedSidebarProps {
  user?: any;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  url?: string;
  badge?: string | number;
  isNew?: boolean;
  children?: MenuItem[];
  category?: string;
  description?: string;
  shortcut?: string;
}

interface QuickStat {
  id: string;
  label: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

export function AdvancedSidebar({
  user,
  onProfileClick,
  onNotificationClick,
  onSettingsClick,
  onLogout,
  className = ""
}: AdvancedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['dashboard', 'academic']));
  const [activeItem, setActiveItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // Fetch dashboard stats for quick stats
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch notifications count
  const { data: notificationData } = useQuery({
    queryKey: ['/api/notifications'],
  });

  useEffect(() => {
    if (notificationData) {
      const unreadCount = notificationData.filter((n: any) => !n.isRead && !n.isArchived).length;
      setNotifications(unreadCount);
    }
  }, [notificationData]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      url: '/',
      category: 'main',
      description: 'Overview and analytics',
      shortcut: '⌘1'
    },
    {
      id: 'academic',
      label: 'Academic',
      icon: GraduationCap,
      category: 'main',
      children: [
        {
          id: 'courses',
          label: 'Courses',
          icon: BookOpen,
          url: '/courses',
          badge: stats?.enrolledCourses || '12',
          description: 'Manage and view courses'
        },
        {
          id: 'assignments',
          label: 'Assignments',
          icon: FileText,
          url: '/assignments',
          badge: stats?.totalAssignments || '5',
          description: 'Submit and track assignments'
        },
        {
          id: 'grades',
          label: 'Grades',
          icon: Award,
          url: '/grades',
          description: 'View grades and progress'
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: Calendar,
          url: '/calendar',
          description: 'Schedule and events'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      category: 'management',
      children: [
        {
          id: 'performance',
          label: 'Performance',
          icon: TrendingUp,
          url: '/analytics/performance',
          description: 'Academic performance metrics'
        },
        {
          id: 'progress',
          label: 'Progress',
          icon: Target,
          url: '/analytics/progress',
          description: 'Learning progress tracking'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: BarChart3,
          url: '/analytics/reports',
          description: 'Detailed reports and insights'
        }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      category: 'social',
      children: [
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          url: '/messages',
          badge: '7',
          description: 'Direct messages and chats'
        },
        {
          id: 'discussions',
          label: 'Discussions',
          icon: Users,
          url: '/discussions',
          description: 'Course discussions and forums'
        },
        {
          id: 'announcements',
          label: 'Announcements',
          icon: Bell,
          url: '/announcements',
          isNew: true,
          description: 'Important announcements'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Database,
      category: 'tools',
      children: [
        {
          id: 'library',
          label: 'Library',
          icon: BookOpen,
          url: '/library',
          description: 'Digital library and resources'
        },
        {
          id: 'downloads',
          label: 'Downloads',
          icon: Download,
          url: '/downloads',
          description: 'Downloaded files and materials'
        },
        {
          id: 'bookmarks',
          label: 'Bookmarks',
          icon: Bookmark,
          url: '/bookmarks',
          description: 'Saved bookmarks and favorites'
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Zap,
      category: 'utilities',
      children: [
        {
          id: 'calculator',
          label: 'Calculator',
          icon: Grid,
          url: '/tools/calculator',
          description: 'Scientific calculator'
        },
        {
          id: 'converter',
          label: 'Unit Converter',
          icon: Layers,
          url: '/tools/converter',
          description: 'Unit conversion tool'
        },
        {
          id: 'planner',
          label: 'Study Planner',
          icon: Clock,
          url: '/tools/planner',
          description: 'Plan your study schedule'
        }
      ]
    }
  ];

  const quickStats: QuickStat[] = [
    {
      id: 'courses',
      label: 'Active Courses',
      value: stats?.enrolledCourses || 5,
      icon: BookOpen,
      color: '#3b82f6',
      trend: 'up',
      change: '+2'
    },
    {
      id: 'assignments',
      label: 'Pending Tasks',
      value: stats?.totalAssignments || 12,
      icon: FileText,
      color: '#f59e0b',
      trend: 'down',
      change: '-3'
    },
    {
      id: 'grade',
      label: 'Avg Grade',
      value: stats?.avgGrade ? `${stats.avgGrade}%` : '87%',
      icon: Award,
      color: '#10b981',
      trend: 'up',
      change: '+5%'
    },
    {
      id: 'streak',
      label: 'Study Streak',
      value: '12d',
      icon: Target,
      color: '#8b5cf6',
      trend: 'up',
      change: '+1'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = menuItems.filter(item =>
    searchQuery === '' ||
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child =>
      child.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;
    const IconComponent = item.icon;

    return (
      <div key={item.id} className={`menu-item-container level-${level}`}>
        <div
          className={`menu-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'collapsed' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              setActiveItem(item.id);
            }
          }}
        >
          <div className="menu-item-content">
            <div className="menu-item-icon">
              <IconComponent className="icon" />
            </div>
            {!isCollapsed && (
              <>
                <div className="menu-item-text">
                  <span className="menu-item-label">{item.label}</span>
                  {item.description && (
                    <span className="menu-item-description">{item.description}</span>
                  )}
                </div>
                <div className="menu-item-extras">
                  {item.badge && (
                    <span className="menu-item-badge">{item.badge}</span>
                  )}
                  {item.isNew && (
                    <span className="menu-item-new">NEW</span>
                  )}
                  {item.shortcut && (
                    <span className="menu-item-shortcut">{item.shortcut}</span>
                  )}
                  {hasChildren && (
                    <div className="menu-item-expand">
                      {isExpanded ? <ChevronDown className="expand-icon" /> : <ChevronRight className="expand-icon" />}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="menu-children">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`advanced-sidebar ${isCollapsed ? 'collapsed' : ''} ${className}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GraduationCap className="h-8 w-8" />
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <h1>E-Academic</h1>
              <span>Professional</span>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-user">
        <div className="user-info" onClick={onProfileClick}>
          <div className="user-avatar">
            {user?.firstName ? user.firstName.charAt(0) : 'U'}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <span className="user-name">{user?.firstName || 'User'} {user?.lastName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="user-actions">
            <button className="user-action-btn" onClick={onNotificationClick}>
              <Bell className="h-4 w-4" />
              {notifications > 0 && <span className="notification-dot">{notifications}</span>}
            </button>
            <button className="user-action-btn" onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {!isCollapsed && showQuickActions && (
        <div className="quick-stats">
          <div className="section-header">
            <h3>Quick Stats</h3>
            <button 
              className="section-toggle"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          <div className="stats-grid">
            {quickStats.map(stat => (
              <div key={stat.id} className="stat-item">
                <div className="stat-icon" style={{ color: stat.color }}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  {stat.change && (
                    <span className={`stat-change ${stat.trend}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="sidebar-search">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-content">
          {filteredItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="sidebar-actions">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-buttons">
            <button className="action-btn primary">
              <Plus className="h-4 w-4" />
              New Assignment
            </button>
            <button className="action-btn secondary">
              <Upload className="h-4 w-4" />
              Upload File
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-links">
            <a href="#" className="footer-link">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </a>
            <a href="#" className="footer-link">
              <Shield className="h-4 w-4" />
              Privacy
            </a>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <style jsx>{`
        .advanced-sidebar {
          width: 20rem;
          height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: all 0.3s ease;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          overflow: hidden;
        }

        .advanced-sidebar.collapsed {
          width: 5rem;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .brand-text h1 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .brand-text span {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: 500;
        }

        .collapse-btn {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 0.375rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          flex: 1;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .user-info:hover {
          background: #f8fafc;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        .user-role {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: capitalize;
        }

        .user-actions {
          display: flex;
          gap: 0.25rem;
        }

        .user-action-btn {
          position: relative;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .notification-dot {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          width: 1rem;
          height: 1rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .quick-stats {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .section-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .section-toggle {
          padding: 0.25rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 0.25rem;
        }

        .section-toggle:hover {
          background: #f3f4f6;
          color: #6b7280;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .stat-item:hover {
          background: #f1f5f9;
          transform: translateY(-1px);
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.625rem;
          color: #6b7280;
          line-height: 1.2;
        }

        .stat-change {
          font-size: 0.625rem;
          font-weight: 500;
        }

        .stat-change.up {
          color: #10b981;
        }

        .stat-change.down {
          color: #ef4444;
        }

        .stat-change.neutral {
          color: #6b7280;
        }

        .sidebar-search {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .search-container {
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
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #1f2937;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-clear {
          position: absolute;
          right: 0.75rem;
          padding: 0.25rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 0.25rem;
        }

        .search-clear:hover {
          background: #f3f4f6;
          color: #6b7280;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .nav-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .menu-item-container {
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .menu-item:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .menu-item.active {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        .menu-item.collapsed {
          justify-content: center;
          padding: 0.75rem;
        }

        .menu-item-content {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 0.75rem;
        }

        .menu-item-icon {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .menu-item-icon .icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .menu-item-text {
          flex: 1;
          min-width: 0;
        }

        .menu-item-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          line-height: 1.2;
          display: block;
        }

        .menu-item.active .menu-item-label {
          color: #1d4ed8;
          font-weight: 600;
        }

        .menu-item-description {
          font-size: 0.75rem;
          color: #9ca3af;
          line-height: 1.2;
          display: block;
          margin-top: 0.125rem;
        }

        .menu-item-extras {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .menu-item-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          background: #3b82f6;
          color: white;
          border-radius: 0.75rem;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .menu-item-new {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          background: #10b981;
          color: white;
          border-radius: 0.75rem;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .menu-item-shortcut {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 400;
        }

        .menu-item-expand {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .expand-icon {
          width: 1rem;
          height: 1rem;
        }

        .menu-children {
          margin-left: 2rem;
          margin-top: 0.25rem;
          padding-left: 1rem;
          border-left: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .level-1 .menu-item {
          padding: 0.5rem 0.75rem;
        }

        .level-1 .menu-item-label {
          font-size: 0.8125rem;
        }

        .level-1 .menu-item-icon .icon {
          width: 1rem;
          height: 1rem;
        }

        .sidebar-actions {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .action-btn.secondary {
          background: #f8fafc;
          color: #374151;
          border: 1px solid #e2e8f0;
        }

        .action-btn.secondary:hover {
          background: #f1f5f9;
          border-color: #d1d5db;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          background: #f1f5f9;
          color: #374151;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* Scrollbar Styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 0.375rem;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 0.375rem;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 0.375rem;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .advanced-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}