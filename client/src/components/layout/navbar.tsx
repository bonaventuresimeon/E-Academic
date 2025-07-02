import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  Zap,
  BookOpen,
  FileText,
  Brain,
  Calendar,
  Users,
  Award,
  ChevronDown,
  Command as CommandIcon,
  Globe,
  HelpCircle,
  Shield,
  Sparkles,
  Cpu,
  Database,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NavbarProps {
  onToggleSidebar?: () => void;
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  category: string;
}

export default function Navbar({ onToggleSidebar, className }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data - replace with actual API calls
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Assignment Due',
      description: 'React Project Implementation due in 2 days',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: '2',
      title: 'Quiz Available',
      description: 'JavaScript Fundamentals quiz is now available',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false
    },
    {
      id: '3',
      title: 'Grade Posted',
      description: 'Your Database Schema Design has been graded',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'create-course',
      title: 'Create Course',
      description: 'Set up a new course with assignments and quizzes',
      icon: BookOpen,
      href: '/courses/create',
      category: 'Academic'
    },
    {
      id: 'new-assignment',
      title: 'New Assignment',
      description: 'Create and publish a new assignment',
      icon: FileText,
      href: '/assignments/create',
      category: 'Academic'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get help with course planning and recommendations',
      icon: Brain,
      href: '/ai-assistant',
      category: 'Tools'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View detailed performance analytics',
      icon: BarChart3,
      href: '/analytics',
      category: 'Reports'
    },
    {
      id: 'schedule',
      title: 'Schedule Meeting',
      description: 'Schedule office hours or meetings',
      icon: Calendar,
      href: '/schedule',
      category: 'Tools'
    },
    {
      id: 'students',
      title: 'Manage Students',
      description: 'View and manage student enrollments',
      icon: Users,
      href: '/students',
      category: 'Management'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation('/auth');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const SearchDialog = () => (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2">
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Search for courses, assignments, students, and more
          </DialogDescription>
        </DialogHeader>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              {quickActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={action.title}
                  onSelect={() => {
                    setLocation(action.href);
                    setSearchOpen(false);
                  }}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{action.title}</span>
                    <span className="text-sm text-muted-foreground">{action.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );

  const NotificationsPopover = () => (
    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-semibold">Notifications</h4>
          <Badge variant="secondary">{unreadCount} new</Badge>
        </div>
        <div className="max-h-96 overflow-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-4 hover:bg-muted/50 border-b last:border-b-0",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                <div className={cn(
                  "mt-1 h-2 w-2 rounded-full",
                  notification.type === 'info' && "bg-blue-500",
                  notification.type === 'success' && "bg-green-500",
                  notification.type === 'warning' && "bg-yellow-500",
                  notification.type === 'error' && "bg-red-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(notification.timestamp, 'MMM d, h:mm a')}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt={user?.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <Badge variant="secondary" className="w-fit mt-1 text-xs">
              {user?.role}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLocation('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocation('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocation('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {isDarkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark mode</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-3 lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            {/* Mobile sidebar content would go here */}
            <div className="py-4">
              <h2 className="text-lg font-semibold">Academic Platform</h2>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-3 hidden lg:flex"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Logo and brand */}
        <div className="flex items-center space-x-2 mr-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AcademicHub
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex justify-center max-w-xl mx-auto">
          <SearchDialog />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Quick access buttons */}
          <div className="hidden md:flex items-center space-x-2 mr-2">
            <Button variant="ghost" size="icon" title="AI Assistant">
              <Brain className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Calendar">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Analytics">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Notifications */}
          <NotificationsPopover />

          {/* System status indicator */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Online</span>
            </div>
          </div>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>

      {/* Progress bar for loading states */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300" />
    </header>
  );
}