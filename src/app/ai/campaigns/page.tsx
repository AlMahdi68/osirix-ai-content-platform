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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Loader2, Trash2, Eye, Sparkles, Play, Pause, LayoutDashboard, Zap, Target, Megaphone, ShoppingBag, Users, Award, Rocket } from "lucide-react";
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

const CAMPAIGN_TEMPLATES = [
  {
    id: "product-launch",
    name: "Product Launch",
    icon: Rocket,
    description: "Launch your new product with maximum impact",
    color: "from-blue-500 to-cyan-500",
    goal: "Generate buzz and drive pre-orders for new product launch",
    targetAudience: "Tech enthusiasts, early adopters, age 25-45",
    platforms: ["twitter", "instagram", "linkedin"],
    contentStrategy: "Create excitement with countdown posts, behind-the-scenes content, influencer partnerships, and launch day announcements",
    postsPerDay: "4",
    examplePosts: [
      { type: "Teaser", content: "🚀 Something revolutionary is coming... Get ready for the future of [product category]. Launch in 7 days!", platform: "Twitter" },
      { type: "Behind-the-Scenes", content: "Take a peek at our team working on the final touches. The attention to detail is 🔥", platform: "Instagram" },
      { type: "Announcement", content: "🎉 IT'S HERE! Introducing [Product Name] - the game-changer you've been waiting for. Pre-order now!", platform: "LinkedIn" }
    ]
  },
  {
    id: "brand-awareness",
    name: "Brand Awareness",
    icon: Megaphone,
    description: "Build recognition and reach new audiences",
    color: "from-purple-500 to-pink-500",
    goal: "Increase brand visibility and establish thought leadership",
    targetAudience: "Business professionals, entrepreneurs, decision makers",
    platforms: ["linkedin", "twitter", "facebook"],
    contentStrategy: "Share valuable insights, company culture, success stories, and industry expertise to build trust and authority",
    postsPerDay: "3",
    examplePosts: [
      { type: "Thought Leadership", content: "🎯 5 trends shaping [industry] in 2025. Here's what we're seeing and why it matters...", platform: "LinkedIn" },
      { type: "Company Culture", content: "Behind every great brand is an amazing team. Meet the people who make [brand] special ✨", platform: "Facebook" },
      { type: "Value Sharing", content: "💡 Pro tip: [Valuable industry insight]. This changed everything for our clients.", platform: "Twitter" }
    ]
  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    icon: Target,
    description: "Capture qualified leads and grow your pipeline",
    color: "from-green-500 to-emerald-500",
    goal: "Generate 500+ qualified leads through targeted content and offers",
    targetAudience: "B2B decision makers, marketing managers, CTOs",
    platforms: ["linkedin", "twitter"],
    contentStrategy: "Create valuable gated content, webinar promotions, free trials, and lead magnets with clear CTAs",
    postsPerDay: "3",
    examplePosts: [
      { type: "Lead Magnet", content: "📊 Free Guide: '10 Strategies to [Solve Problem]' Download your copy and transform your [process]", platform: "LinkedIn" },
      { type: "Webinar", content: "🎓 Join our live masterclass: [Topic]. Limited seats! Register now and get exclusive bonuses", platform: "Twitter" },
      { type: "Free Trial", content: "Try [Product] free for 14 days. No credit card required. See why 10,000+ companies trust us.", platform: "LinkedIn" }
    ]
  },
  {
    id: "ecommerce-sales",
    name: "E-commerce Sales",
    icon: ShoppingBag,
    description: "Drive online sales and conversions",
    color: "from-orange-500 to-red-500",
    goal: "Increase online sales by 40% through targeted promotions",
    targetAudience: "Online shoppers, deal seekers, age 22-55",
    platforms: ["instagram", "facebook", "twitter"],
    contentStrategy: "Showcase products with high-quality visuals, limited-time offers, user testimonials, and shoppable posts",
    postsPerDay: "5",
    examplePosts: [
      { type: "Flash Sale", content: "⚡ 24-HOUR FLASH SALE! 30% OFF everything! Use code FLASH30. Shop now before it's gone! 🛍️", platform: "Instagram" },
      { type: "Product Showcase", content: "Meet your new favorite [product]. Premium quality, unbeatable price. Swipe to see it in action! 👉", platform: "Instagram" },
      { type: "Social Proof", content: "⭐⭐⭐⭐⭐ 'Best purchase I've made this year!' - Join 50,000+ happy customers. Link in bio!", platform: "Facebook" }
    ]
  },
  {
    id: "community-building",
    name: "Community Building",
    icon: Users,
    description: "Foster engagement and build loyal community",
    color: "from-yellow-500 to-amber-500",
    goal: "Build an engaged community of 10,000+ active members",
    targetAudience: "Brand enthusiasts, community seekers, all ages",
    platforms: ["instagram", "facebook", "twitter", "linkedin"],
    contentStrategy: "Create conversations, user-generated content campaigns, polls, Q&As, and community challenges",
    postsPerDay: "4",
    examplePosts: [
      { type: "Engagement", content: "❓ Quick poll: What feature should we build next? A) [Option] B) [Option] C) [Option] Your vote matters!", platform: "Twitter" },
      { type: "UGC Campaign", content: "📸 Show us how you use [product]! Share with #[BrandName]Community for a chance to be featured!", platform: "Instagram" },
      { type: "Community Spotlight", content: "🌟 Community Spotlight: Meet [Member] who [achievement]. This is why we love our community!", platform: "Facebook" }
    ]
  },
  {
    id: "event-promotion",
    name: "Event Promotion",
    icon: Award,
    description: "Drive registrations and event attendance",
    color: "from-indigo-500 to-violet-500",
    goal: "Sell out event with 500+ attendees and generate excitement",
    targetAudience: "Industry professionals, event enthusiasts, local community",
    platforms: ["linkedin", "facebook", "twitter", "instagram"],
    contentStrategy: "Build anticipation with speaker announcements, early bird offers, agenda reveals, and countdown content",
    postsPerDay: "3",
    examplePosts: [
      { type: "Speaker Announcement", content: "🎤 Excited to announce [Speaker Name], [Title] will be speaking! Don't miss this incredible session. Tickets → [link]", platform: "LinkedIn" },
      { type: "Early Bird", content: "⏰ EARLY BIRD ENDS TONIGHT! Save 40% on tickets. Join us for [Event] and [benefit]. Register now!", platform: "Twitter" },
      { type: "Countdown", content: "7 DAYS TO GO! 🔥 [Event Name] is almost here. Last chance to grab your spot. See you there! 🎉", platform: "Instagram" }
    ]
  }
];

