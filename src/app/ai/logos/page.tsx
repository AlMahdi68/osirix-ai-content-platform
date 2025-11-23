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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wand2, Loader2, Palette, Trash2, Download, LayoutDashboard, Eye, Sparkles, Crown, Gift, Type } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AILogo {
  id: number;
  name: string;
  prompt: string;
  imageUrl: string | null;
  style: string;
  colors: string[];
  status: string;
  createdAt: string;
}

const fontStyles = [
  { value: "modern-sans", label: "Modern Sans", desc: "Clean, contemporary, perfect for tech" },
  { value: "bold-serif", label: "Bold Serif", desc: "Classic, authoritative, professional" },
  { value: "handwritten", label: "Handwritten", desc: "Personal, authentic, creative" },
  { value: "elegant-script", label: "Elegant Script", desc: "Sophisticated, luxury, refined" },
  { value: "geometric", label: "Geometric", desc: "Structured, minimal, modern" },
  { value: "playful-rounded", label: "Playful Rounded", desc: "Friendly, approachable, fun" },
];

const nicheTemplates = [
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    gradient: "from-blue-600 to-cyan-500",
    colors: ["#3B82F6", "#06B6D4", "#1E40AF"],
    prompt: "Modern tech logo with circuit patterns, minimalist geometric shapes, innovation and digital focus",
    fonts: ["modern-sans", "geometric"],
    examples: ["Neural network visualization", "Abstract data flow", "Futuristic tech icon"]
  },
  {
    id: "fitness",
    name: "Fitness & Health",
    icon: "💪",
    gradient: "from-orange-500 to-red-600",
    colors: ["#F97316", "#EF4444", "#DC2626"],
    prompt: "Dynamic fitness logo with movement energy, strength symbols, athletic and motivational design",
    fonts: ["bold-serif", "geometric"],
    examples: ["Muscular silhouette", "Dynamic motion lines", "Power symbol"]
  },
  {
    id: "beauty",
    name: "Beauty & Fashion",
    icon: "💄",
    gradient: "from-pink-500 to-purple-600",
    colors: ["#EC4899", "#A855F7", "#D946EF"],
    prompt: "Elegant beauty logo with feminine curves, luxurious aesthetic, sophisticated makeup theme",
    fonts: ["elegant-script", "modern-sans"],
    examples: ["Lipstick silhouette", "Fashion icon", "Elegant flourish"]
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    gradient: "from-amber-600 to-yellow-500",
    colors: ["#D97706", "#F59E0B", "#B45309"],
    prompt: "Professional business logo with corporate feel, growth symbols, trust and success imagery",
    fonts: ["bold-serif", "modern-sans"],
    examples: ["Upward trending arrow", "Connected network", "Summit achievement"]
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "🌟",
    gradient: "from-emerald-500 to-teal-600",
    colors: ["#10B981", "#14B8A6", "#059669"],
    prompt: "Authentic lifestyle logo with organic shapes, relatable aesthetics, community feeling",
    fonts: ["handwritten", "playful-rounded"],
    examples: ["Heart with home", "Sunshine rays", "Natural leaf"]
  },
  {
    id: "finance",
    name: "Finance",
    icon: "📈",
    gradient: "from-indigo-600 to-blue-700",
    colors: ["#4F46E5", "#1D4ED8", "#3730A3"],
    prompt: "Trustworthy finance logo with stability symbols, growth charts, professional money theme",
    fonts: ["bold-serif", "geometric"],
    examples: ["Upward graph", "Currency symbol", "Shield with coin"]
  },
  {
    id: "food",
    name: "Food & Cooking",
    icon: "🍳",
    gradient: "from-rose-500 to-orange-600",
    colors: ["#F43F5E", "#FB923C", "#EA580C"],
    prompt: "Appetizing food logo with culinary elements, delicious aesthetics, chef-inspired design",
    fonts: ["playful-rounded", "elegant-script"],
    examples: ["Chef hat", "Fork and spoon", "Steaming plate"]
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    gradient: "from-violet-600 to-purple-700",
    colors: ["#7C3AED", "#9333EA", "#6B21A8"],
    prompt: "Dynamic gaming logo with esports energy, controller elements, competitive gaming theme",
    fonts: ["bold-serif", "geometric"],
    examples: ["Game controller", "Trophy emblem", "Power-up icon"]
  },
];

