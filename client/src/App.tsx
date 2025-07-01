import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import LecturerDashboard from "@/pages/lecturer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Courses from "@/pages/courses";
import Assignments from "@/pages/assignments";
import AIAssistant from "@/pages/ai-assistant";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={StudentDashboard} />
      <ProtectedRoute path="/dashboard" component={StudentDashboard} />
      <ProtectedRoute path="/lecturer-dashboard" component={LecturerDashboard} />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/courses" component={Courses} />
      <ProtectedRoute path="/assignments" component={Assignments} />
      <ProtectedRoute path="/ai-assistant" component={AIAssistant} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
