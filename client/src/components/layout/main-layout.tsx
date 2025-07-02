import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import Navbar from './navbar';
import AdvancedSidebar from './advanced-sidebar';
import Footer from './footer';
import { TooltipProvider } from '@/components/ui/tooltip';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dashboard' | 'auth' | 'public';
  showSidebar?: boolean;
  showFooter?: boolean;
  footerVariant?: 'minimal' | 'full' | 'dashboard';
}

export default function MainLayout({ 
  children, 
  className,
  variant = 'dashboard',
  showSidebar = true,
  showFooter = true,
  footerVariant = 'dashboard'
}: MainLayoutProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Auth layout (login/register pages)
  if (variant === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5" />
          
          {/* Content */}
          <div className="relative">
            <main className={cn("min-h-screen flex items-center justify-center p-4", className)}>
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Public layout (marketing pages, etc.)
  if (variant === 'public') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar className="relative z-50" />
        <main className={cn("flex-1", className)}>
          {children}
        </main>
        {showFooter && (
          <Footer variant="full" />
        )}
      </div>
    );
  }

  // Dashboard layout (authenticated app)
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          {showSidebar && user && (
            <div className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
              isMobile && sidebarCollapsed && "-translate-x-full",
              sidebarCollapsed ? "w-16" : "w-72"
            )}>
              <AdvancedSidebar 
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </div>
          )}

          {/* Mobile sidebar overlay */}
          {showSidebar && user && isMobile && !sidebarCollapsed && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          {/* Main content area */}
          <div className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
            showSidebar && user && (sidebarCollapsed ? "lg:ml-16" : "lg:ml-72")
          )}>
            {/* Top navbar */}
            <Navbar 
              onToggleSidebar={toggleSidebar}
              className="sticky top-0 z-40"
            />

            {/* Page content */}
            <main className={cn("flex-1 overflow-auto", className)}>
              <div className="container mx-auto px-4 py-6 lg:px-6">
                {children}
              </div>
            </main>

            {/* Footer */}
            {showFooter && (
              <Footer variant={footerVariant} />
            )}
          </div>
        </div>

        {/* Global loading indicator */}
        <div id="global-loading" className="hidden fixed top-0 left-0 right-0 z-[100]">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
        </div>

        {/* Global notification area */}
        <div id="global-notifications" className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm" />
      </div>
    </TooltipProvider>
  );
}