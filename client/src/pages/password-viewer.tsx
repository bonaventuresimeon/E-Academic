import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Key, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PasswordViewer() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Loading users...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="bg-red-900/20 border-red-800 text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading users: {(error as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Eye className="w-8 h-8" />
            Password Viewer (Development Only)
          </h1>
          <p className="text-slate-300">View user login credentials for testing</p>
        </div>

        <Alert className="bg-yellow-900/20 border-yellow-800 text-yellow-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Development Tool Only:</strong> This page shows encrypted password hashes. 
            In a real application, passwords would never be displayed or retrievable.
          </AlertDescription>
        </Alert>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              User Accounts
            </CardTitle>
            <CardDescription className="text-slate-300">
              Current user accounts in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">ID</TableHead>
                  <TableHead className="text-slate-300">Username</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Phone</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Password Hash</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id} className="border-slate-700">
                      <TableCell className="text-white">{user.id}</TableCell>
                      <TableCell className="text-white font-medium">{user.username}</TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell className="text-slate-300">{user.phoneNumber || "Not set"}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            user.role === "admin" 
                              ? "bg-red-600 hover:bg-red-700" 
                              : user.role === "lecturer"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-green-600 hover:bg-green-700"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 font-mono text-xs max-w-xs truncate">
                        {user.password.substring(0, 30)}...
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            <strong>Note:</strong> For password recovery testing, use your email or any phone number you add to your profile.
            The system will generate a reset token that you can copy and use in the password recovery form.
          </p>
        </div>
      </div>
    </div>
  );
}