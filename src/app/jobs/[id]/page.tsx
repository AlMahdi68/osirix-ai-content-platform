"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Video, 
  Mic, 
  FileVideo, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Download,
  Calendar,
  Coins,
  AlertCircle
} from "lucide-react";
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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
    const interval = setInterval(fetchJob, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      } else {
        toast.error("Job not found");
        router.push("/jobs");
      }
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30";
      case "failed":
        return "from-red-500/20 to-rose-500/20 border-red-500/30";
      case "processing":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
      default:
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tts":
        return <Mic className="h-8 w-8 text-primary" />;
      case "video":
        return <Video className="h-8 w-8 text-primary" />;
      case "lipsync":
        return <FileVideo className="h-8 w-8 text-primary" />;
      default:
        return <Video className="h-8 w-8 text-primary" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "failed":
        return <XCircle className="h-12 w-12 text-red-500" />;
      case "processing":
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-12 w-12 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Job not found</h3>
          <Button onClick={() => router.push("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/jobs")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Job Details</h2>
              <p className="text-muted-foreground">Track your content generation progress</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className={`bg-gradient-to-br ${getStatusColor(job.status)} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {getStatusIcon(job.status)}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold capitalize">{job.type} Generation</h3>
                    <Badge 
                      variant={job.status === "completed" ? "default" : job.status === "failed" ? "destructive" : "secondary"}
                      className="text-lg px-4 py-1"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Job ID: #{job.id}
                  </p>
                </div>
              </div>
              {job.status === "completed" && (
                <Button size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Download Result
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {job.status === "processing" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Processing...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={job.progress} className="h-4" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{job.progress}% complete</span>
                  <span className="font-medium">{100 - job.progress}% remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {job.status === "failed" && job.errorMessage && (
          <Card className="border-red-500/30 bg-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <XCircle className="h-5 w-5" />
                Error Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{job.errorMessage}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTypeIcon(job.type)}
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="capitalize">{job.type}</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Status</span>
                <Badge 
                  variant={job.status === "completed" ? "default" : job.status === "failed" ? "destructive" : "secondary"}
                  className="capitalize"
                >
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="font-medium">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>
              {job.completedAt && (
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </span>
                  <span className="font-medium">
                    {new Date(job.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Credits Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Reserved</span>
                <span className="font-bold text-lg text-primary">{job.creditsReserved}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Charged</span>
                <span className="font-bold text-lg">
                  {job.creditsCharged !== null ? job.creditsCharged : "-"}
                </span>
              </div>
              {job.status === "completed" && job.creditsCharged !== null && (
                <div className="flex items-center justify-between py-3 bg-primary/10 rounded-lg px-4">
                  <span className="font-medium">Refunded</span>
                  <span className="font-bold text-green-500">
                    {job.creditsReserved - job.creditsCharged}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Input Data */}
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(job.inputData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Output Data */}
        {job.outputData && (
          <Card>
            <CardHeader>
              <CardTitle>Output Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(job.outputData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
