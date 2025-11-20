"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PlanUsageIndicator from "@/components/autumn/plan-usage-indicator";
import { 
  Coins, 
  Video, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface Stats {
  credits: number;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  avatarsCount: number;
  productsCount: number;
  totalSales: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      const [statsRes, jobsRes] = await Promise.all([
        fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/jobs?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setRecentJobs(jobsData.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats?.credits || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/plans" className="text-primary hover:underline">
                  Buy more credits
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.completedJobs || 0} completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avatars</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.avatarsCount || 0}</div>
                  <Link href="/avatars" className="text-xs text-primary hover:underline mt-1 inline-block">
                    Manage avatars
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.productsCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${((stats?.totalSales || 0) / 100).toFixed(2)} in sales
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Jobs - Take 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Your latest content generation tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : recentJobs.length > 0 ? (
                  <div className="space-y-3">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          {job.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : job.status === "failed" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium capitalize">{job.type} Generation</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm capitalize">{job.status}</span>
                          {job.progress !== undefined && job.status === "processing" && (
                            <span className="text-sm text-muted-foreground">
                              {job.progress}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No jobs yet</p>
                    <Link href="/jobs">
                      <Button>Create Your First Job</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Plan Usage - Take 1 column */}
          <div>
            <PlanUsageIndicator />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}