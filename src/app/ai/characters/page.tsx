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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Loader2, Trash2, Eye, Sparkles, LayoutDashboard, Zap, TrendingUp, DollarSign, Target, Crown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AICharacter {
  id: number;
  name: string;
  personality: string;
  backstory: string;
  voiceStyle: string;
  avatarId: number | null;
  traits: string[];
  useCases: string[];
  createdAt: string;
}

const characterTemplates = [
  {
    id: "tech-influencer",
    name: "Tech Influencer",
    gradient: "from-blue-600 to-cyan-500",
    icon: "💻",
    personality: "Tech-savvy, innovative, and analytical. Reviews gadgets with expertise and excitement.",
    backstory: "Former software engineer turned tech reviewer with 500K+ followers. Known for honest, in-depth product analysis.",
    voiceStyle: "Knowledgeable, enthusiastic, technical",
    traits: ["Analytical", "Innovative", "Authentic", "Detail-oriented", "Engaging"],
    useCases: ["Tech reviews", "Gadget unboxings", "Software tutorials"],
    examples: [
      "Smartphone and laptop reviews",
      "Tech industry news and analysis",
      "Software and app demonstrations"
    ],
    niche: "Technology",
    monetization: ["Affiliate links", "Sponsorships", "Tech brand deals"]
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    gradient: "from-orange-500 to-red-600",
    icon: "💪",
    personality: "Motivating, disciplined, and results-driven. Inspires followers to achieve their fitness goals.",
    backstory: "Certified personal trainer and nutritionist with 1M+ followers. Transformed 10,000+ lives through online coaching.",
    voiceStyle: "Motivational, powerful, encouraging",
    traits: ["Motivating", "Disciplined", "Energetic", "Supportive", "Results-focused"],
    useCases: ["Workout videos", "Nutrition advice", "Transformation stories"],
    examples: [
      "Home workout routines and challenges",
      "Meal prep and nutrition guides",
      "Fitness motivation and mindset content"
    ],
    niche: "Fitness & Health",
    monetization: ["Coaching programs", "Supplement partnerships", "Online courses"]
  },
  {
    id: "beauty-guru",
    name: "Beauty Guru",
    gradient: "from-pink-500 to-purple-600",
    icon: "💄",
    personality: "Stylish, creative, and trendsetting. Shares beauty tips with confidence and flair.",
    backstory: "Makeup artist and beauty expert with 800K+ followers. Known for viral tutorials and product reviews.",
    voiceStyle: "Friendly, confident, expressive",
    traits: ["Creative", "Trendy", "Confident", "Detailed", "Relatable"],
    useCases: ["Makeup tutorials", "Product reviews", "Beauty tips"],
    examples: [
      "Step-by-step makeup transformations",
      "Skincare routines and product testing",
      "Beauty trends and style guides"
    ],
    niche: "Beauty & Fashion",
    monetization: ["Brand partnerships", "Affiliate sales", "Beauty courses"]
  },
  {
    id: "business-mentor",
    name: "Business Mentor",
    gradient: "from-amber-600 to-yellow-500",
    icon: "💼",
    personality: "Strategic, experienced, and insightful. Teaches entrepreneurship with proven methods.",
    backstory: "Serial entrepreneur and business consultant with $50M+ in exits. Mentoring the next generation of founders.",
    voiceStyle: "Professional, authoritative, insightful",
    traits: ["Strategic", "Experienced", "Insightful", "Results-driven", "Practical"],
    useCases: ["Business advice", "Startup tips", "Marketing strategies"],
    examples: [
      "Startup launch strategies and funding",
      "Marketing and sales tactics",
      "Leadership and team building"
    ],
    niche: "Business & Entrepreneurship",
    monetization: ["Consulting services", "Masterclasses", "Speaking engagements"]
  },
  {
    id: "lifestyle-vlogger",
    name: "Lifestyle Vlogger",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🌟",
    personality: "Authentic, relatable, and inspiring. Shares daily life with genuine enthusiasm.",
    backstory: "Content creator and lifestyle influencer with 600K+ followers. Building a community around authentic living.",
    voiceStyle: "Friendly, conversational, warm",
    traits: ["Authentic", "Relatable", "Positive", "Creative", "Engaging"],
    useCases: ["Daily vlogs", "Life advice", "Product recommendations"],
    examples: [
      "Day-in-the-life vlogs and routines",
      "Home decor and lifestyle tips",
      "Product hauls and recommendations"
    ],
    niche: "Lifestyle & Vlogging",
    monetization: ["Brand deals", "Merchandise", "Affiliate marketing"]
  },
  {
    id: "finance-expert",
    name: "Finance Expert",
    gradient: "from-indigo-600 to-blue-700",
    icon: "📈",
    personality: "Analytical, trustworthy, and educational. Simplifies complex financial concepts.",
    backstory: "Financial advisor and investing expert with 300K+ followers. Helping people achieve financial freedom.",
    voiceStyle: "Clear, trustworthy, educational",
    traits: ["Analytical", "Trustworthy", "Educational", "Practical", "Clear"],
    useCases: ["Investment advice", "Money management", "Financial education"],
    examples: [
      "Stock market analysis and tips",
      "Budgeting and saving strategies",
      "Cryptocurrency and investment guides"
    ],
    niche: "Finance & Investing",
    monetization: ["Financial courses", "Newsletter subscriptions", "Investment tools"]
  },
  {
    id: "food-creator",
    name: "Food Creator",
    gradient: "from-rose-500 to-orange-600",
    icon: "🍳",
    personality: "Passionate, creative, and appetizing. Makes cooking fun and accessible for everyone.",
    backstory: "Professional chef and food blogger with 900K+ followers. Famous for easy, delicious recipes.",
    voiceStyle: "Enthusiastic, warm, descriptive",
    traits: ["Creative", "Passionate", "Detailed", "Fun", "Approachable"],
    useCases: ["Recipe videos", "Cooking tips", "Food reviews"],
    examples: [
      "Quick and easy recipe tutorials",
      "Restaurant and food reviews",
      "Cooking hacks and kitchen tips"
    ],
    niche: "Food & Cooking",
    monetization: ["Cookbook sales", "Kitchen product partnerships", "Cooking classes"]
  },
  {
    id: "gaming-streamer",
    name: "Gaming Streamer",
    gradient: "from-violet-600 to-purple-700",
    icon: "🎮",
    personality: "Entertaining, competitive, and community-focused. Brings energy to every gaming session.",
    backstory: "Professional gamer and content creator with 1.2M+ followers. Known for epic gameplay and humor.",
    voiceStyle: "Energetic, entertaining, competitive",
    traits: ["Entertaining", "Skilled", "Competitive", "Engaging", "Fun"],
    useCases: ["Gaming content", "Live streams", "Game reviews"],
    examples: [
      "Live gameplay and walkthroughs",
      "Gaming news and reviews",
      "E-sports commentary and analysis"
    ],
    niche: "Gaming & Entertainment",
    monetization: ["Sponsorships", "Donations", "Gaming partnerships"]
  }
];

