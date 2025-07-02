import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Logo, LogoIcon } from "@/components/logo";
import {
  Search,
  Bell,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  MessageSquare,
  Moon,
  Sun,
  ChevronDown,
  Home,
  BookOpen,
  FileText,
  Calendar,
  Award,
  BarChart3,
  Users,
  HelpCircle
} from "lucide-react";

interface AdvancedNavbarProps {
  user?: any;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export function AdvancedNavbar({
  user,
  darkMode = false,
  onToggleDarkMode,
  onLogout,
  onProfileClick,
  className
}: AdvancedNavbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  // Get user role for display
  const userRole = user?.role || 'student';

  // Mobile menu items based on user role
  const getMobileMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '/', show: true },
      { icon: BookOpen, label: 'Courses', href: '/courses', show: true },
      { icon: FileText, label: 'Assignments', href: '/assignments', show: userRole !== 'admin' },
      { icon: Calendar, label: 'Schedule', href: '/schedule', show: true },
      { icon: Award, label: 'Grades', href: '/grades', show: userRole === 'student' },
      { icon: BarChart3, label: 'Analytics', href: '/analytics', show: userRole !== 'student' },
      { icon: Users, label: 'Users', href: '/users', show: userRole === 'admin' },
      { icon: MessageSquare, label: 'Messages', href: '/messages', show: true },
      { icon: HelpCircle, label: 'Help', href: '/help', show: true },
    ];

    return baseItems.filter(item => item.show);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b",
        "bg-gradient-to-r from-white via-slate-50 to-white",
        "dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        "border-slate-200 dark:border-slate-700",
        "backdrop-blur-xl shadow-lg supports-backdrop-blur:bg-white/60 dark:supports-backdrop-blur:bg-slate-900/60",
        className
      )}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="mobile-menu-toggle lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </Button>

              {/* Logo */}
              <div className="flex items-center space-x-3">
                <LogoIcon size="sm" className="text-blue-600 dark:text-blue-400" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Academic-CRM
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                    Academic Management Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Search (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <div className={cn(
                  "relative flex items-center rounded-2xl transition-all duration-200",
                  "bg-slate-100 dark:bg-slate-800",
                  isSearchFocused 
                    ? "ring-2 ring-blue-500 dark:ring-blue-400 bg-white dark:bg-slate-700" 
                    : "hover:bg-slate-200 dark:hover:bg-slate-700"
                )}>
                  <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 ml-4" />
                  <Input
                    type="text"
                    placeholder="Search courses, assignments, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="mr-2 p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Search Button (Mobile) */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Search className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 border-2 border-white dark:border-slate-900">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDarkMode}
                className="hidden sm:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.firstName || user?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {userRole}
                    </p>
                  </div>
                  <ChevronDown className="hidden md:block w-4 h-4 text-slate-500 dark:text-slate-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className={cn(
            "mobile-menu fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden",
            "bg-gradient-to-b from-white via-slate-50 to-white",
            "dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
            "border-r border-slate-200 dark:border-slate-700",
            "shadow-2xl backdrop-blur-xl",
            "transform transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            
            {/* Mobile Menu Header */}
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
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {user?.firstName || user?.username || 'User'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user?.email || 'No email'}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs capitalize">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex-1 py-4 overflow-y-auto">
              <nav className="space-y-1 px-4">
                {getMobileMenuItems().map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-12 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </nav>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <Button
                variant="ghost"
                onClick={onToggleDarkMode}
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Moon className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                )}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onProfileClick?.();
                }}
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Settings
                </span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 group"
              >
                <LogOut className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                  Sign Out
                </span>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}