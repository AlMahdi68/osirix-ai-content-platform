"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Loader2, Activity, Zap, TrendingUp, CheckCircle2, XCircle, Clock, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

interface AgentStatus {
  isRunning: boolean;
  lastActivity: string | null;
  activitiesLast24h: number;
  successRate: number;
}

interface AgentActivity {
  id: number;
  activityType: string;
  description: string;
  relatedResourceType: string | null;
  relatedResourceId: number | null;
  result: string;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export default function AIManagerPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [mode, setMode] = useState<string>("balanced");

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
      const response = await fetch("/api/ai/agent/status", {
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
      const response = await fetch("/api/ai/agent/activities?limit=20", {
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
      const response = await fetch("/api/ai/agent/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          tasks: ["product_generation", "logo_generation", "campaign_planning"],
        }),
      });

      if (response.ok) {
        toast.success("AI Agent started successfully!");
        fetchStatus();
        fetchActivities();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to start agent");
      }
    } catch (error) {
      console.error("Error starting agent:", error);
      toast.error("Failed to start agent");
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    setIsStopping(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/agent/stop", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("AI Agent stopped successfully!");
        fetchStatus();
        fetchActivities();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to stop agent");
      }
    } catch (error) {
      console.error("Error stopping agent:", error);
      toast.error("Failed to stop agent");
    } finally {
      setIsStopping(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Bot className="h-10 w-10 text-primary gold-glow" />
              AI Manager Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Autonomous AI agent managing your content and campaigns
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-primary/30"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>

        {/* Control Panel */}
        <Card className="p-8 mb-8 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Agent Control</h2>
              <p className="text-muted-foreground">
                {status?.isRunning
                  ? "Your AI agent is currently active"
                  : "Start the AI agent to automate your workflow"}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                status?.isRunning
                  ? "bg-primary/20 text-primary"
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
              <Label htmlFor="mode">Agent Mode</Label>
              <Select value={mode} onValueChange={setMode} disabled={status?.isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">
                    Conservative - Minimal activity
                  </SelectItem>
                  <SelectItem value="balanced">
                    Balanced - Moderate activity
                  </SelectItem>
                  <SelectItem value="aggressive">
                    Aggressive - Maximum activity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            {!status?.isRunning ? (
              <Button
                onClick={handleStart}
                disabled={isStarting}
                className="bg-primary hover:bg-primary/90 gold-glow"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Agent
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStop}
                disabled={isStopping}
                variant="destructive"
              >
                {isStopping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Stop Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Activities (24h)
                </p>
                <p className="text-3xl font-bold">{status?.activitiesLast24h || 0}</p>
              </div>
              <Activity className="h-10 w-10 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold">{status?.successRate || 0}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                <p className="text-lg font-semibold">
                  {status?.lastActivity
                    ? new Date(status.lastActivity).toLocaleTimeString()
                    : "Never"}
                </p>
              </div>
              <Clock className="h-10 w-10 text-primary/50" />
            </div>
          </Card>
        </div>

        {/* Activity Log */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="mt-1">
                    {activity.result === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
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
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.result === "success"
                        ? "bg-primary/20 text-primary"
                        : activity.result === "failed"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {activity.result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}