export default function AICampaignsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<AICampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<AICampaign | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<typeof CAMPAIGN_TEMPLATES[0] | null>(null);

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

  const handleTemplateSelect = (template: typeof CAMPAIGN_TEMPLATES[0]) => {
    setFormData({
      name: template.name + " Campaign",
      goal: template.goal,
      targetAudience: template.targetAudience,
      platforms: template.platforms,
      contentStrategy: template.contentStrategy,
      budget: "",
      postsPerDay: template.postsPerDay,
      status: "planning",
    });
    setShowTemplates(false);
    setShowForm(true);
    toast.success(`${template.name} template loaded!`);
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
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-primary/30"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
              className="border-primary/30 gold-glow"
            >
              <Zap className="mr-2 h-5 w-5" />
              View Templates
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 gold-glow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Campaign Templates Gallery */}
        {showTemplates && (
          <Card className="p-8 mb-8 border-primary/30 gold-glow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Campaign Templates & Style Previews
                </h2>
                <p className="text-muted-foreground mt-1">
                  Choose a proven template to jumpstart your campaign
                </p>
              </div>
              <Button variant="ghost" onClick={() => setShowTemplates(false)}>
                Close
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAMPAIGN_TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Icon className="h-10 w-10 text-primary" />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-1">
                          {template.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded capitalize"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {template.postsPerDay} posts per day
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary"
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        )}

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
            <Button onClick={() => setShowTemplates(true)} variant="outline" className="mr-3">
              <Zap className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
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
                    onClick={() => setPreviewCampaign(campaign)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
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

        {/* Campaign Preview Dialog */}
        <Dialog open={!!previewCampaign} onOpenChange={() => setPreviewCampaign(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {previewCampaign?.name}
              </DialogTitle>
            </DialogHeader>
            {previewCampaign && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Campaign Goal</p>
                  <p>{previewCampaign.goal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                  <p>{previewCampaign.targetAudience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {previewCampaign.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full capitalize"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Content Strategy</p>
                  <p className="text-sm">{previewCampaign.contentStrategy}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Budget</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(previewCampaign.budget / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Posting Schedule</p>
                    <p>{previewCampaign.postingSchedule.postsPerDay} posts per day</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                      previewCampaign.status === "active"
                        ? "bg-primary/20 text-primary"
                        : previewCampaign.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : previewCampaign.status === "paused"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {previewCampaign.status}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {previewTemplate && <previewTemplate.icon className="h-6 w-6 text-primary" />}
                {previewTemplate?.name} Campaign Preview
              </DialogTitle>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                {/* Header with gradient */}
                <div className={`relative p-6 rounded-lg bg-gradient-to-br ${previewTemplate.color} overflow-hidden`}>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{previewTemplate.name}</h3>
                    <p className="text-white/90">{previewTemplate.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Campaign Goal</p>
                    <p className="text-sm">{previewTemplate.goal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                    <p className="text-sm">{previewTemplate.targetAudience}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full capitalize"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Content Strategy</p>
                  <p className="text-sm">{previewTemplate.contentStrategy}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Example Content</p>
                  <div className="space-y-4">
                    {previewTemplate.examplePosts.map((post, idx) => (
                      <Card key={idx} className="p-4 border-primary/20">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {post.type}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {post.platform}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{post.content}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      handleTemplateSelect(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Use This Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}