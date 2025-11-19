"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Database, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText
} from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
            <p className="text-muted-foreground">System management and monitoring</p>
          </div>
        </div>

        {/* System Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +180 new this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">Operational</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All systems running
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">147</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Processing now
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Require attention
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))
                  ) : (
                    [
                      { name: "John Doe", email: "john@example.com", plan: "Pro", status: "active" },
                      { name: "Jane Smith", email: "jane@example.com", plan: "Enterprise", status: "active" },
                      { name: "Bob Johnson", email: "bob@example.com", plan: "Starter", status: "suspended" },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge>{user.plan}</Badge>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Queue Management</CardTitle>
                <CardDescription>Monitor and manage content generation jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Job queue monitoring interface</p>
                  <p className="text-sm">View processing, completed, and failed jobs</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Moderation</CardTitle>
                <CardDescription>Review and approve marketplace products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Product approval interface</p>
                  <p className="text-sm">Pending products awaiting review</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage system settings and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">ElevenLabs API</p>
                      <p className="text-sm text-muted-foreground">Text-to-speech integration</p>
                    </div>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Stripe Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">Payment processing</p>
                    </div>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Storage Provider</p>
                      <p className="text-sm text-muted-foreground">File storage service</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Job Queue (Redis)</p>
                      <p className="text-sm text-muted-foreground">Background job processing</p>
                    </div>
                    <Badge variant="default">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>System activity and audit trail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-sm">
                  {[
                    { time: "2024-03-15 14:32:10", event: "User login", user: "john@example.com", level: "info" },
                    { time: "2024-03-15 14:28:45", event: "Job completed", user: "system", level: "success" },
                    { time: "2024-03-15 14:15:22", event: "Payment processed", user: "jane@example.com", level: "info" },
                    { time: "2024-03-15 14:02:18", event: "Job failed", user: "system", level: "error" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded text-xs">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-muted-foreground">[{log.time}]</span>
                          <Badge 
                            variant={
                              log.level === "error" ? "destructive" : 
                              log.level === "success" ? "default" : 
                              "secondary"
                            }
                            className="text-xs"
                          >
                            {log.level}
                          </Badge>
                        </div>
                        <p>{log.event} - {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
