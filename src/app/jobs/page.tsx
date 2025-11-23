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
import { 
  Plus, 
  Video, 
  Mic, 
  FileVideo, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Play,
  Image as ImageIcon,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const voiceStyles = [
  { value: "professional", label: "Professional Speaker", desc: "Clear, authoritative, perfect for business content" },
  { value: "friendly", label: "Friendly Educator", desc: "Warm, patient, ideal for tutorials" },
  { value: "energetic", label: "Energetic Host", desc: "Dynamic, engaging, great for entertainment" },
  { value: "calm", label: "Calming Narrator", desc: "Soothing, serene, perfect for meditation" },
  { value: "expert", label: "Tech Expert", desc: "Knowledgeable, precise, ideal for tech content" },
  { value: "motivational", label: "Motivational Coach", desc: "Inspiring, empowering, great for fitness" },
];

const videoExamples = [
  {
    title: "Product Review",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80",
    duration: "2:30",
    type: "Professional",
    desc: "Tech product unboxing and review"
  },
  {
    title: "Tutorial Video",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
    duration: "5:15",
    type: "Educational",
    desc: "Step-by-step software tutorial"
  },
  {
    title: "Social Media Ad",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    duration: "0:30",
    type: "Marketing",
    desc: "Promotional content for Instagram"
  },
  {
    title: "Motivational Speech",
    thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
    duration: "3:00",
    type: "Inspirational",
    desc: "Daily motivation and mindset"
  },
];

const qualityRequirements = [
  "✓ Resolution: 1080p minimum (1920x1080)",
  "✓ Frame Rate: 30fps constant",
  "✓ Format: MP4 (H.264 codec)",
  "✓ Lighting: Well-lit, front-facing",
  "✓ Duration: 10-60 seconds optimal",
  "✓ Audio: Clean, no background noise"
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
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
    const voiceStyle = formData.get("voiceStyle") as string;

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
          inputData: { text, avatarId, voiceStyle },
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
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tts":
        return <Mic className="h-5 w-5 text-primary" />;
      case "video":
        return <Video className="h-5 w-5 text-primary" />;
      case "lipsync":
        return <FileVideo className="h-5 w-5 text-primary" />;
      default:
        return <Video className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Advanced AI Generation</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">Content Generation</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Create professional AI-generated content with enterprise-grade quality controls
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Create New Generation Job
                    </DialogTitle>
                    <DialogDescription>
                      Generate professional AI content with advanced voice and video synthesis
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateJob} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-base font-semibold">Job Type</Label>
                      <Select name="type" required>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select generation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tts">
                            <div className="flex items-center gap-3 py-2">
                              <Mic className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">Text-to-Speech</div>
                                <div className="text-xs text-muted-foreground">10 credits • ElevenLabs Premium</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-3 py-2">
                              <Video className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">Video Generation</div>
                                <div className="text-xs text-muted-foreground">50 credits • Full HD 1080p</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="lipsync">
                            <div className="flex items-center gap-3 py-2">
                              <FileVideo className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">Lip-sync Video</div>
                                <div className="text-xs text-muted-foreground">100 credits • Wav2Lip Advanced</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voiceStyle" className="text-base font-semibold">Voice Style</Label>
                      <Select name="voiceStyle" value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose voice personality" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceStyles.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value}>
                              <div className="py-2">
                                <div className="font-semibold">{voice.label}</div>
                                <div className="text-xs text-muted-foreground">{voice.desc}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text" className="text-base font-semibold">Content Text</Label>
                      <Textarea
                        id="text"
                        name="text"
                        placeholder="Enter your script... Text will be automatically cleaned: numbers converted, acronyms expanded, and misspellings corrected."
                        rows={6}
                        required
                        disabled={creating}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        ✓ Auto text scrubbing • ✓ Number conversion • ✓ Acronym expansion
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatarId" className="text-base font-semibold">Avatar (Optional)</Label>
                      <Input
                        id="avatarId"
                        name="avatarId"
                        placeholder="Avatar ID for video jobs"
                        disabled={creating}
                        className="h-12"
                      />
                    </div>

                    <Alert className="border-primary/30 bg-primary/5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        <div className="font-semibold mb-2">Quality Requirements:</div>
                        <div className="space-y-1 text-xs">
                          {qualityRequirements.map((req, idx) => (
                            <div key={idx}>{req}</div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1 h-12" disabled={creating}>
                        {creating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create Job
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowExamples(true)} className="h-12">
                        <Play className="mr-2 h-4 w-4" />
                        View Examples
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Video Examples Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  Example Generations
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  See what you can create with our advanced AI pipeline
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Crown className="mr-1 h-3 w-3" />
                Pro Quality
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoExamples.map((example, idx) => (
                <Card key={idx} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all group">
                  <div className="relative aspect-video bg-muted">
                    <img 
                      src={example.thumbnail} 
                      alt={example.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Play className="h-6 w-6 text-background ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                      {example.duration}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{example.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{example.desc}</p>
                    <Badge variant="outline" className="text-xs">{example.type}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Jobs
            </h3>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                            {getTypeIcon(job.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold capitalize group-hover:text-primary transition-colors">
                                {job.type} Generation
                              </h3>
                              <Badge 
                                variant={
                                  job.status === "completed" ? "default" : 
                                  job.status === "failed" ? "destructive" : 
                                  "secondary"
                                }
                              >
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
                              <Alert variant="destructive" className="mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{job.errorMessage}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusIcon(job.status)}
                          <div className="text-right">
                            <p className="text-sm font-semibold">{job.creditsReserved}</p>
                            <p className="text-xs text-muted-foreground">credits</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-16 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Video className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No jobs yet</h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto">
              Create your first AI generation job with professional quality controls
            </p>
            <Button size="lg" onClick={() => setDialogOpen(true)}>
              <Sparkles className="h-5 w-5 mr-2" />
              Create Your First Job
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}