import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, Users, Brain } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["student", "lecturer", "admin"], {
    required_error: "Please select a role",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "student",
    },
  });

  // Handle redirect after authentication
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  // Don't render forms if user is logged in
  if (user) {
    return (
      <div className="hud-container flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6 animate-pulse" style={{ 
            background: 'var(--primary)', 
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
            boxShadow: 'var(--shadow-glow-primary)'
          }}>
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-glow">System Access Granted</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            INITIALIZING DASHBOARD INTERFACE...
          </p>
          <div className="loading-hud mt-4 h-1 w-48 mx-auto" style={{ background: 'var(--border-primary)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hud-container flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6" style={{ 
              background: 'var(--primary)', 
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
              boxShadow: 'var(--shadow-glow-primary)'
            }}>
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-glow">
              AcademicCRM
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              SECURE ACADEMIC MANAGEMENT INTERFACE
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 gap-2 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="login" 
                className="btn-hud btn-hud-outline data-[state=active]:btn-hud-primary data-[state=active]:text-white"
              >
                SIGN IN
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="btn-hud btn-hud-outline data-[state=active]:btn-hud-primary data-[state=active]:text-white"
              >
                REGISTER
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="card-hud">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-glow">SECURITY ACCESS</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    ENTER AUTHENTICATION CREDENTIALS
                  </p>
                </div>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>USERNAME</FormLabel>
                          <FormControl>
                            <input 
                              className="input-hud" 
                              placeholder="ENTER USERNAME" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>PASSWORD</FormLabel>
                          <FormControl>
                            <input 
                              type="password" 
                              className="input-hud" 
                              placeholder="ENTER PASSWORD" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button 
                      type="submit" 
                      className="btn-hud btn-hud-primary w-full animate-scan animate-energy-pulse"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "AUTHENTICATING..." : "INITIATE ACCESS"}
                    </button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="card-hud">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-glow">NEW USER REGISTRATION</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    INITIALIZE SYSTEM PROFILE
                  </p>
                </div>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>FIRST NAME</FormLabel>
                            <FormControl>
                              <input className="input-hud" placeholder="ENTER FIRST NAME" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>LAST NAME</FormLabel>
                            <FormControl>
                              <input className="input-hud" placeholder="ENTER LAST NAME" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>USERNAME</FormLabel>
                          <FormControl>
                            <input className="input-hud" placeholder="CREATE USERNAME" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>EMAIL ADDRESS</FormLabel>
                          <FormControl>
                            <input type="email" className="input-hud" placeholder="ENTER EMAIL ADDRESS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>PASSWORD</FormLabel>
                          <FormControl>
                            <input type="password" className="input-hud" placeholder="CREATE PASSWORD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>ACCESS LEVEL</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="select-hud">
                                <SelectTrigger className="bg-transparent border-0 focus:ring-0 text-white">
                                  <SelectValue placeholder="SELECT ACCESS LEVEL" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-cyan-500">
                              <SelectItem value="student" className="text-white hover:bg-cyan-500/20">STUDENT</SelectItem>
                              <SelectItem value="lecturer" className="text-white hover:bg-cyan-500/20">LECTURER</SelectItem>
                              <SelectItem value="admin" className="text-white hover:bg-cyan-500/20">ADMINISTRATOR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button 
                      type="submit" 
                      className="btn-hud btn-hud-success w-full animate-gradient-morph animate-circuit"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "REGISTERING USER..." : "REGISTER NEW USER"}
                    </button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Advanced HUD showcase */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0, 212, 255, 0.1) 40px, rgba(0, 212, 255, 0.1) 42px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0, 212, 255, 0.1) 40px, rgba(0, 212, 255, 0.1) 42px)
          `
        }}></div>
        
        <div className="relative flex h-full items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-8 text-glow animate-fade-in">
              ACADEMIC COMMAND CENTER
            </h1>
            
            <div className="space-y-8">
              <div className="card-hud card-hud-interactive animate-slide-left animate-gradient-shift">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0" style={{
                    background: 'var(--primary)',
                    padding: '12px',
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
                  }}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-glow">COURSE MATRIX</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Advanced course deployment and management protocols
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-hud card-hud-interactive animate-slide-right animate-hologram">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0" style={{
                    background: 'var(--success)',
                    padding: '12px',
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
                  }}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-glow">MULTI-TIER ACCESS</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Hierarchical user permission and role management
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-hud card-hud-interactive animate-fade-in animate-matrix-rain animate-energy-pulse">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0" style={{
                    background: 'var(--accent)',
                    padding: '12px',
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
                  }}>
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-glow">AI NEURAL CORE</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Predictive analytics and intelligent automation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="badge-hud badge-hud-primary">SECURE</div>
              </div>
              <div className="text-center">
                <div className="badge-hud badge-hud-success">ACTIVE</div>
              </div>
              <div className="text-center">
                <div className="badge-hud badge-hud-warning">ONLINE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
