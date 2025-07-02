import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import ProfessionalDashboard from "@/pages/professional-dashboard";
import AuthPage from "@/pages/auth-page";
import PasswordRecovery from "@/pages/password-recovery";
import PasswordViewer from "@/pages/password-viewer";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function AuthenticatedDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <ProfessionalDashboard user={user} />;
}

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/password-recovery" component={PasswordRecovery} />
      <Route path="/password-viewer" component={PasswordViewer} />
      
      {/* Main dashboard route */}
      <Route path="/dashboard" component={AuthenticatedDashboard} />
      <Route path="/" component={AuthenticatedDashboard} />
      
      {/* 404 page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;