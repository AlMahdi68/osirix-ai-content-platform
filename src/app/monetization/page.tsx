"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  Target,
  Megaphone,
  BookOpen,
  Rocket,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const affiliatePrograms = [
  {
    name: "Amazon Associates",
    category: "E-commerce",
    commission: "1-10%",
    description: "World's largest online marketplace",
    url: "https://affiliate-program.amazon.com/",
  },
  {
    name: "ShareASale",
    category: "Affiliate Network",
    commission: "5-20%",
    description: "Thousands of merchants and products",
    url: "https://www.shareasale.com/",
  },
  {
    name: "ClickBank",
    category: "Digital Products",
    commission: "50-75%",
    description: "Digital products and online courses",
    url: "https://www.clickbank.com/",
  },
  {
    name: "CJ Affiliate",
    category: "Affiliate Network",
    commission: "Variable",
    description: "Commission Junction - premium brands",
    url: "https://www.cj.com/",
  },
];

const ctaTemplates = [
  {
    id: "urgent",
    name: "Urgent Action",
    style: "bold",
    example: "⚡ Limited Time: Get 50% OFF Today! Click Now →",
    variants: [
      "⏰ Only 24 Hours Left! Grab Your Discount →",
      "🔥 Flash Sale Ending Soon! Don't Miss Out →",
      "⚡ Last Chance! Save Big Before It's Gone →"
    ]
  },
  {
    id: "benefit",
    name: "Benefit-Focused",
    style: "value",
    example: "✨ Transform Your Life in 30 Days! Start Free Trial →",
    variants: [
      "🎯 Achieve Your Goals Faster - Try It Now →",
      "💪 Get Results You've Always Wanted →",
      "🚀 Unlock Your Full Potential Today →"
    ]
  },
  {
    id: "social-proof",
    name: "Social Proof",
    style: "trust",
    example: "⭐ Join 10,000+ Happy Customers! See Why They Love Us →",
    variants: [
      "👥 Trusted by Industry Leaders - Learn More →",
      "🏆 Award-Winning Solution - Get Started →",
      "💯 4.9/5 Stars from 5,000+ Reviews - Try Now →"
    ]
  },
  {
    id: "curiosity",
    name: "Curiosity Driver",
    style: "intrigue",
    example: "🤔 The Secret Top Performers Don't Want You to Know →",
    variants: [
      "🔍 Discover What Everyone's Talking About →",
      "💡 Learn the Trick That Changed Everything →",
      "🎁 Unlock Hidden Feature Most People Miss →"
    ]
  },
  {
    id: "simple",
    name: "Simple & Direct",
    style: "clean",
    example: "👉 Click Here to Get Started",
    variants: [
      "▶️ Start Your Journey Now",
      "✓ Get Instant Access Today",
      "→ Learn More and Join Us"
    ]
  },
  {
    id: "exclusive",
    name: "Exclusive Offer",
    style: "premium",
    example: "🌟 VIP Access: Members-Only Pricing Inside →",
    variants: [
      "👑 Premium Members Get 40% More →",
      "🎯 Exclusive Deal for You - Claim Now →",
      "💎 Private Invitation - Limited Spots →"
    ]
  }
];

