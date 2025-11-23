"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PlanUsageIndicator from "@/components/autumn/plan-usage-indicator";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { 
  Coins, 
  Video, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      
      <DashboardLayout>
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Professional Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Your AI-powered content creation platform. Generate professional videos, logos, and digital products with advanced AI technology.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-1">{stats?.credits || 0}</div>
                    <Link href="/plans" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Buy more credits
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-1">{stats?.totalJobs || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.completedJobs || 0} completed · {stats?.failedJobs || 0} failed
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avatars</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-1">{stats?.avatarsCount || 0}</div>
                    <Link href="/avatars" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      Manage avatars →
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Marketplace</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-1">{stats?.productsCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      ${((stats?.totalSales || 0) / 100).toFixed(2)} in sales
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Jobs */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Recent Jobs
                  </CardTitle>
                  <CardDescription>Your latest content generation tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : recentJobs.length > 0 ? (
                    <div className="space-y-3">
                      {recentJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-card/50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              job.status === "completed" 
                                ? "bg-primary/10 border border-primary/20" 
                                : job.status === "failed" 
                                ? "bg-destructive/10 border border-destructive/20"
                                : "bg-muted border border-border"
                            }`}>
                              {job.status === "completed" ? (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              ) : job.status === "failed" ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{job.type} Generation</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className={`text-sm font-medium capitalize ${
                                job.status === "completed" 
                                  ? "text-primary" 
                                  : job.status === "failed" 
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              }`}>
                                {job.status}
                              </span>
                              {job.progress !== undefined && job.status === "processing" && (
                                <p className="text-xs text-muted-foreground">
                                  {job.progress}%
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Video className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-4 text-lg">No jobs yet</p>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        Start creating professional AI-generated content with advanced features
                      </p>
                      <Link href="/jobs">
                        <Button className="bg-primary hover:bg-primary/90">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Your First Job
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Plan Usage */}
            <div>
              <PlanUsageIndicator />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}