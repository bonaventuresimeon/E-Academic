import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import MainLayout from "@/components/layout/main-layout";
import StudentDashboard from "@/pages/student-dashboard";
import LecturerDashboard from "@/pages/lecturer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdvancedDashboard from "@/pages/advanced-dashboard";
import Courses from "@/pages/courses";
import Assignments from "@/pages/assignments";
import AIAssistant from "@/pages/ai-assistant";
import Notifications from "@/pages/notifications";
import AuthPage from "@/pages/auth-page";
import PasswordRecovery from "@/pages/password-recovery";
import PasswordViewer from "@/pages/password-viewer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth routes with special layout */}
      <Route path="/auth" component={() => (
        <MainLayout variant="auth">
          <AuthPage />
        </MainLayout>
      )} />
      <Route path="/password-recovery" component={() => (
        <MainLayout variant="auth">
          <PasswordRecovery />
        </MainLayout>
      )} />
      
      {/* Protected dashboard routes */}
      <ProtectedRoute path="/" component={() => (
        <MainLayout variant="dashboard">
          <StudentDashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/dashboard" component={() => (
        <MainLayout variant="dashboard">
          <StudentDashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/lecturer-dashboard" component={() => (
        <MainLayout variant="dashboard">
          <LecturerDashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/admin-dashboard" component={() => (
        <MainLayout variant="dashboard">
          <AdminDashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/advanced-dashboard" component={() => (
        <MainLayout variant="dashboard">
          <AdvancedDashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/courses" component={() => (
        <MainLayout variant="dashboard">
          <Courses />
        </MainLayout>
      )} />
      <ProtectedRoute path="/assignments" component={() => (
        <MainLayout variant="dashboard">
          <Assignments />
        </MainLayout>
      )} />
      <ProtectedRoute path="/ai-assistant" component={() => (
        <MainLayout variant="dashboard">
          <AIAssistant />
        </MainLayout>
      )} />
      <ProtectedRoute path="/notifications" component={() => (
        <MainLayout variant="dashboard">
          <Notifications />
        </MainLayout>
      )} />
      <ProtectedRoute path="/password-viewer" component={() => (
        <MainLayout variant="dashboard">
          <PasswordViewer />
        </MainLayout>
      )} />
      
      {/* 404 page */}
      <Route component={() => (
        <MainLayout variant="public">
          <NotFound />
        </MainLayout>
      )} />
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