const monetizationBlueprints = [
  {
    id: "influencer-starter",
    title: "AI Influencer Starter Blueprint",
    difficulty: "Beginner",
    timeToProfit: "7-14 days",
    potentialEarnings: "$500-2,000/month",
    description: "Launch your AI social media influencer and start earning from day one",
    steps: [
      "Create AI character with unique personality (use Character Creator)",
      "Generate 30 days of content using AI tools",
      "Set up social media accounts (Instagram, TikTok, YouTube)",
      "Schedule automated posting (3-5 posts per day)",
      "Apply for brand sponsorships (minimum 1,000 followers)",
      "Join affiliate programs and add links to bio",
      "Engage with audience using AI responses",
      "Track performance and optimize content"
    ],
    requiredTools: ["AI Character Creator", "Social Scheduler", "Logo Generator"],
    keyMetrics: ["Follower Growth", "Engagement Rate", "Sponsorship Revenue"],
    successStories: "Sarah made $1,200 in her first month with an AI fitness influencer"
  },
  {
    id: "product-marketplace",
    title: "Digital Product Empire Blueprint",
    difficulty: "Intermediate",
    timeToProfit: "3-7 days",
    potentialEarnings: "$1,000-5,000/month",
    description: "Build and sell AI-generated digital products at scale",
    steps: [
      "Identify profitable niches (voice packs, templates, avatars)",
      "Generate 10-20 products using AI tools",
      "Create professional preview images and demos",
      "List products in marketplace with optimized descriptions",
      "Set competitive pricing ($10-$200 per product)",
      "Promote products on social media channels",
      "Offer bundle deals to increase average order value",
      "Reinvest profits into paid advertising"
    ],
    requiredTools: ["AI Product Creator", "Logo Generator", "Marketplace Access"],
    keyMetrics: ["Product Sales", "Average Order Value", "Customer Reviews"],
    successStories: "Mike's voice pack bundle generates $3,500+ monthly passive income"
  },
  {
    id: "content-agency",
    title: "AI Content Agency Blueprint",
    difficulty: "Advanced",
    timeToProfit: "14-30 days",
    potentialEarnings: "$5,000-15,000/month",
    description: "Start an agency offering AI-powered content creation services",
    steps: [
      "Define service packages (video creation, social media, logos)",
      "Create portfolio with 10+ sample projects",
      "Set up professional website/landing page",
      "Price services competitively ($500-$2,000 per project)",
      "Reach out to 50+ potential clients",
      "Deliver first projects using Osirix tools",
      "Collect testimonials and case studies",
      "Scale with recurring monthly retainers"
    ],
    requiredTools: ["All AI Tools", "Social Scheduler", "Video Generator"],
    keyMetrics: ["Client Acquisition Cost", "Monthly Recurring Revenue", "Client Retention"],
    successStories: "Alex's agency now serves 12 clients with $8,000 MRR using only Osirix"
  },
  {
    id: "sponsorship-income",
    title: "Brand Sponsorship Mastery Blueprint",
    difficulty: "Intermediate",
    timeToProfit: "21-45 days",
    potentialEarnings: "$2,000-10,000/month",
    description: "Build a portfolio of brand deals and sponsored content",
    steps: [
      "Build audience to 10,000+ followers using AI content",
      "Create media kit showcasing reach and engagement",
      "Apply to 20+ sponsorship opportunities weekly",
      "Negotiate rates ($500-$5,000 per campaign)",
      "Deliver high-quality sponsored content",
      "Maintain 4.8+ rating for repeat deals",
      "Upsell brands on additional placements",
      "Build long-term partnership relationships"
    ],
    requiredTools: ["AI Character Creator", "Video Generator", "Social Scheduler"],
    keyMetrics: ["Active Sponsorships", "Average Deal Size", "Repeat Rate"],
    successStories: "Emma secured 5 recurring brand deals worth $6,500/month combined"
  },
  {
    id: "affiliate-mastery",
    title: "Affiliate Marketing Powerhouse Blueprint",
    difficulty: "Beginner",
    timeToProfit: "7-21 days",
    potentialEarnings: "$1,000-8,000/month",
    description: "Master affiliate marketing with AI-generated content",
    steps: [
      "Join 10+ high-converting affiliate programs",
      "Create AI influencer in your niche",
      "Generate product review content (30+ pieces)",
      "Add affiliate links to all content",
      "Use AI to create compelling CTAs",
      "A/B test different promotional approaches",
      "Scale with paid traffic (ads)",
      "Track conversions and optimize campaigns"
    ],
    requiredTools: ["AI Character Creator", "CTA Templates", "Social Scheduler"],
    keyMetrics: ["Click-Through Rate", "Conversion Rate", "Commission Earned"],
    successStories: "David earns $4,200/month promoting tech products with AI content"
  }
];