const logoTemplates = [
  {
    id: "modern-tech",
    name: "Modern Tech",
    style: "modern",
    colors: ["#FFD700", "#000000", "#FFFFFF"],
    gradient: "from-yellow-400 to-amber-600",
    prompt: "Sleek modern tech company logo with geometric shapes, clean lines, and minimal design",
    fonts: ["modern-sans", "geometric"],
    examples: [
      "Abstract geometric cube representing innovation",
      "Interconnected nodes symbolizing connectivity",
      "Forward-leaning arrow with circuit patterns"
    ]
  },
  {
    id: "vintage-classic",
    name: "Vintage Classic",
    style: "vintage",
    colors: ["#8B4513", "#F5DEB3", "#2F4F4F"],
    gradient: "from-amber-700 to-orange-900",
    prompt: "Vintage badge-style logo with ornate borders, classic typography, and timeless elegance",
    fonts: ["bold-serif", "elegant-script"],
    examples: [
      "Circular emblem with decorative flourishes",
      "Retro ribbon banner with serif typography",
      "Victorian-style monogram with ornaments"
    ]
  },
  {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    style: "minimalist",
    colors: ["#000000", "#FFFFFF", "#808080"],
    gradient: "from-gray-300 to-gray-600",
    prompt: "Ultra-minimalist logo with simple shapes, negative space, and zen-like simplicity",
    fonts: ["geometric", "modern-sans"],
    examples: [
      "Single continuous line forming abstract shape",
      "Negative space revealing hidden symbol",
      "Simple letter mark with perfect proportions"
    ]
  },
];

