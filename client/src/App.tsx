import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import ModernDashboard from "@/pages/modern-dashboard";
import AuthPage from "@/pages/auth-page";
import PasswordRecovery from "@/pages/password-recovery";
import PasswordViewer from "@/pages/password-viewer";
import NotFound from "@/pages/not-found";
import { AdvancedFooter } from "./components/advanced-footer";

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/password-recovery" component={PasswordRecovery} />
      
      {/* Protected modern dashboard - EduLearn design */}
      <ProtectedRoute path="/" component={ModernDashboard} />
      <ProtectedRoute path="/dashboard" component={ModernDashboard} />
      
      {/* Admin tools */}
      <ProtectedRoute path="/password-viewer" component={PasswordViewer} />
      
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