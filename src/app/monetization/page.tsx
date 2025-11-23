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
  Megaphone
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

export default function MonetizationPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState<string>("");
  const [customCTA, setCustomCTA] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(ctaTemplates[0]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [productName, setProductName] = useState("");

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
              Maximize your earnings with affiliate links and powerful CTAs
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

        <Tabs defaultValue="cta" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cta">CTA Templates</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate Programs</TabsTrigger>
            <TabsTrigger value="generator">Content Generator</TabsTrigger>
          </TabsList>

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
