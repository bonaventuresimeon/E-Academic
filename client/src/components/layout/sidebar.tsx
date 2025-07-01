import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  Brain,
  Calendar,
  Award,
  Clock,
  GraduationCap,
  PlusCircle,
  Search,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        icon: BarChart3,
        href: "/dashboard",
        badge: null,
      },
      {
        title: "Courses",
        icon: BookOpen,
        href: "/courses",
        badge: null,
      },
    ];

    if (user?.role === "student") {
      return [
        ...baseItems,
        {
          title: "Assignments",
          icon: FileText,
          href: "/assignments",
          badge: "3",
        },
        {
          title: "Schedule",
          icon: Calendar,
          href: "/schedule",
          badge: null,
        },
        {
          title: "Grades",
          icon: Award,
          href: "/grades",
          badge: null,
        },
        {
          title: "AI Assistant",
          icon: Brain,
          href: "/ai-assistant",
          badge: "New",
        },
      ];
    }

    if (user?.role === "lecturer") {
      return [
        ...baseItems,
        {
          title: "My Courses",
          icon: GraduationCap,
          href: "/my-courses",
          badge: "3",
        },
        {
          title: "Assignments",
          icon: FileText,
          href: "/assignments",
          badge: "12",
        },
        {
          title: "Students",
          icon: Users,
          href: "/students",
          badge: null,
        },
        {
          title: "AI Assistant",
          icon: Brain,
          href: "/ai-assistant",
          badge: null,
        },
      ];
    }

    if (user?.role === "admin") {
      return [
        ...baseItems,
        {
          title: "Users",
          icon: Users,
          href: "/users",
          badge: null,
        },
        {
          title: "Analytics",
          icon: BarChart3,
          href: "/analytics",
          badge: null,
        },
        {
          title: "Pending Approvals",
          icon: Clock,
          href: "/approvals",
          badge: "5",
        },
        {
          title: "AI Assistant",
          icon: Brain,
          href: "/ai-assistant",
          badge: null,
        },
        {
          title: "Settings",
          icon: Settings,
          href: "/settings",
          badge: null,
        },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const quickActions = [
    {
      title: "Create Course",
      icon: PlusCircle,
      action: () => console.log("Create course"),
      visible: user?.role === "lecturer" || user?.role === "admin",
    },
    {
      title: "Browse Courses",
      icon: Search,
      action: () => setLocation("/courses"),
      visible: user?.role === "student",
    },
    {
      title: "Add Assignment",
      icon: FileText,
      action: () => console.log("Add assignment"),
      visible: user?.role === "lecturer",
    },
  ];

  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar border-r", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <GraduationCap className="h-6 w-6 text-sidebar-primary" />
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
          AcademicCRM
        </span>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          <div className="mb-2">
            <h4 className="mb-2 text-sm font-medium text-sidebar-foreground">
              Navigation
            </h4>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={location === item.href ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 h-9",
                    location === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setLocation(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={location === item.href ? "secondary" : "outline"}
                      className="ml-auto h-5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-sidebar-foreground">
              Quick Actions
            </h4>
            <div className="space-y-1">
              {quickActions
                .filter((action) => action.visible)
                .map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 h-8"
                    onClick={action.action}
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="text-xs">{action.title}</span>
                  </Button>
                ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
