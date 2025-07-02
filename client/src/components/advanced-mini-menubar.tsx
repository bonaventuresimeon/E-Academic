import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  GraduationCap,
  Award,
  HelpCircle,
  Bookmark,
  Download,
  Upload,
  Globe,
  Zap,
  Shield,
  Database,
  Activity,
  Layers,
  Target,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Filter,
  SortAsc,
  Grid,
  List,
  Maximize2,
  Minimize2,
  TrendingUp,
  Play
} from "lucide-react";

interface AdvancedMiniMenubarProps {
  user?: any;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  shortcut?: string;
  category?: string;
  description?: string;
  children?: MenuItem[];
  action?: () => void;
  badge?: string | number;
  isNew?: boolean;
}

export function AdvancedMiniMenubar({
  user,
  onProfileClick,
  onNotificationClick,
  onSettingsClick,
  className = ""
}: AdvancedMiniMenubarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCompactMode, setIsCompactMode] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      shortcut: "⌘D",
      category: "main",
      description: "Main dashboard overview",
      action: () => console.log("Navigate to dashboard")
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      shortcut: "⌘C",
      category: "academic",
      description: "Manage courses and curricula",
      badge: "12",
      children: [
        { id: "my-courses", label: "My Courses", icon: BookOpen, action: () => {} },
        { id: "browse-courses", label: "Browse Courses", icon: Globe, action: () => {} },
        { id: "course-analytics", label: "Course Analytics", icon: BarChart3, badge: "new", isNew: true, action: () => {} }
      ]
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: FileText,
      shortcut: "⌘A",
      category: "academic",
      description: "View and manage assignments",
      badge: "5",
      children: [
        { id: "pending-assignments", label: "Pending", icon: Clock, badge: "3", action: () => {} },
        { id: "submitted-assignments", label: "Submitted", icon: Award, action: () => {} },
        { id: "create-assignment", label: "Create New", icon: FileText, action: () => {} }
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      shortcut: "⌘T",
      category: "management",
      description: "Performance analytics and reports",
      children: [
        { id: "student-progress", label: "Student Progress", icon: TrendingUp, action: () => {} },
        { id: "course-performance", label: "Course Performance", icon: Target, action: () => {} },
        { id: "engagement-metrics", label: "Engagement", icon: Activity, action: () => {} }
      ]
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      shortcut: "⌘L",
      category: "productivity",
      description: "Schedule and events",
      action: () => console.log("Open calendar")
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      shortcut: "⌘M",
      category: "communication",
      description: "Internal messaging system",
      badge: "7",
      action: () => console.log("Open messages")
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      shortcut: "⌘U",
      category: "management",
      description: "User management and roles",
      children: [
        { id: "students", label: "Students", icon: GraduationCap, action: () => {} },
        { id: "instructors", label: "Instructors", icon: User, action: () => {} },
        { id: "administrators", label: "Administrators", icon: Shield, action: () => {} }
      ]
    },
    {
      id: "resources",
      label: "Resources",
      icon: Database,
      category: "tools",
      description: "Learning resources and materials",
      children: [
        { id: "library", label: "Library", icon: BookOpen, action: () => {} },
        { id: "downloads", label: "Downloads", icon: Download, action: () => {} },
        { id: "uploads", label: "Uploads", icon: Upload, action: () => {} },
        { id: "bookmarks", label: "Bookmarks", icon: Bookmark, action: () => {} }
      ]
    },
    {
      id: "tools",
      label: "Tools",
      icon: Zap,
      category: "tools",
      description: "Administrative tools and utilities",
      children: [
        { id: "bulk-operations", label: "Bulk Operations", icon: Layers, action: () => {} },
        { id: "data-export", label: "Data Export", icon: Download, action: () => {} },
        { id: "system-health", label: "System Health", icon: Activity, badge: "98%", action: () => {} }
      ]
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      category: "support",
      description: "Documentation and support",
      children: [
        { id: "documentation", label: "Documentation", icon: BookOpen, action: () => {} },
        { id: "tutorials", label: "Tutorials", icon: Play, action: () => {} },
        { id: "contact-support", label: "Contact Support", icon: MessageSquare, action: () => {} }
      ]
    }
  ];

  const categories = [
    { id: "all", label: "All", icon: Grid },
    { id: "main", label: "Main", icon: Home },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "management", label: "Management", icon: Briefcase },
    { id: "productivity", label: "Productivity", icon: Calendar },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "tools", label: "Tools", icon: Zap },
    { id: "support", label: "Support", icon: HelpCircle }
  ];

  const filteredItems = menuItems.filter(item => 
    activeCategory === "all" || item.category === activeCategory
  ).filter(item =>
    searchQuery === "" || 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const IconComponent = item.icon;

    return (
      <div key={item.id} className={`menu-item-container ${isChild ? 'child-item' : ''}`}>
        <div 
          className={`menu-item ${isChild ? 'menu-item-child' : ''} ${hasChildren ? 'has-children' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.action) {
              item.action();
              setIsMenuOpen(false);
            }
          }}
        >
          <div className="menu-item-left">
            <IconComponent className="menu-item-icon" />
            <div className="menu-item-content">
              <span className="menu-item-label">
                {item.label}
                {item.isNew && <span className="menu-item-new-badge">NEW</span>}
              </span>
              {!isCompactMode && item.description && (
                <span className="menu-item-description">{item.description}</span>
              )}
            </div>
          </div>
          <div className="menu-item-right">
            {item.badge && (
              <span className="menu-item-badge">{item.badge}</span>
            )}
            {item.shortcut && !isCompactMode && (
              <span className="menu-item-shortcut">{item.shortcut}</span>
            )}
            {hasChildren && (
              <div className="menu-item-expand">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="menu-children">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`advanced-mini-menubar ${className}`} ref={menuRef}>
      {/* Main Menubar */}
      <div className="menubar-container">
        {/* Logo/Brand */}
        <div className="menubar-brand">
          <div className="brand-icon">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="brand-text">E-Academic</span>
        </div>

        {/* Quick Actions */}
        <div className="menubar-actions">
          <button 
            className="action-btn search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
            <span className="action-label">Search</span>
            <span className="action-shortcut">⌘K</span>
          </button>

          <button 
            className="action-btn menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
            <span className="action-label">Menu</span>
          </button>
        </div>

        {/* User Actions */}
        <div className="menubar-user">
          <button className="user-btn notification-btn" onClick={onNotificationClick}>
            <Bell className="h-4 w-4" />
            <span className="notification-badge">3</span>
          </button>

          <button className="user-btn settings-btn" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
          </button>

          <button className="user-btn profile-btn" onClick={onProfileClick}>
            <div className="user-avatar">
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <span className="user-name">{user?.firstName || 'User'}</span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <div className="search-header">
              <Search className="search-icon" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search commands, features, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button 
                className="search-close"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {searchQuery && (
              <div className="search-results">
                <div className="search-results-header">
                  <span>Results for "{searchQuery}"</span>
                  <span className="results-count">{filteredItems.length} found</span>
                </div>
                <div className="search-results-list">
                  {filteredItems.map(item => (
                    <div key={item.id} className="search-result-item" onClick={item.action}>
                      <item.icon className="result-icon" />
                      <div className="result-content">
                        <span className="result-title">{item.label}</span>
                        <span className="result-description">{item.description}</span>
                      </div>
                      {item.shortcut && <span className="result-shortcut">{item.shortcut}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Menu Panel */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="menu-panel">
            {/* Menu Header */}
            <div className="menu-header">
              <div className="menu-title">
                <h3>Command Center</h3>
                <p>Access all platform features and tools</p>
              </div>
              <div className="menu-controls">
                <button 
                  className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  className={`control-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
                <button 
                  className={`control-btn ${isCompactMode ? 'active' : ''}`}
                  onClick={() => setIsCompactMode(!isCompactMode)}
                >
                  {isCompactMode ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button className="control-btn close-btn" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="menu-categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <category.icon className="category-icon" />
                  <span className="category-label">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className={`menu-content ${viewMode} ${isCompactMode ? 'compact' : ''}`}>
              {filteredItems.map(item => renderMenuItem(item))}
            </div>

            {/* Menu Footer */}
            <div className="menu-footer">
              <div className="footer-stats">
                <span className="stat">
                  <Activity className="stat-icon" />
                  System Status: <span className="stat-value healthy">Healthy</span>
                </span>
                <span className="stat">
                  <Users className="stat-icon" />
                  Active Users: <span className="stat-value">247</span>
                </span>
              </div>
              <div className="footer-shortcuts">
                <span className="shortcut-hint">
                  Press <kbd>Esc</kbd> to close • <kbd>⌘K</kbd> to search
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .advanced-mini-menubar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .menubar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .menubar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .brand-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .menubar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(55, 65, 81, 0.05);
          border: 1px solid rgba(55, 65, 81, 0.1);
          border-radius: 0.5rem;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(55, 65, 81, 0.1);
          border-color: rgba(55, 65, 81, 0.2);
          transform: translateY(-1px);
        }

        .action-shortcut {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 400;
          margin-left: 0.5rem;
        }

        .menubar-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-btn:hover {
          background: rgba(55, 65, 81, 0.05);
          border-color: rgba(55, 65, 81, 0.1);
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }

        .notification-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 1.25rem;
          height: 1.25rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
          z-index: 1001;
        }

        .search-container {
          width: 100%;
          max-width: 42rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .search-header {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .search-icon {
          color: #9ca3af;
          margin-right: 0.75rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.125rem;
          color: #1f2937;
          background: transparent;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-close {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 0.375rem;
        }

        .search-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .search-results {
          max-height: 24rem;
          overflow-y: auto;
        }

        .search-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .search-result-item:hover {
          background: #f9fafb;
        }

        .result-icon {
          color: #6b7280;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .result-title {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .result-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.125rem;
        }

        .result-shortcut {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 400;
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 5rem 1rem 1rem 1rem;
          z-index: 1001;
        }

        .menu-panel {
          width: 100%;
          max-width: 56rem;
          max-height: calc(100vh - 6rem);
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .menu-title h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .menu-title p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }

        .menu-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .control-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .menu-categories {
          display: flex;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .category-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .category-icon {
          width: 1rem;
          height: 1rem;
        }

        .menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .menu-content.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }

        .menu-content.list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background: #f9fafb;
          border-color: #3b82f6;
          transform: translateY(-1px);
        }

        .menu-item-child {
          margin-left: 1rem;
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .menu-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .menu-item-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
          flex-shrink: 0;
        }

        .menu-item-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .menu-item-label {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu-item-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.125rem;
        }

        .menu-item-new-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.375rem;
          background: #10b981;
          color: white;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .menu-item-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu-item-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .menu-item-shortcut {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 400;
        }

        .menu-item-expand {
          color: #9ca3af;
        }

        .menu-children {
          margin-top: 0.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .menu-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .footer-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .stat-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .stat-value {
          font-weight: 500;
          color: #1f2937;
        }

        .stat-value.healthy {
          color: #10b981;
        }

        .shortcut-hint {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        kbd {
          display: inline-block;
          padding: 0.125rem 0.25rem;
          background: #e5e7eb;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          font-weight: 500;
          color: #374151;
        }

        .menu-content.compact .menu-item-description {
          display: none;
        }

        .menu-content.compact .menu-item {
          padding: 0.5rem 0.75rem;
        }

        .menu-content.compact .action-shortcut {
          display: none;
        }

        @media (max-width: 768px) {
          .menubar-container {
            padding: 0.5rem 1rem;
          }

          .action-label {
            display: none;
          }

          .action-shortcut {
            display: none;
          }

          .user-name {
            display: none;
          }

          .menu-overlay {
            padding: 1rem;
          }

          .menu-categories {
            overflow-x: auto;
            padding-bottom: 1.5rem;
          }

          .footer-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}