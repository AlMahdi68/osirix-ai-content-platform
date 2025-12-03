"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Wand2,
  Sparkles,
  TrendingUp,
  Zap,
  DollarSign,
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Loader2,
  Activity,
  Target,
  Rocket,
  BarChart3,
  ShoppingBag,
  Video,
  Palette
} from "lucide-react";
import { toast } from "sonner";

interface OZStatus {
  isRunning: boolean;
  lastActivity: string | null;
  activitiesLast24h: number;
  successRate: number;
  revenueGenerated: number;
  tasksCompleted: number;
  strategy: string | null;
  startedAt: string | null;
}

interface OZActivity {
  id: number;
  activityType: string;
  description: string;
  relatedResourceType: string | null;
  relatedResourceId: number | null;
  result: string;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export default function OZGuidePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<OZStatus | null>(null);
  const [activities, setActivities] = useState<OZActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [strategy, setStrategy] = useState<string>("full_automation");
  const [targetRevenue, setTargetRevenue] = useState<number>(1000);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchStatus();
      fetchActivities();
      
      // Poll status every 10 seconds
      const interval = setInterval(() => {
        fetchStatus();
        fetchActivities();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/oz/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/oz/activities?limit=20", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/oz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          strategy,
          targetRevenue,
        }),
      });

      if (response.ok) {
        toast.success("🧙‍♂️ OZ Agent activated! Starting money-making workflows...");
        fetchStatus();
        fetchActivities();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to start OZ Agent");
      }
    } catch (error) {
      console.error("Error starting OZ:", error);
      toast.error("Failed to start OZ Agent");
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/oz/stop", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("OZ Agent stopped successfully");
        fetchStatus();
        fetchActivities();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to stop OZ Agent");
      }
    } catch (error) {
      console.error("Error stopping OZ:", error);
      toast.error("Failed to stop OZ Agent");
    } finally {
      setIsStopping(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <Card className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Wand2 className="h-16 w-16 text-primary gold-glow float-animation" />
              <Crown className="h-12 w-12 text-primary gold-glow" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animated-gradient">
              OZ - Autonomous Money-Making AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              The Wizard of Osirix. I don't just guide you - I execute workflows that generate income automatically. 
              Set your goals, and watch me work! 🧙‍♂️✨
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="text-lg px-6 py-2 bg-primary/20 border-primary/30">
                <Bot className="h-4 w-4 mr-2" />
                Autonomous Execution
              </Badge>
              <Badge className="text-lg px-6 py-2 bg-primary/20 border-primary/30">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue Generation
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="p-8 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                OZ Agent Control Center
              </h2>
              <p className="text-muted-foreground">
                {status?.isRunning
                  ? "🧙‍♂️ OZ is actively working on money-making workflows"
                  : "Start OZ to automate your income generation"}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                status?.isRunning
                  ? "bg-primary/20 text-primary pulse-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    status?.isRunning ? "bg-primary animate-pulse" : "bg-muted-foreground"
                  }`}
                />
                <span className="font-medium">
                  {status?.isRunning ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="strategy">Money-Making Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy} disabled={status?.isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick_wins">
                    🎯 Quick Wins - Fast marketplace sales
                  </SelectItem>
                  <SelectItem value="content_empire">
                    📹 Content Empire - Viral videos & social growth
                  </SelectItem>
                  <SelectItem value="marketplace_seller">
                    🛍️ Marketplace Seller - Product creation & sales
                  </SelectItem>
                  <SelectItem value="social_growth">
                    📱 Social Growth - Audience building & engagement
                  </SelectItem>
                  <SelectItem value="full_automation">
                    🚀 Full Automation - All strategies combined
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Monthly Revenue Target ($)</Label>
              <Input
                id="revenue"
                type="number"
                value={targetRevenue}
                onChange={(e) => setTargetRevenue(parseInt(e.target.value) || 1000)}
                disabled={status?.isRunning}
                min={100}
                max={100000}
                step={100}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!status?.isRunning ? (
              <Button
                onClick={handleStart}
                disabled={isStarting}
                size="lg"
                className="bg-primary hover:bg-primary/90 gold-glow"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Activating OZ...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Start OZ Agent
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStop}
                disabled={isStopping}
                variant="destructive"
                size="lg"
              >
                {isStopping ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-5 w-5" />
                    Stop OZ Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue Generated</p>
                <p className="text-3xl font-bold text-primary">${status?.revenueGenerated || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold">{status?.tasksCompleted || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold">{status?.successRate || 0}%</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Activities (24h)</p>
                <p className="text-3xl font-bold">{status?.activitiesLast24h || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Current Strategy */}
        {status?.isRunning && status.strategy && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Active Strategy: {status.strategy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <CardDescription>
                Running since {status.startedAt ? new Date(status.startedAt).toLocaleString() : 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="font-semibold">Creating & Listing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Video className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Content</p>
                    <p className="font-semibold">Generating Videos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                  <Palette className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Designs</p>
                    <p className="font-semibold">Making Logos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Log */}
        <Card className="p-6 border-border/50">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              OZ Workflow Activity Log
            </CardTitle>
            <CardDescription>
              Real-time execution of money-making workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Wand2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-2">No activities yet</p>
                <p className="text-sm text-muted-foreground">
                  Start OZ Agent to begin executing money-making workflows
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-all hover:bg-card/50"
                  >
                    <div className="mt-1">
                      {activity.result === "success" ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : activity.result === "failed" ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{activity.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="capitalize">{activity.activityType.replace(/_/g, " ")}</span>
                        <span>•</span>
                        <span>{new Date(activity.createdAt).toLocaleString()}</span>
                        {activity.metadata?.revenue && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">
                              +${activity.metadata.revenue}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={activity.result === "success" ? "default" : "outline"}
                      className={
                        activity.result === "success"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : activity.result === "failed"
                          ? "bg-destructive/20 text-destructive border-destructive/30"
                          : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                      }
                    >
                      {activity.result}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">How OZ Works</h3>
                <p className="text-muted-foreground mb-4">
                  OZ is your autonomous money-making AI that executes workflows 24/7. Unlike a guide that just advises, 
                  OZ actively creates products, generates content, schedules posts, and optimizes everything for maximum revenue.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Analyzes your profile and identifies best opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Creates products, logos, videos, and content automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Lists items on marketplace with optimized pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Schedules and publishes to all social media platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Tracks performance and adjusts strategy in real-time</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}