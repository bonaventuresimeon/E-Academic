import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoIcon } from "@/components/logo";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  ArrowUp,
  ChevronRight
} from "lucide-react";

interface AdvancedFooterProps {
  className?: string;
  variant?: "full" | "compact";
  darkMode?: boolean;
}

export function AdvancedFooter({ 
  className, 
  variant = "full",
  darkMode = false 
}: AdvancedFooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === "compact") {
    return (
      <footer className={cn(
        "border-t",
        "bg-gradient-to-r from-white via-slate-50 to-white",
        "dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        "border-slate-200 dark:border-slate-700",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <LogoIcon size="xs" className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                © {currentYear} E-Academic. All rights reserved.
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-xs">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Terms of Service
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={scrollToTop}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn(
      "border-t",
      "bg-gradient-to-b from-white via-slate-50 to-slate-100",
      "dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
      "border-slate-200 dark:border-slate-700",
      className
    )}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <LogoIcon size="md" className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  E-Academic
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Academic Management Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transforming educational workflow and user experience with cutting-edge technology 
              and intuitive design for universities and educational institutions.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" }
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </Button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Products
            </h4>
            <ul className="space-y-3">
              {[
                "Course Management",
                "Assignment Tracking",
                "Grade Analytics",
                "Student Portal",
                "Lecturer Dashboard",
                "Admin Panel"
              ].map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-normal justify-start"
                  >
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Solutions
            </h4>
            <ul className="space-y-3">
              {[
                "Universities",
                "Community Colleges", 
                "K-12 Schools",
                "Online Learning",
                "Corporate Training",
                "Custom Integration"
              ].map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-normal justify-start"
                  >
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Documentation",
                "API Reference",
                "Community",
                "Status Page",
                "Contact Us"
              ].map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-normal justify-start"
                  >
                    {item}
                  </Button>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4" />
                <span>contact@bonaventure.org.ng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4" />
                <span>+234 (081) )2222-5406</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>Awka, Anambra, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Banner */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h5 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Ready to transform your academic management?
                </h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Join thousands of educational institutions using E-Academic
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started Free
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  View Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-200 dark:bg-slate-700" />

      {/* Bottom Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <span>© {currentYear} E-Academic. All rights reserved.</span>
              <span>•</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for education</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {[
                "Privacy Policy",
                "Terms of Service", 
                "Cookie Policy",
                "Accessibility"
              ].map((item, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="h-auto p-0 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {item}
                </Button>
              ))}
              
              {/* Back to Top */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={scrollToTop}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl ml-4"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}