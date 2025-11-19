"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Video, Mic, FileVideo, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: number;
  type: string;
  status: string;
  progress: number;
  creditsReserved: number;
  creditsCharged: number | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  inputData: any;
  outputData: any;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const text = formData.get("text") as string;
    const avatarId = formData.get("avatarId") as string;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          inputData: { text, avatarId },
          creditsRequired: type === "tts" ? 10 : type === "video" ? 50 : 100,
        }),
      });

      if (response.ok) {
        toast.success("Job created successfully!");
        setDialogOpen(false);
        fetchJobs();
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create job");
      }
    } catch (error) {
      toast.error("Failed to create job");
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tts":
        return <Mic className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "lipsync":
        return <FileVideo className="h-5 w-5" />;
      default:
        return <Video className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <p className="text-muted-foreground">Manage your content generation tasks</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogDescription>
                  Generate AI content with text-to-speech or video synthesis
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tts">Text-to-Speech (10 credits)</SelectItem>
                      <SelectItem value="video">Video Generation (50 credits)</SelectItem>
                      <SelectItem value="lipsync">Lip-sync Video (100 credits)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Content Text</Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Enter the text to convert..."
                    rows={4}
                    required
                    disabled={creating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarId">Avatar (Optional)</Label>
                  <Input
                    id="avatarId"
                    name="avatarId"
                    placeholder="Avatar ID for video jobs"
                    disabled={creating}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create Job"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getTypeIcon(job.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold capitalize">{job.type} Generation</h3>
                          <Badge variant={job.status === "completed" ? "default" : job.status === "failed" ? "destructive" : "secondary"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Created: {new Date(job.createdAt).toLocaleString()}
                        </p>
                        {job.status === "processing" && (
                          <div className="space-y-2">
                            <Progress value={job.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{job.progress}% complete</p>
                          </div>
                        )}
                        {job.status === "failed" && job.errorMessage && (
                          <p className="text-sm text-red-500 mt-2">{job.errorMessage}</p>
                        )}
                        {job.status === "completed" && (
                          <Button variant="outline" size="sm" className="mt-2">
                            Download Result
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div className="text-right">
                        <p className="text-sm font-medium">{job.creditsReserved} credits</p>
                        <p className="text-xs text-muted-foreground">reserved</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first job to start generating AI content
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