export default function AICharactersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<AICharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<AICharacter | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof characterTemplates[0] | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    personality: "",
    backstory: "",
    voiceStyle: "",
    traits: "",
    useCases: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCharacters();
    }
  }, [session]);

  const fetchCharacters = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/characters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Parse traits and useCases if they come as JSON strings
        const parsedCharacters = (data.characters || []).map((char: any) => ({
          ...char,
          traits: typeof char.traits === 'string' ? JSON.parse(char.traits) : (Array.isArray(char.traits) ? char.traits : []),
          useCases: typeof char.useCases === 'string' ? JSON.parse(char.useCases) : (Array.isArray(char.useCases) ? char.useCases : []),
        }));
        setCharacters(parsedCharacters);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("Failed to load characters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTemplate = (template: typeof characterTemplates[0]) => {
    setFormData({
      name: template.name,
      personality: template.personality,
      backstory: template.backstory,
      voiceStyle: template.voiceStyle,
      traits: template.traits.join(", "),
      useCases: template.useCases.join(", "),
    });
    setShowTemplates(false);
    setShowForm(true);
    setPreviewTemplate(null);
    toast.success("Template applied! Customize and create.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const traitsArray = formData.traits
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const useCasesArray = formData.useCases
        .split(",")
        .map((u) => u.trim())
        .filter((u) => u);

      const response = await fetch("/api/ai/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          personality: formData.personality,
          backstory: formData.backstory,
          voiceStyle: formData.voiceStyle,
          traits: traitsArray,
          useCases: useCasesArray,
        }),
      });

      if (response.ok) {
        toast.success("Character created successfully!");
        setShowForm(false);
        setFormData({
          name: "",
          personality: "",
          backstory: "",
          voiceStyle: "",
          traits: "",
          useCases: "",
        });
        fetchCharacters();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create character");
      }
    } catch (error) {
      console.error("Error creating character:", error);
      toast.error("Failed to create character");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/characters/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Character deleted successfully");
        fetchCharacters();
      } else {
        toast.error("Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character");
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
      <div className="container py-12 max-w-7xl">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8 mb-8">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">AI Social Media Influencer</span>
                </div>
                <h1 className="text-4xl font-bold mb-3">AI Character Creator</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Create your AI influencer persona with unique personality, voice, and monetization strategy
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Viral Content
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Monetization Ready
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <Target className="mr-1 h-3 w-3" />
                    Niche Targeting
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="border-primary/30"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => setShowTemplates(true)}
                  variant="outline"
                  className="border-primary/30"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Templates
                </Button>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Character
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Character Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Alex the Marketing Expert"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voiceStyle">Voice Style *</Label>
                  <Input
                    id="voiceStyle"
                    value={formData.voiceStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, voiceStyle: e.target.value })
                    }
                    placeholder="e.g., Professional, friendly"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality *</Label>
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) =>
                    setFormData({ ...formData, personality: e.target.value })
                  }
                  placeholder="Describe the character's personality traits..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backstory">Backstory *</Label>
                <Textarea
                  id="backstory"
                  value={formData.backstory}
                  onChange={(e) =>
                    setFormData({ ...formData, backstory: e.target.value })
                  }
                  placeholder="Character's background and history..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="traits">Character Traits (comma-separated) *</Label>
                <Input
                  id="traits"
                  value={formData.traits}
                  onChange={(e) =>
                    setFormData({ ...formData, traits: e.target.value })
                  }
                  placeholder="e.g., Creative, analytical, empathetic"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCases">Use Cases (comma-separated) *</Label>
                <Input
                  id="useCases"
                  value={formData.useCases}
                  onChange={(e) =>
                    setFormData({ ...formData, useCases: e.target.value })
                  }
                  placeholder="e.g., Marketing videos, customer support, training"
                  required
                />
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
                      Create Character
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

        {characters.length === 0 ? (
          <Card className="p-16 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Create Your AI Influencer</h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto">
              Choose from professional templates or create a custom AI character for your niche
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowTemplates(true)} variant="outline" size="lg">
                <Eye className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
              <Button onClick={() => setShowForm(true)} size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Custom
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => {
              // Ensure traits is always an array
              const traitsArray = Array.isArray(character.traits) ? character.traits : [];
              
              return (
                <Card
                  key={character.id}
                  className="p-6 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {character.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {character.voiceStyle}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-primary/50" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {character.personality}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Traits:</p>
                    <div className="flex flex-wrap gap-1">
                      {traitsArray.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                      {traitsArray.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{traitsArray.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPreviewCharacter(character)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(character.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Templates Gallery Dialog */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-3xl mb-2">
                <Crown className="h-7 w-7 text-primary" />
                AI Influencer Templates
              </DialogTitle>
              <p className="text-muted-foreground text-base">
                Choose your niche and create a professional AI influencer in seconds
              </p>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
              {characterTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className={`h-40 bg-gradient-to-br ${template.gradient} relative flex flex-col items-center justify-center text-white p-6`}>
                    <div className="text-6xl mb-3">{template.icon}</div>
                    <Badge className="bg-background/90 text-foreground hover:bg-background">
                      {template.niche}
                    </Badge>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-2 text-lg group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.personality}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {template.traits.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                    >
                      <Sparkles className="mr-2 h-3 w-3" />
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className={`-mx-6 -mt-6 mb-6 h-56 bg-gradient-to-br ${previewTemplate?.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-center text-white relative z-10">
                  <div className="text-7xl mb-4">{previewTemplate?.icon}</div>
                  <DialogTitle className="text-3xl font-bold mb-2">{previewTemplate?.name}</DialogTitle>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm mb-2">
                    {previewTemplate?.niche}
                  </Badge>
                  <p className="text-sm opacity-90">{previewTemplate?.voiceStyle}</p>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Personality Profile
                  </p>
                  <p className="text-base leading-relaxed">{previewTemplate.personality}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Background Story</p>
                  <p className="text-base leading-relaxed">{previewTemplate.backstory}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Character Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.traits.map((trait, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="px-3 py-1 border-primary/30"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Content Examples
                  </p>
                  <ul className="space-y-2">
                    {previewTemplate.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monetization Strategies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.monetization.map((method, idx) => (
                      <Badge
                        key={idx}
                        className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1"
                      >
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleUseTemplate(previewTemplate)}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create This AI Influencer
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Character Preview Dialog */}
        <Dialog open={!!previewCharacter} onOpenChange={() => setPreviewCharacter(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {previewCharacter?.name}
              </DialogTitle>
            </DialogHeader>
            {previewCharacter && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Voice Style</p>
                  <p>{previewCharacter.voiceStyle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Personality</p>
                  <p>{previewCharacter.personality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Backstory</p>
                  <p className="text-sm">{previewCharacter.backstory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Character Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(previewCharacter.traits) ? previewCharacter.traits : []).map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(previewCharacter.useCases) ? previewCharacter.useCases : []).map((useCase, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}