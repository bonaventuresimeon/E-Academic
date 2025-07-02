import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
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
  GraduationCap,
  BarChart3,
  MessageSquare
} from "lucide-react";

interface MobileNavbarProps {
  user?: any;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: BookOpen, label: "Courses", href: "/courses", badge: "12" },
  { icon: FileText, label: "Assignments", href: "/assignments", badge: "3" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: Users, label: "Students", href: "/students", role: ["lecturer", "admin"] },
  { icon: GraduationCap, label: "Enrollments", href: "/enrollments", role: ["admin"] },
  { icon: BarChart3, label: "Analytics", href: "/analytics", role: ["lecturer", "admin"] },
  { icon: MessageSquare, label: "Messages", href: "/messages", badge: "5" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: "8" },
];

export function MobileNavbar({ 
  user, 
  onLogout, 
  onProfileClick, 
  onNotificationClick,
  className 
}: MobileNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuStyles = {
    bmBurgerButton: {
      display: 'none' // We'll use our custom button
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
      right: '20px',
      top: '20px'
    },
    bmCross: {
      background: '#ffffff',
      height: '2px',
      width: '20px'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      top: '0',
      left: '0'
    },
    bmMenu: {
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      padding: '20px 0',
      fontSize: '16px',
      width: '100%',
      height: '100%',
      overflow: 'auto'
    },
    bmMorphShape: {
      fill: '#1e293b'
    },
    bmItemList: {
      color: '#ffffff',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      height: 'auto'
    },
    bmItem: {
      display: 'block',
      padding: '0',
      color: '#ffffff',
      textDecoration: 'none'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.5)',
      top: '0',
      left: '0'
    }
  };

  const filteredItems = navigationItems.filter(item => {
    if (!item.role) return true;
    return item.role.includes(user?.role || 'student');
  });

  return (
    <>
      {/* Mobile Navbar */}
      <div className={cn(
        "lg:hidden sticky top-0 z-50 w-full border-b transition-colors duration-300",
        "bg-gradient-to-r from-white via-gray-50 to-white",
        "dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        "border-slate-200 dark:border-slate-700",
        className
      )}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuToggle}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
            <LogoIcon size="xs" />
          </div>

          {/* Center: Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex-1 mx-4 justify-start text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm">Search...</span>
          </Button>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationClick}
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                3
              </Badge>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Avatar className="w-7 h-7">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="text-xs bg-blue-500 text-white">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, assignments, students..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Burger Menu */}
      <Menu 
        isOpen={isMenuOpen}
        onStateChange={(state: any) => setIsMenuOpen(state.isOpen)}
        styles={menuStyles}
        width="320px"
      >
        {/* Menu Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {user?.firstName?.[0] || user?.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">
                {user?.firstName || user?.username || 'User'}
              </p>
              <p className="text-slate-300 text-sm capitalize">
                {user?.role || 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-2">
          {filteredItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "flex items-center justify-between px-4 py-3 my-1 rounded-lg transition-colors",
                "hover:bg-slate-800/50 text-white",
                item.active && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="bg-red-500 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </a>
          ))}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => { onProfileClick?.(); closeMenu(); }}
              className="w-full justify-start text-white hover:bg-slate-800/50"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              onClick={() => { onLogout?.(); closeMenu(); }}
              className="w-full justify-start text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </Menu>
    </>
  );
}