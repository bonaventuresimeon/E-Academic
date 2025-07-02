import { cn } from "@/lib/utils";
import { Logo, LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink,
  BookOpen,
  Users,
  Award,
  Shield,
  Zap,
  Globe
} from "lucide-react";

interface AdvancedFooterProps {
  className?: string;
  variant?: "full" | "compact";
}

export function AdvancedFooter({ className, variant = "full" }: AdvancedFooterProps) {
  const currentYear = new Date().getFullYear();
  
  if (variant === "compact") {
    return (
      <footer className={cn(
        "border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
        className
      )}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LogoIcon size="sm" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                © {currentYear} Academic-CRM. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                Privacy
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                Terms
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                Support
              </Button>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn(
      "relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 border-t border-slate-200/60 dark:border-slate-700/60",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>
      
      <div className="relative container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Logo size="lg" className="mb-6" />
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Advanced Academic Management Platform designed for modern educational institutions. 
                Streamline your academic workflow with cutting-edge technology.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Course Management
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Assignment Tracking
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Grade Analytics
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    AI Integration
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                    Mobile App
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </li>
              </ul>
            </div>
            
            {/* Solutions Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Solutions
              </h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    For Universities
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    For Colleges
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    For Schools
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Enterprise
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    API Access
                  </Button>
                </li>
              </ul>
            </div>
            
            {/* Support & Contact */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Documentation
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Community
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Contact Us
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    +1 (555) 123-4567
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Features Banner */}
        <div className="py-8 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-100/50 dark:border-blue-800/30">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Lightning Fast</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">95% deployment success rate</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-100/50 dark:border-green-800/30">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Award Winning</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Best Academic Platform 2025</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-100/50 dark:border-purple-800/30">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Global Reach</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">500+ institutions worldwide</div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 opacity-60" />
        
        {/* Bottom Section */}
        <div className="pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <span>© {currentYear} Academic-CRM. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for Education
              </span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                Privacy Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                Terms of Service
              </Button>
              <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                Cookie Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                GDPR
              </Button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="mt-6 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-slate-600 dark:text-slate-400">All Systems Operational</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">|</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Version 2.0.1
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Status Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}