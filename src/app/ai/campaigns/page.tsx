"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Loader2, Trash2, Eye, Sparkles, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface AICampaign {
  id: number;
  name: string;
  goal: string;
  targetAudience: string;
  platforms: string[];
  contentStrategy: string;
  postingSchedule: Record<string, any>;
  budget: number;
  status: string;
  performanceMetrics: Record<string, any> | null;
  createdAt: string;
}

const PLATFORMS = [
  { id: "twitter", label: "Twitter" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
];

export default function AICampaignsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<AICampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    targetAudience: "",
    platforms: [] as string[],
    contentStrategy: "",
    budget: "",
    postsPerDay: "3",
    status: "planning",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCampaigns();
    }
  }, [session]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/campaigns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          goal: formData.goal,
          targetAudience: formData.targetAudience,
          platforms: formData.platforms,
          contentStrategy: formData.contentStrategy,
          postingSchedule: {
            postsPerDay: parseInt(formData.postsPerDay),
            timezone: "UTC",
          },
          budget: parseInt(formData.budget) * 100,
          status: formData.status,
        }),
      });

      if (response.ok) {
        toast.success("Campaign created successfully!");
        setShowForm(false);
        setFormData({
          name: "",
          goal: "",
          targetAudience: "",
          platforms: [],
          contentStrategy: "",
          budget: "",
          postsPerDay: "3",
          status: "planning",
        });
        fetchCampaigns();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/campaigns/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Campaign ${newStatus}`);
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Campaign deleted successfully");
        fetchCampaigns();
      } else {
        toast.error("Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
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
              <TrendingUp className="h-10 w-10 text-primary gold-glow" />
              AI Digital Marketer
            </h1>
            <p className="text-muted-foreground text-lg">
              Plan and execute marketing campaigns with AI
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 gold-glow"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Create Campaign
          </Button>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30 gold-glow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Product Launch Campaign"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Campaign Goal *</Label>
                <Textarea
                  id="goal"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  placeholder="What do you want to achieve with this campaign?"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Input
                  id="audience"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  placeholder="e.g., Entrepreneurs, tech enthusiasts, age 25-45"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Platforms *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PLATFORMS.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={formData.platforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <label
                        htmlFor={platform.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {platform.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Content Strategy *</Label>
                <Textarea
                  id="strategy"
                  value={formData.contentStrategy}
                  onChange={(e) =>
                    setFormData({ ...formData, contentStrategy: e.target.value })
                  }
                  placeholder="Describe your content strategy and approach..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postsPerDay">Posts Per Day</Label>
                  <Select
                    value={formData.postsPerDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, postsPerDay: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 post</SelectItem>
                      <SelectItem value="2">2 posts</SelectItem>
                      <SelectItem value="3">3 posts</SelectItem>
                      <SelectItem value="4">4 posts</SelectItem>
                      <SelectItem value="5">5 posts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Campaign
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {campaigns.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-powered marketing campaign
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold">{campaign.name}</h3>
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-primary/20 text-primary"
                            : campaign.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : campaign.status === "paused"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {campaign.goal}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {campaign.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded capitalize"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Target: {campaign.targetAudience} • Budget: $
                      {(campaign.budget / 100).toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary/50" />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/ai/campaigns/${campaign.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                  {campaign.status === "planning" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(campaign.id, "active")}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  )}
                  {campaign.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(campaign.id, "paused")}
                    >
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