export default function AILogosPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [logos, setLogos] = useState<AILogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<AILogo | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNicheGen, setShowNicheGen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof logoTemplates[0] | null>(null);
  const [previewNiche, setPreviewNiche] = useState<typeof nicheTemplates[0] | null>(null);
  const [selectedFont, setSelectedFont] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    prompt: "",
    style: "modern",
    colors: "",
    font: "modern-sans",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchLogos();
    }
  }, [session]);

  const fetchLogos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/logos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogos(data.logos || []);
      }
    } catch (error) {
      console.error("Error fetching logos:", error);
      toast.error("Failed to load logos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const colorsArray = formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      const response = await fetch("/api/ai/logos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          prompt: formData.prompt,
          style: formData.style,
          colors: colorsArray,
          status: "generating",
          font: formData.font,
        }),
      });

      if (response.ok) {
        toast.success("Logo generation started!");
        setShowForm(false);
        setFormData({
          name: "",
          prompt: "",
          style: "modern",
          colors: "",
          font: "modern-sans",
        });
        fetchLogos();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate logo");
      }
    } catch (error) {
      console.error("Error generating logo:", error);
      toast.error("Failed to generate logo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFreeNicheLogo = (niche: typeof nicheTemplates[0]) => {
    setFormData({
      name: `${niche.name} Logo`,
      prompt: niche.prompt,
      style: "modern",
      colors: niche.colors.join(", "),
      font: niche.fonts[0],
    });
    setShowNicheGen(false);
    setShowForm(true);
    setPreviewNiche(null);
    toast.success("Free logo template applied! Customize and generate.");
  };

  const handleUseTemplate = (template: typeof logoTemplates[0]) => {
    setFormData({
      name: `${template.name} Logo`,
      prompt: template.prompt,
      style: template.style,
      colors: template.colors.join(", "),
      font: template.fonts[0],
    });
    setShowTemplates(false);
    setShowForm(true);
    setPreviewTemplate(null);
    toast.success("Template applied! Customize and generate.");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this logo?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/logos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Logo deleted successfully");
        fetchLogos();
      } else {
        toast.error("Failed to delete logo");
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      toast.error("Failed to delete logo");
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
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Professional Logo Design</span>
                </div>
                <h1 className="text-4xl font-bold mb-3">AI Logo Generator</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Create stunning logos with multiple fonts, styles, and niche-specific templates
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <Type className="mr-1 h-3 w-3" />
                    Multiple Fonts
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI-Powered
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                    <Gift className="mr-1 h-3 w-3" />
                    Free Niche Logos
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
                  onClick={() => setShowNicheGen(true)}
                  variant="outline"
                  className="border-primary/30"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Free Logo
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
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Logo
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Logo Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Tech Startup Logo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Design Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  placeholder="Describe your logo: modern tech company logo with geometric shapes..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="style">Style *</Label>
                  <Select
                    value={formData.style}
                    onValueChange={(value) =>
                      setFormData({ ...formData, style: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="geometric">Geometric</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font">Font Style *</Label>
                  <Select
                    value={formData.font}
                    onValueChange={(value) =>
                      setFormData({ ...formData, font: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontStyles.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <div className="py-1">
                            <div className="font-semibold">{font.label}</div>
                            <div className="text-xs text-muted-foreground">{font.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma-separated) *</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) =>
                      setFormData({ ...formData, colors: e.target.value })
                    }
                    placeholder="gold, black, white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Logo
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

        {logos.length === 0 ? (
          <Card className="p-16 text-center border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Palette className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Create Your First Logo</h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto">
              Generate professional logos with AI or choose from niche-specific free templates
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowNicheGen(true)} variant="outline" size="lg">
                <Gift className="mr-2 h-5 w-5" />
                Get Free Logo
              </Button>
              <Button onClick={() => setShowTemplates(true)} variant="outline" size="lg">
                <Eye className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
              <Button onClick={() => setShowForm(true)} size="lg">
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Custom
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {logos.map((logo) => (
              <Card
                key={logo.id}
                className="p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                  {logo.status === "completed" && logo.imageUrl ? (
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : logo.status === "generating" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Generating...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Palette className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Failed
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                    {logo.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {logo.style} style
                  </p>
                </div>

                <div className="flex gap-1 mb-3">
                  {logo.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  {logo.status === "completed" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setPreviewLogo(logo)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(logo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Free Niche Logo Dialog */}
        <Dialog open={showNicheGen} onOpenChange={setShowNicheGen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-3xl mb-2">
                <Gift className="h-7 w-7 text-primary" />
                Free Niche Logo Generator
              </DialogTitle>
              <p className="text-muted-foreground text-base">
                Choose your niche and get a professional logo template for free
              </p>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
              {nicheTemplates.map((niche) => (
                <Card
                  key={niche.id}
                  className="overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => setPreviewNiche(niche)}
                >
                  <div className={`h-40 bg-gradient-to-br ${niche.gradient} relative flex flex-col items-center justify-center text-white p-6`}>
                    <div className="text-6xl mb-3">{niche.icon}</div>
                    <Badge className="bg-primary text-primary-foreground">
                      <Gift className="mr-1 h-3 w-3" />
                      FREE
                    </Badge>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold mb-2 text-lg group-hover:text-primary transition-colors">
                      {niche.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {niche.prompt}
                    </p>
                    <div className="flex gap-1.5 mb-4">
                      {niche.colors.slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-md border-2 border-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFreeNicheLogo(niche);
                      }}
                    >
                      <Wand2 className="mr-2 h-3 w-3" />
                      Use Free Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Niche Preview Dialog */}
        <Dialog open={!!previewNiche} onOpenChange={() => setPreviewNiche(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className={`-mx-6 -mt-6 mb-6 h-56 bg-gradient-to-br ${previewNiche?.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-center text-white relative z-10">
                  <div className="text-7xl mb-4">{previewNiche?.icon}</div>
                  <DialogTitle className="text-3xl font-bold mb-2">{previewNiche?.name}</DialogTitle>
                  <Badge className="bg-primary text-primary-foreground">
                    <Gift className="mr-1 h-3 w-3" />
                    FREE TEMPLATE
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </DialogHeader>
            {previewNiche && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Design Concept</p>
                  <p className="text-base leading-relaxed">{previewNiche.prompt}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Color Palette</p>
                  <div className="flex gap-3">
                    {previewNiche.colors.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-border shadow-md"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Recommended Fonts</p>
                  <div className="flex flex-wrap gap-2">
                    {previewNiche.fonts.map((font, idx) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1">
                        {fontStyles.find(f => f.value === font)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Example Concepts</p>
                  <ul className="space-y-2">
                    {previewNiche.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleFreeNicheLogo(previewNiche)}
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Free Logo
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Templates Gallery Dialog */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Logo Style Templates
              </DialogTitle>
              <p className="text-muted-foreground">
                Explore professional logo styles and get inspired
              </p>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {logoTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className={`h-32 bg-gradient-to-br ${template.gradient} relative flex items-center justify-center`}>
                    <Palette className="h-16 w-16 text-white/80" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 text-lg group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.prompt}
                    </p>
                    <div className="flex gap-1.5 mb-3">
                      {template.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-md border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
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
                      <Wand2 className="mr-2 h-3 w-3" />
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className={`-mx-6 -mt-6 mb-6 h-48 bg-gradient-to-br ${previewTemplate?.gradient} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <Palette className="h-20 w-20 mx-auto mb-4 opacity-90" />
                  <DialogTitle className="text-3xl font-bold">{previewTemplate?.name}</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Style Description</p>
                  <p className="text-base">{previewTemplate.prompt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Color Palette</p>
                  <div className="flex gap-3">
                    {previewTemplate.colors.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-border shadow-md"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Example Concepts</p>
                  <ul className="space-y-2">
                    {previewTemplate.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleUseTemplate(previewTemplate)}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Use This Template
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Logo Preview Dialog */}
        <Dialog open={!!previewLogo} onOpenChange={() => setPreviewLogo(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                {previewLogo?.name}
              </DialogTitle>
            </DialogHeader>
            {previewLogo && (
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {previewLogo.imageUrl && (
                    <img
                      src={previewLogo.imageUrl}
                      alt={previewLogo.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Style</p>
                    <p className="capitalize">{previewLogo.style}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Prompt</p>
                    <p className="text-sm">{previewLogo.prompt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Colors</p>
                    <div className="flex gap-2">
                      {previewLogo.colors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border border-border"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs">{color}</span>
                        </div>
                      ))}
                    </div>
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