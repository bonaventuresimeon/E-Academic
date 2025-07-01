import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: location === "/dashboard" || location === "/" },
    { name: "Courses", href: "/courses", current: location === "/courses" },
    { name: "Assignments", href: "/assignments", current: location === "/assignments" },
    { name: "AI Assistant", href: "/ai-assistant", current: location === "/ai-assistant" },
  ];

  // Filter navigation based on role
  const getNavigationForRole = () => {
    if (user?.role === "admin") {
      return [
        { name: "Dashboard", href: "/admin-dashboard", current: location === "/admin-dashboard" || location === "/" },
        { name: "Courses", href: "/courses", current: location === "/courses" },
        { name: "AI Assistant", href: "/ai-assistant", current: location === "/ai-assistant" },
      ];
    } else if (user?.role === "lecturer") {
      return [
        { name: "Dashboard", href: "/lecturer-dashboard", current: location === "/lecturer-dashboard" || location === "/" },
        { name: "Courses", href: "/courses", current: location === "/courses" },
        { name: "AI Assistant", href: "/ai-assistant", current: location === "/ai-assistant" },
      ];
    }
    return navigation;
  };

  const roleNavigation = getNavigationForRole();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => setLocation("/")}
                className="flex items-center text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <GraduationCap className="h-6 w-6 mr-2" />
                AcademicCRM
              </button>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {roleNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
