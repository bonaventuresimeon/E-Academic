import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "default", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Academic CRM Logo Icon */}
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 40 40"
          className={cn(
            "w-full h-full",
            variant === "light" ? "text-white" : 
            variant === "dark" ? "text-slate-900" :
            "text-blue-600 dark:text-blue-400"
          )}
          fill="currentColor"
        >
          {/* Academic Cap Base */}
          <path d="M20 5L35 12L20 19L5 12L20 5Z" opacity="0.8" />
          
          {/* Academic Cap Tassel */}
          <circle cx="20" cy="10" r="1.5" />
          <path d="M20 10L22 8L24 10L22 12Z" opacity="0.6" />
          
          {/* Books/Knowledge Base */}
          <rect x="8" y="20" width="24" height="3" rx="1" opacity="0.7" />
          <rect x="10" y="25" width="20" height="3" rx="1" opacity="0.6" />
          <rect x="12" y="30" width="16" height="3" rx="1" opacity="0.5" />
          
          {/* CRM Connection Lines */}
          <circle cx="15" cy="35" r="2" opacity="0.4" />
          <circle cx="20" cy="35" r="2" opacity="0.4" />
          <circle cx="25" cy="35" r="2" opacity="0.4" />
          <path d="M15 35L20 35L25 35" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
        
        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-md opacity-20",
          variant === "light" ? "bg-white" :
          variant === "dark" ? "bg-slate-900" :
          "bg-blue-500"
        )} />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={cn(
          "font-bold leading-tight tracking-tight",
          textSizeClasses[size],
          variant === "light" ? "text-white" :
          variant === "dark" ? "text-slate-900" :
          "text-slate-900 dark:text-white"
        )}>
          Academic
        </span>
        <span className={cn(
          "text-sm font-medium leading-none",
          variant === "light" ? "text-blue-100" :
          variant === "dark" ? "text-slate-600" :
          "text-blue-600 dark:text-blue-400"
        )}>
          CRM
        </span>
      </div>
    </div>
  );
}

// Simplified Logo for small spaces
export function LogoIcon({ className, variant = "default", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 40 40"
        className={cn(
          "w-full h-full",
          variant === "light" ? "text-white" : 
          variant === "dark" ? "text-slate-900" :
          "text-blue-600 dark:text-blue-400"
        )}
        fill="currentColor"
      >
        <path d="M20 5L35 12L20 19L5 12L20 5Z" opacity="0.9" />
        <circle cx="20" cy="10" r="1.5" />
        <path d="M20 10L22 8L24 10L22 12Z" opacity="0.7" />
        <rect x="8" y="22" width="24" height="2" rx="1" opacity="0.8" />
        <rect x="10" y="26" width="20" height="2" rx="1" opacity="0.6" />
        <rect x="12" y="30" width="16" height="2" rx="1" opacity="0.4" />
      </svg>
      
      <div className={cn(
        "absolute inset-0 rounded-full blur-md opacity-20",
        variant === "light" ? "bg-white" :
        variant === "dark" ? "bg-slate-900" :
        "bg-blue-500"
      )} />
    </div>
  );
}