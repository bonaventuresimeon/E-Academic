import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  Globe,
  Shield,
  HelpCircle,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  Cpu,
  Database,
  Zap,
  Monitor,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  Sparkles,
  ExternalLink,
  ChevronUp,
  Sun,
  Moon,
  Languages,
  Accessibility
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface FooterProps {
  className?: string;
  variant?: 'minimal' | 'full' | 'dashboard';
}

interface SystemStatus {
  component: string;
  status: 'operational' | 'degraded' | 'outage';
  lastUpdated: string;
}

interface PlatformStat {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export default function Footer({ className, variant = 'full' }: FooterProps) {
  const { user } = useAuth();
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const systemStatus: SystemStatus[] = [
    { component: 'API Gateway', status: 'operational', lastUpdated: '2 min ago' },
    { component: 'Database', status: 'operational', lastUpdated: '1 min ago' },
    { component: 'Authentication', status: 'operational', lastUpdated: '30 sec ago' },
    { component: 'File Storage', status: 'operational', lastUpdated: '1 min ago' },
    { component: 'AI Services', status: 'operational', lastUpdated: '3 min ago' },
    { component: 'Email Service', status: 'degraded', lastUpdated: '5 min ago' }
  ];

  const platformStats: PlatformStat[] = [
    { label: 'Active Users', value: '2.3k', icon: Users, color: 'text-blue-600' },
    { label: 'Courses', value: '156', icon: BookOpen, color: 'text-green-600' },
    { label: 'Assignments', value: '1.2k', icon: Award, color: 'text-purple-600' },
    { label: 'Uptime', value: '99.9%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'outage': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const SystemStatusDialog = () => (
    <Dialog open={showSystemStatus} onOpenChange={setShowSystemStatus}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto flex items-center gap-2 p-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs">All Systems Operational</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </DialogTitle>
          <DialogDescription>
            Real-time status of all platform components
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {systemStatus.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", getStatusColor(item.status))} />
                <div>
                  <p className="font-medium text-sm">{item.component}</p>
                  <p className="text-xs text-muted-foreground">Updated {item.lastUpdated}</p>
                </div>
              </div>
              <Badge variant={item.status === 'operational' ? 'default' : 
                              item.status === 'degraded' ? 'secondary' : 'destructive'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Status updates every 30 seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (variant === 'minimal') {
    return (
      <footer className={cn("border-t bg-background", className)}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 AcademicHub</span>
              <SystemStatusDialog />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'dashboard') {
    return (
      <footer className={cn("border-t bg-background", className)}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Platform Stats */}
            <div className="flex items-center gap-6">
              {platformStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                  <span className="text-sm font-medium">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <SystemStatusDialog />
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AcademicHub
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering education through intelligent technology. 
              Transform your academic experience with our comprehensive platform.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Features</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Pricing</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Integration</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">API Docs</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Changelog</Button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Help Center</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Community</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Contact Us</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Bug Reports</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Feature Requests</Button></li>
            </ul>
          </div>

          {/* Legal & Status */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal & Status</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Privacy Policy</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Terms of Service</Button></li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">GDPR Compliance</Button></li>
              <li>
                <SystemStatusDialog />
              </li>
              <li><Button variant="link" className="h-auto p-0 text-muted-foreground">Security</Button></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 AcademicHub. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    English
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                  <DropdownMenuItem>Deutsch</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark mode
                </>
              )}
            </Button>

            {/* Accessibility */}
            <Button variant="ghost" size="sm">
              <Accessibility className="h-4 w-4 mr-2" />
              Accessibility
            </Button>

            {/* Version info */}
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>v2.1.0</span>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>

        {/* Performance metrics (for development) */}
        {user?.role === 'admin' && (
          <>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Cpu className="h-3 w-3" />
                <span>CPU: 23%</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Database className="h-3 w-3" />
                <span>DB: 15ms</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Monitor className="h-3 w-3" />
                <span>Memory: 1.2GB</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>Uptime: 99.9%</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll to top */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </footer>
  );
}