export default function MonetizationPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState<string>("");
  const [customCTA, setCustomCTA] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(ctaTemplates[0]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState(monetizationBlueprints[0]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(""), 2000);
  };

  const generateCTA = () => {
    if (!productName) {
      toast.error("Please enter a product name");
      return;
    }

    const cta = `${selectedTemplate.example.split("!")[0]}! Get ${productName} →`;
    setCustomCTA(cta);
  };

  const generateAffiliatePost = () => {
    if (!affiliateLink || !productName) {
      toast.error("Please fill in all fields");
      return;
    }

    const post = `🎯 I've been using ${productName} and the results are incredible!\n\n✨ Here's what I love:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\n👉 Check it out here: ${affiliateLink}\n\n💡 Pro tip: [Your recommendation]\n\n#affiliate #${productName.replace(/\s+/g, '')}`;
    
    setCustomCTA(post);
    toast.success("Affiliate post generated!");
  };

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <DollarSign className="h-10 w-10 text-primary gold-glow" />
              Monetization Tools
            </h1>
            <p className="text-muted-foreground text-lg">
              Maximize your earnings with affiliate links, CTAs, and proven blueprints
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

        <Tabs defaultValue="blueprints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
            <TabsTrigger value="cta">CTA Templates</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate Programs</TabsTrigger>
            <TabsTrigger value="generator">Content Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="blueprints" className="space-y-6">
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-green-500/10 to-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Monetization Blueprints</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Step-by-step strategies used by successful creators to earn $500-$15,000/month
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {monetizationBlueprints.map((blueprint) => (
                  <Card 
                    key={blueprint.id} 
                    className="p-6 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => setSelectedBlueprint(blueprint)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {blueprint.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            blueprint.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                            blueprint.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {blueprint.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                            {blueprint.timeToProfit}
                          </span>
                        </div>
                      </div>
                      <Rocket className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blueprint.description}
                    </p>

                    <div className="mb-4 p-3 bg-green-500/10 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Potential Earnings</div>
                      <div className="text-lg font-bold text-green-400">
                        {blueprint.potentialEarnings}
                      </div>
                    </div>

                    <Button className="w-full" size="sm" variant="outline">
                      <BookOpen className="mr-2 h-3 w-3" />
                      View Full Blueprint
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Selected Blueprint Detail */}
            {selectedBlueprint && (
              <Card className="p-8 border-primary/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedBlueprint.title}</h2>
                    <p className="text-muted-foreground text-lg mb-4">{selectedBlueprint.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-3 py-1.5 rounded-lg font-medium ${
                        selectedBlueprint.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                        selectedBlueprint.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {selectedBlueprint.difficulty} Level
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary font-medium">
                        ⏰ {selectedBlueprint.timeToProfit}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 font-medium">
                        💰 {selectedBlueprint.potentialEarnings}
                      </span>
                    </div>
                  </div>
                  <Zap className="h-12 w-12 text-primary" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Step-by-Step Plan
                    </h3>
                    <div className="space-y-3">
                      {selectedBlueprint.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Required Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBlueprint.requiredTools.map((tool, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Metrics to Track</h3>
                      <div className="space-y-2">
                        {selectedBlueprint.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-sm text-muted-foreground mb-2">💡 Success Story</div>
                      <p className="text-sm italic">&ldquo;{selectedBlueprint.successStories}&rdquo;</p>
                    </div>

                    <Button className="w-full" size="lg">
                      <Rocket className="mr-2 h-4 w-4" />
                      Start This Blueprint
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cta" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Call-to-Action Templates</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Proven CTA formulas that convert viewers into buyers
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {ctaTemplates.map((template) => (
                  <Card key={template.id} className="p-4 hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <span className="text-xs text-muted-foreground capitalize">
                          {template.style} style
                        </span>
                      </div>
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium">{template.example}</p>
                      </div>
                      {template.variants.map((variant, idx) => (
                        <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                          {variant}
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCopy(template.example, template.id)}
                    >
                      {copied === template.id ? (
                        <>
                          <Check className="mr-2 h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy Example
                        </>
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Top Affiliate Programs</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Best-performing affiliate programs to monetize your content
              </p>

              <div className="grid gap-4">
                {affiliatePrograms.map((program, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{program.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {program.category}
                          </span>
                          <span className="flex items-center gap-1 text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            {program.commission} commission
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(program.url, "_blank")}
                    >
                      <LinkIcon className="mr-2 h-3 w-3" />
                      Join Program
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-primary/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Custom CTA Generator</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., AI Writing Tool"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA Style</Label>
                    <Select
                      value={selectedTemplate.id}
                      onValueChange={(value) => {
                        const template = ctaTemplates.find((t) => t.id === value);
                        if (template) setSelectedTemplate(template);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={generateCTA} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate CTA
                  </Button>

                  {customCTA && (
                    <div className="space-y-2">
                      <Label>Generated CTA</Label>
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm mb-3">{customCTA}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleCopy(customCTA, "custom")}
                        >
                          {copied === "custom" ? (
                            <>
                              <Check className="mr-2 h-3 w-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-3 w-3" />
                              Copy CTA
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-primary/30">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Affiliate Post Generator</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Premium Headphones"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Affiliate Link</Label>
                    <Input
                      value={affiliateLink}
                      onChange={(e) => setAffiliateLink(e.target.value)}
                      placeholder="https://your-affiliate-link.com"
                    />
                  </div>

                  <Button onClick={generateAffiliatePost} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Post
                  </Button>

                  {customCTA && customCTA.includes("#affiliate") && (
                    <div className="space-y-2">
                      <Label>Generated Post</Label>
                      <Textarea
                        value={customCTA}
                        onChange={(e) => setCustomCTA(e.target.value)}
                        rows={12}
                        className="resize-none font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCopy(customCTA, "post")}
                      >
                        {copied === "post" ? (
                          <>
                            <Check className="mr-2 h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-3 w-3" />
                            Copy Post
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}