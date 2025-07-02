import { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  ChevronDown,
  ChevronRight,
  Home,
  MessageSquare,
  Bell,
  Database,
  Zap,
  Target,
  TrendingUp,
  Shield,
  HelpCircle,
  Star,
  Bookmark,
  Archive,
  Layers,
  Grid,
  Activity,
  Globe,
  Cpu,
  Sparkles,
  Palette,
  Command,
  ChevronLeft,
  Pin,
  Menu
} from "lucide-react";

interface AdvancedSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string | number | null;
  children?: NavItem[];
  category?: string;
  isNew?: boolean;
  isPro?: boolean;
  description?: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  icon: any;
  color: string;
}

export default function AdvancedSidebar({ className, collapsed = false, onToggleCollapse }: AdvancedSidebarProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'academic']));
  const [pinned, setPinned] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Quick stats for dashboard
  const quickStats: QuickStat[] = [
    {
      label: "Courses",
      value: user?.role === 'student' ? 5 : user?.role === 'lecturer' ? 3 : 12,
      change: 2,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      label: "Tasks",
      value: user?.role === 'student' ? 8 : user?.role === 'lecturer' ? 24 : 156,
      change: -1,
      icon: FileText,
      color: "bg-green-500"
    },
    {
      label: "Progress",
      value: "87%",
      change: 5,
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  const getNavigationSections = () => {
    const sections: { [key: string]: { title: string; items: NavItem[] } } = {};

    // Main navigation
    sections.main = {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          icon: Home,
          href: "/dashboard",
          badge: null,
          description: "Overview and quick actions"
        },
        {
          title: "Advanced Dashboard",
          icon: Sparkles,
          href: "/advanced-dashboard",
          badge: "Pro",
          isPro: true,
          description: "Comprehensive management tools"
        },
      ]
    };

    // Academic section
    sections.academic = {
      title: "Academic",
      items: [
        {
          title: "Courses",
          icon: BookOpen,
          href: "/courses",
          badge: user?.role === 'lecturer' ? 3 : user?.role === 'student' ? 5 : null,
          description: "Course management and enrollment"
        },
        {
          title: "Assignments",
          icon: FileText,
          href: "/assignments",
          badge: user?.role === 'student' ? "3" : user?.role === 'lecturer' ? "12" : null,
          description: "Track and manage assignments"
        },
      ]
    };

    // Student specific
    if (user?.role === "student") {
      sections.academic.items.push(
        {
          title: "Schedule",
          icon: Calendar,
          href: "/schedule",
          badge: null,
          description: "Class schedule and events"
        },
        {
          title: "Grades",
          icon: Award,
          href: "/grades",
          badge: null,
          description: "View grades and progress"
        },
        {
          title: "Notifications",
          icon: Bell,
          href: "/notifications",
          badge: "2",
          description: "Important updates and alerts"
        }
      );
    }

    // Lecturer specific
    if (user?.role === "lecturer") {
      sections.academic.items.push(
        {
          title: "Students",
          icon: Users,
          href: "/students",
          badge: "42",
          description: "Manage enrolled students"
        },
        {
          title: "Analytics",
          icon: BarChart3,
          href: "/analytics",
          badge: null,
          description: "Performance analytics"
        }
      );

      sections.content = {
        title: "Content Creation",
        items: [
          {
            title: "Quiz Builder",
            icon: Brain,
            href: "/quiz-builder",
            badge: "New",
            isNew: true,
            description: "Create interactive quizzes"
          },
          {
            title: "Test Scheduler",
            icon: Clock,
            href: "/test-scheduler",
            badge: null,
            description: "Schedule and manage tests"
          },
          {
            title: "Course Materials",
            icon: Archive,
            href: "/materials",
            badge: null,
            description: "Upload and organize materials"
          }
        ]
      };
    }

    // Admin specific
    if (user?.role === "admin") {
      sections.administration = {
        title: "Administration",
        items: [
          {
            title: "User Management",
            icon: Users,
            href: "/admin/users",
            badge: "1.2k",
            description: "Manage all platform users"
          },
          {
            title: "System Monitor",
            icon: Activity,
            href: "/admin/system",
            badge: null,
            description: "Monitor system health"
          },
          {
            title: "Database",
            icon: Database,
            href: "/admin/database",
            badge: null,
            description: "Database administration"
          },
          {
            title: "Security",
            icon: Shield,
            href: "/admin/security",
            badge: "⚠️",
            description: "Security settings and logs"
          }
        ]
      };

      sections.analytics = {
        title: "Analytics",
        items: [
          {
            title: "Performance",
            icon: TrendingUp,
            href: "/admin/performance",
            badge: null,
            description: "Platform performance metrics"
          },
          {
            title: "Usage Stats",
            icon: BarChart3,
            href: "/admin/stats",
            badge: null,
            description: "User activity statistics"
          },
          {
            title: "Reports",
            icon: FileText,
            href: "/admin/reports",
            badge: null,
            description: "Generate custom reports"
          }
        ]
      };
    }

    // Tools section for all users
    sections.tools = {
      title: "Tools",
      items: [
        {
          title: "AI Assistant",
          icon: Brain,
          href: "/ai-assistant",
          badge: "New",
          isNew: true,
          description: "AI-powered academic assistant"
        },
        {
          title: "Search",
          icon: Search,
          href: "/search",
          badge: null,
          description: "Global search across platform"
        },
        {
          title: "Help Center",
          icon: HelpCircle,
          href: "/help",
          badge: null,
          description: "Documentation and support"
        }
      ]
    };

    return sections;
  };

  const navigationSections = getNavigationSections();

  const NavItemComponent = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    const isActive = location === item.href;
    
    const itemContent = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "w-full justify-start h-auto py-2 px-3",
          depth > 0 && "ml-4 w-[calc(100%-1rem)]",
          isActive && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          collapsed && "justify-center px-2"
        )}
        onClick={() => setLocation(item.href)}
      >
        <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
        {!collapsed && (
          <>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.title}</span>
                <div className="flex items-center gap-1">
                  {item.isNew && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      New
                    </Badge>
                  )}
                  {item.isPro && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                      Pro
                    </Badge>
                  )}
                  {item.badge && !item.isNew && !item.isPro && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
              {item.description && (
                <span className="text-xs text-muted-foreground">{item.description}</span>
              )}
            </div>
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {itemContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col">
            <span className="font-medium">{item.title}</span>
            {item.description && (
              <span className="text-xs text-muted-foreground">{item.description}</span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return itemContent;
  };

  const SectionComponent = ({ sectionKey, section }: { sectionKey: string; section: { title: string; items: NavItem[] } }) => {
    const isExpanded = expandedSections.has(sectionKey);

    if (collapsed) {
      return (
        <div className="space-y-1">
          {section.items.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </div>
      );
    }

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between px-3 py-2 h-auto font-medium text-muted-foreground hover:text-foreground"
          >
            <span className="text-xs uppercase tracking-wider">{section.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-1">
          {section.items.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r border-border",
      collapsed ? "w-16" : "w-72",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AcademicHub
              </h1>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPinned(!pinned)}
              className="h-8 w-8"
            >
              <Pin className={cn("h-4 w-4", pinned && "text-blue-600")} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
                {stat.change && (
                  <div className={cn(
                    "text-xs font-medium",
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change > 0 ? "+" : ""}{stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Progress value={87} className="mt-3 h-2" />
          <p className="text-xs text-muted-foreground mt-1">Overall Progress</p>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          {Object.entries(navigationSections).map(([key, section]) => (
            <div key={key}>
              <SectionComponent sectionKey={key} section={section} />
              {!collapsed && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>v2.1.0</span>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}