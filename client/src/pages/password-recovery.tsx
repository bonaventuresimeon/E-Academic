import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Phone, Key, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const requestSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
});

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestForm = z.infer<typeof requestSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function PasswordRecovery() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [resetToken, setResetToken] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (data: RequestForm) => {
      const response = await apiRequest("/api/password-recovery/request", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setUserInfo(data.user);
        setStep("reset");
        resetForm.setValue("token", data.resetToken);
      }
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetForm) => {
      const response = await apiRequest("/api/password-recovery/reset", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      setStep("request");
      requestForm.reset();
      resetForm.reset();
      setResetToken("");
      setUserInfo(null);
    },
  });

  const onRequestSubmit = (data: RequestForm) => {
    requestMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetForm) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Password Recovery</h1>
          <p className="text-slate-300">Reset your account password</p>
        </div>

        {step === "request" && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                Request Password Reset
              </CardTitle>
              <CardDescription className="text-slate-300">
                Enter your email address or phone number to receive a reset token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-white">
                    Email or Phone Number
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter email or phone number"
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      {...requestForm.register("identifier")}
                    />
                  </div>
                  {requestForm.formState.errors.identifier && (
                    <p className="text-red-400 text-sm">
                      {requestForm.formState.errors.identifier.message}
                    </p>
                  )}
                </div>

                {requestMutation.error && (
                  <Alert className="bg-red-900/20 border-red-800 text-red-300">
                    <AlertDescription>
                      {(requestMutation.error as any)?.message || "Failed to process request"}
                    </AlertDescription>
                  </Alert>
                )}

                {requestMutation.isSuccess && (
                  <Alert className="bg-green-900/20 border-green-800 text-green-300">
                    <AlertDescription>
                      Reset token generated successfully! Moving to next step...
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Token"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "reset" && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                Reset Password
              </CardTitle>
              <CardDescription className="text-slate-300">
                {userInfo && (
                  <span>
                    Resetting password for: <strong>{userInfo.username}</strong> ({userInfo.email})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-white">
                    Reset Token
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter reset token"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    {...resetForm.register("token")}
                  />
                  {resetForm.formState.errors.token && (
                    <p className="text-red-400 text-sm">
                      {resetForm.formState.errors.token.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    {...resetForm.register("newPassword")}
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-red-400 text-sm">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    {...resetForm.register("confirmPassword")}
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {resetMutation.error && (
                  <Alert className="bg-red-900/20 border-red-800 text-red-300">
                    <AlertDescription>
                      {(resetMutation.error as any)?.message || "Failed to reset password"}
                    </AlertDescription>
                  </Alert>
                )}

                {resetMutation.isSuccess && (
                  <Alert className="bg-green-900/20 border-green-800 text-green-300">
                    <AlertDescription>
                      Password reset successfully! You can now log in with your new password.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("request")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={resetMutation.isPending}
                  >
                    {resetMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Link href="/login">
            <Button variant="link" className="text-slate-300 hover:text-white">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}