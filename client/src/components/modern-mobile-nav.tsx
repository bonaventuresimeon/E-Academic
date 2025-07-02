import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoIcon } from "@/components/logo";
import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  User,
  Settings,
  Bell,
  Search,
  Menu as MenuIcon,
  X,
  LogOut,
  Users,
  Award,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Zap,
  Shield
} from "lucide-react";

interface ModernMobileNavProps {
  user?: any;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
}

export function ModernMobileNav({ 
  user, 
  onLogout, 
  onProfileClick, 
  onNotificationClick,
  className 
}: ModernMobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get user role for navigation filtering
  const userRole = user?.role || 'student';

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '/', show: true },
      { icon: BookOpen, label: 'Courses', href: '/courses', show: true },
      { icon: FileText, label: 'Assignments', href: '/assignments', show: userRole !== 'admin' },
      { icon: Calendar, label: 'Schedule', href: '/schedule', show: true },
      { icon: Award, label: 'Grades', href: '/grades', show: userRole === 'student' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics', show: userRole !== 'student' },
      { icon: Users, label: 'Users', href: '/users', show: userRole === 'admin' },
      { icon: MessageSquare, label: 'Messages', href: '/messages', show: true },
      { icon: Bell, label: 'Notifications', href: '/notifications', show: true },
    ];

    return baseItems.filter(item => item.show);
  };

  const navigationItems = getNavigationItems();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.mobile-nav-menu') && !target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Fixed Mobile Navbar */}
      <nav className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-50 h-16",
        "bg-gradient-to-r from-white via-gray-50 to-white",
        "dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        "border-b border-slate-200 dark:border-slate-700",
        "backdrop-blur-xl shadow-sm",
        className
      )}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              className="menu-toggle p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </Button>
            <div className="flex items-center space-x-2">
              <LogoIcon size="xs" className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academic-CRM
              </span>
            </div>
          </div>

          {/* Center: Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-xs mx-4 justify-start rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2 text-slate-500" />
            <span className="text-slate-500 text-sm">Search...</span>
          </Button>

          {/* Right: User Avatar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </nav>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Slide-out Menu Panel */}
          <div className={cn(
            "mobile-nav-menu fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden",
            "bg-gradient-to-b from-white via-slate-50 to-white",
            "dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
            "border-r border-slate-200 dark:border-slate-700",
            "shadow-2xl backdrop-blur-xl",
            "transform transition-transform duration-300 ease-out",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <LogoIcon size="sm" className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Academic-CRM
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Academic Management
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info Section */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user?.firstName || user?.username || 'User'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'No email'}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs capitalize">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-4 overflow-y-auto">
              <nav className="space-y-1 px-4">
                {navigationItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-12 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    onClick={() => {
                      setIsMenuOpen(false);
                      // Handle navigation here
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Button>
                ))}
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  onProfileClick?.();
                }}
              >
                <Settings className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-300">
                  Settings
                </span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout?.();
                }}
              >
                <LogOut className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                  Sign Out
                </span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 lg:hidden p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search courses, assignments, users..."
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Start typing to search...
            </div>
          </div>
        </>
      )}
    </>
  );
}