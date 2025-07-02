import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import UniversityDashboard from "@/pages/university-dashboard";
import AuthPage from "@/pages/auth-page";
import PasswordRecovery from "@/pages/password-recovery";
import PasswordViewer from "@/pages/password-viewer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/password-recovery" component={PasswordRecovery} />
      
      {/* Protected university dashboard - comprehensive academic management */}
      <ProtectedRoute path="/" component={UniversityDashboard} />
      <ProtectedRoute path="/dashboard" component={UniversityDashboard} />
      
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