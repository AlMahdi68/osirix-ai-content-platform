"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wand2,
  Sparkles,
  TrendingUp,
  Zap,
  Users,
  Video,
  Mic,
  Package,
  Palette,
  Bot,
  Calendar,
  DollarSign,
  Share2,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Play,
  ShoppingBag,
  BarChart3,
  Crown,
  Link as LinkIcon,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";
import Link from "next/link";

export default function OZGuidePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <Card className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <CardContent className="p-12 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Wand2 className="h-16 w-16 text-primary gold-glow float-animation" />
              <Crown className="h-12 w-12 text-primary gold-glow" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animated-gradient">
              Meet OZ - Your AI Money-Making Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The Wizard of Osirix. I'll show you exactly how to turn AI into automatic income streams. 
              Let's unlock your potential and build wealth while you sleep! 💰
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="text-lg px-6 py-2 bg-primary/20 border-primary/30">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Guidance
              </Badge>
              <Badge className="text-lg px-6 py-2 bg-primary/20 border-primary/30">
                <TrendingUp className="h-4 w-4 mr-2" />
                Maximize Earnings
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
            <TabsTrigger value="overview" className="gap-2 py-3">
              <Sparkles className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="money" className="gap-2 py-3">
              <DollarSign className="h-4 w-4" />
              Make Money
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2 py-3">
              <Share2 className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="automation" className="gap-2 py-3">
              <Bot className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2 py-3">
              <Target className="h-4 w-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="tips" className="gap-2 py-3">
              <Lightbulb className="h-4 w-4" />
              Pro Tips
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wand2 className="h-6 w-6 text-primary" />
                  Welcome to Your AI Empire
                </CardTitle>
                <CardDescription>
                  Osirix is your autonomous AI workforce that creates content, builds products, and makes money 24/7
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg">
                    Think of Osirix as your personal AI army. Each tool is a specialized agent working tirelessly to generate income while you focus on strategy or simply relax. Here's what you have at your command:
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ToolCard
                    icon={<Bot className="h-8 w-8 text-primary" />}
                    title="AI Manager Agent"
                    description="Your autonomous orchestrator that manages all tools and maximizes profits"
                    earnings="$500-5000/month"
                    link="/ai/manager"
                  />
                  <ToolCard
                    icon={<Package className="h-8 w-8 text-primary" />}
                    title="Product Creator"
                    description="Generate digital products to sell on the marketplace"
                    earnings="$200-2000/product"
                    link="/ai/products"
                  />
                  <ToolCard
                    icon={<Palette className="h-8 w-8 text-primary" />}
                    title="Logo Generator"
                    description="Create professional logos clients will pay for"
                    earnings="$50-500/logo"
                    link="/ai/logos"
                  />
                  <ToolCard
                    icon={<Users className="h-8 w-8 text-primary" />}
                    title="Character Creator"
                    description="Design AI avatars for videos and content"
                    earnings="$100-1000/character"
                    link="/ai/characters"
                  />
                  <ToolCard
                    icon={<MessageSquare className="h-8 w-8 text-primary" />}
                    title="Digital Marketer"
                    description="Run automated campaigns across all platforms"
                    earnings="$300-3000/month"
                    link="/ai/campaigns"
                  />
                  <ToolCard
                    icon={<Video className="h-8 w-8 text-primary" />}
                    title="Video Generator"
                    description="Create viral videos with lip-sync technology"
                    earnings="$100-1000/video"
                    link="/jobs"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  Your Earning Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Beginner</p>
                    <p className="text-3xl font-bold text-green-500">$500-2K</p>
                    <p className="text-xs text-muted-foreground mt-2">Per month</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg border-2 border-primary/30">
                    <p className="text-sm text-muted-foreground mb-2">Intermediate</p>
                    <p className="text-3xl font-bold text-primary">$2K-10K</p>
                    <p className="text-xs text-muted-foreground mt-2">Per month</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Advanced</p>
                    <p className="text-3xl font-bold text-yellow-500">$10K+</p>
                    <p className="text-xs text-muted-foreground mt-2">Per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Make Money Tab */}
          <TabsContent value="money" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  7 Ways to Make Money with Osirix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MoneyStrategyCard
                  number="1"
                  title="Sell Digital Products on Marketplace"
                  description="Create products with AI Product Creator and sell them on our marketplace"
                  steps={[
                    "Use AI Product Creator to generate product ideas",
                    "Create compelling descriptions and pricing",
                    "List on Osirix Marketplace",
                    "Earn passive income from every sale"
                  ]}
                  potential="$200-2000 per product"
                  difficulty="Easy"
                  timeToProfit="1-7 days"
                />

                <MoneyStrategyCard
                  number="2"
                  title="Offer Logo Design Services"
                  description="Generate professional logos for clients using AI Logo Generator"
                  steps={[
                    "Browse logo templates and styles",
                    "Generate custom logos in seconds",
                    "Sell on freelance platforms (Fiverr, Upwork)",
                    "Deliver instantly, keep 100% profit"
                  ]}
                  potential="$50-500 per logo"
                  difficulty="Easy"
                  timeToProfit="Same day"
                />

                <MoneyStrategyCard
                  number="3"
                  title="Create & Monetize Video Content"
                  description="Generate viral videos with characters and publish to social media"
                  steps={[
                    "Create AI characters with unique personalities",
                    "Generate videos with lip-sync technology",
                    "Post to YouTube, TikTok, Instagram",
                    "Earn from ads, sponsorships, and affiliate links"
                  ]}
                  potential="$100-10K+ per month"
                  difficulty="Medium"
                  timeToProfit="2-4 weeks"
                />

                <MoneyStrategyCard
                  number="4"
                  title="Run Social Media Management Agency"
                  description="Manage multiple client accounts with AI Digital Marketer"
                  steps={[
                    "Connect client social media accounts",
                    "Create campaigns with AI Digital Marketer",
                    "Schedule content automatically",
                    "Charge monthly retainer fees"
                  ]}
                  potential="$1000-10K+ per month"
                  difficulty="Medium"
                  timeToProfit="1-2 months"
                />

                <MoneyStrategyCard
                  number="5"
                  title="Sell AI Character Licenses"
                  description="Create unique AI characters and license them to content creators"
                  steps={[
                    "Design characters with AI Character Creator",
                    "Create voice packs and avatar bundles",
                    "List on marketplace with licensing terms",
                    "Earn recurring revenue from licenses"
                  ]}
                  potential="$100-1000 per character"
                  difficulty="Easy"
                  timeToProfit="3-7 days"
                />

                <MoneyStrategyCard
                  number="6"
                  title="Automated Content Empire"
                  description="Let AI Manager Agent run everything on autopilot"
                  steps={[
                    "Set up AI Manager Agent with your goals",
                    "Connect all social media accounts",
                    "Configure automation rules",
                    "Monitor earnings dashboard daily"
                  ]}
                  potential="$500-5000+ per month"
                  difficulty="Hard"
                  timeToProfit="1-3 months"
                />

                <MoneyStrategyCard
                  number="7"
                  title="Affiliate Marketing with AI Content"
                  description="Create product review videos and earn commissions"
                  steps={[
                    "Choose affiliate programs (Amazon, ClickBank)",
                    "Generate product review videos with AI",
                    "Include affiliate links in descriptions",
                    "Post across all platforms automatically"
                  ]}
                  potential="$200-5000+ per month"
                  difficulty="Medium"
                  timeToProfit="2-6 weeks"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Share2 className="h-6 w-6 text-primary" />
                  Connecting Your Social Media Accounts
                </CardTitle>
                <CardDescription>
                  Link your accounts once, and Osirix handles the rest automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Why Connect Social Media?</h4>
                      <p className="text-sm text-muted-foreground">
                        Once connected, Osirix AI can automatically create, schedule, and publish content to all your platforms. 
                        You'll reach millions while sleeping! 🌙
                      </p>
                    </div>
                  </div>
                </div>

                <SocialPlatformGuide
                  icon={<Youtube className="h-8 w-8" />}
                  platform="YouTube"
                  color="from-red-500/20 to-rose-500/20 border-red-500/30"
                  steps={[
                    "Go to Settings → Social Media",
                    "Click 'Connect YouTube'",
                    "Sign in with your Google account",
                    "Grant permissions to post videos",
                    "Osirix will auto-upload videos with titles, descriptions, and tags"
                  ]}
                  benefits={[
                    "Auto-upload lip-sync videos",
                    "Optimized titles and descriptions",
                    "Schedule posts for peak times",
                    "Track views and earnings"
                  ]}
                  moneyPotential="$100-10K+/month from ads"
                />

                <SocialPlatformGuide
                  icon={<Instagram className="h-8 w-8" />}
                  platform="Instagram"
                  color="from-pink-500/20 to-purple-500/20 border-pink-500/30"
                  steps={[
                    "Go to Settings → Social Media",
                    "Click 'Connect Instagram'",
                    "Log in with Instagram credentials",
                    "Authorize Osirix to post on your behalf",
                    "AI will create Reels, Stories, and Posts automatically"
                  ]}
                  benefits={[
                    "Auto-post Reels and Stories",
                    "Hashtag optimization",
                    "Engagement analytics",
                    "Best time posting"
                  ]}
                  moneyPotential="$500-5K/month from brand deals"
                />

                <SocialPlatformGuide
                  icon={<Twitter className="h-8 w-8" />}
                  platform="Twitter / X"
                  color="from-blue-500/20 to-cyan-500/20 border-blue-500/30"
                  steps={[
                    "Go to Settings → Social Media",
                    "Click 'Connect Twitter'",
                    "Sign in to your X account",
                    "Authorize API access",
                    "Osirix will tweet content automatically with optimal timing"
                  ]}
                  benefits={[
                    "Auto-tweet campaigns",
                    "Thread generation",
                    "Engagement tracking",
                    "Viral content analysis"
                  ]}
                  moneyPotential="$200-3K/month from engagement"
                />

                <SocialPlatformGuide
                  icon={<Facebook className="h-8 w-8" />}
                  platform="Facebook"
                  color="from-blue-600/20 to-indigo-500/20 border-blue-600/30"
                  steps={[
                    "Go to Settings → Social Media",
                    "Click 'Connect Facebook'",
                    "Log in to Facebook",
                    "Grant page management permissions",
                    "AI posts to your page automatically"
                  ]}
                  benefits={[
                    "Auto-post to pages and groups",
                    "Audience targeting",
                    "Engagement metrics",
                    "Ad campaign automation"
                  ]}
                  moneyPotential="$300-4K/month from page monetization"
                />

                <SocialPlatformGuide
                  icon={<Linkedin className="h-8 w-8" />}
                  platform="LinkedIn"
                  color="from-blue-700/20 to-blue-500/20 border-blue-700/30"
                  steps={[
                    "Go to Settings → Social Media",
                    "Click 'Connect LinkedIn'",
                    "Sign in with LinkedIn",
                    "Authorize access to post",
                    "AI creates professional content automatically"
                  ]}
                  benefits={[
                    "Professional content creation",
                    "Network growth automation",
                    "B2B lead generation",
                    "Thought leadership posts"
                  ]}
                  moneyPotential="$500-10K/month from B2B leads"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Quick Start: Connect All Platforms in 10 Minutes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {[
                    "Navigate to Settings → Social Media section",
                    "Click 'Connect All' to link all platforms at once",
                    "Follow the authentication prompts for each platform",
                    "Set your posting preferences (frequency, timing)",
                    "Enable AI Manager Agent for full automation",
                    "Watch your content spread across the internet! 🚀"
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bot className="h-6 w-6 text-primary" />
                  How Osirix Makes Money for You Automatically
                </CardTitle>
                <CardDescription>
                  Set it once, earn forever. Here's exactly how the magic happens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <AutomationFlow />

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Content Scheduling
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p>AI Manager analyzes your audience and schedules posts at optimal times:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Analyzes engagement patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Posts when your audience is most active</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Maintains consistent posting frequency</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Adjusts strategy based on performance</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-purple-500" />
                        Video Generation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p>Automatically creates viral video content:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>Generates scripts from trending topics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>Creates voiceovers with TTS</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>Adds lip-sync to avatars</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>Publishes across all platforms</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-green-500" />
                        Product Creation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p>Builds and lists products for passive income:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Identifies profitable niches</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Generates product concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Creates marketing materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Lists on marketplace automatically</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-yellow-500" />
                        Performance Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p>Continuously improves your strategy:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Tracks engagement metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>A/B tests content variations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Identifies winning formulas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>Scales what works best</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-primary" />
                  Personalized Money-Making Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your setup and goals, here's your optimal path to profits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RecommendationCard
                  title="🚀 Quick Wins (Start Today)"
                  recommendations={[
                    {
                      action: "Create 3 logos with AI Logo Generator",
                      why: "Fastest way to make your first $100-300",
                      howTo: "Use templates, list on Fiverr/marketplace",
                      timeframe: "Today"
                    },
                    {
                      action: "Generate 1 digital product",
                      why: "Set up passive income stream",
                      howTo: "Use AI Product Creator → List on marketplace",
                      timeframe: "1-2 days"
                    },
                    {
                      action: "Connect YouTube account",
                      why: "Start building long-term revenue",
                      howTo: "Settings → Social Media → Connect YouTube",
                      timeframe: "5 minutes"
                    }
                  ]}
                />

                <RecommendationCard
                  title="📈 Medium-Term Growth (This Month)"
                  recommendations={[
                    {
                      action: "Create 2-3 AI characters",
                      why: "Build your unique brand identity",
                      howTo: "AI Character Creator → Use in videos",
                      timeframe: "1 week"
                    },
                    {
                      action: "Launch first marketing campaign",
                      why: "Automate content across platforms",
                      howTo: "AI Digital Marketer → Connect socials → Schedule",
                      timeframe: "2 weeks"
                    },
                    {
                      action: "Create 10 videos with lip-sync",
                      why: "Build library of viral content",
                      howTo: "Character + TTS + Video generator",
                      timeframe: "3 weeks"
                    }
                  ]}
                />

                <RecommendationCard
                  title="🏆 Long-Term Empire (Next 3 Months)"
                  recommendations={[
                    {
                      action: "Enable AI Manager Agent",
                      why: "Fully autonomous income system",
                      howTo: "AI Manager → Set goals → Enable automation",
                      timeframe: "Month 1"
                    },
                    {
                      action: "Build product suite (5-10 products)",
                      why: "Multiple passive income streams",
                      howTo: "Consistent product creation + marketing",
                      timeframe: "Month 2"
                    },
                    {
                      action: "Scale to 100+ posts per month",
                      why: "Maximum reach and visibility",
                      howTo: "AI automation + social scheduling",
                      timeframe: "Month 3"
                    }
                  ]}
                />

                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Your Personalized 90-Day Action Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">1</span>
                          Days 1-30: Foundation ($500-2000)
                        </h4>
                        <ul className="ml-10 space-y-2 text-sm text-muted-foreground">
                          <li>• Week 1: Create 5 products, 5 logos, connect all socials</li>
                          <li>• Week 2: Generate 10 videos, start first campaign</li>
                          <li>• Week 3: Create 3 characters, build content library</li>
                          <li>• Week 4: Optimize based on analytics, double down on winners</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">2</span>
                          Days 31-60: Acceleration ($2000-5000)
                        </h4>
                        <ul className="ml-10 space-y-2 text-sm text-muted-foreground">
                          <li>• Enable AI Manager Agent for full automation</li>
                          <li>• Launch 3 major campaigns across all platforms</li>
                          <li>• Build product suite with 15+ offerings</li>
                          <li>• Start affiliate marketing with AI-generated reviews</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">3</span>
                          Days 61-90: Domination ($5000-10K+)
                        </h4>
                        <ul className="ml-10 space-y-2 text-sm text-muted-foreground">
                          <li>• Scale to 200+ posts per month automatically</li>
                          <li>• Launch social media management agency</li>
                          <li>• Create premium character license packages</li>
                          <li>• Expand to YouTube monetization and sponsorships</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pro Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  Pro Tips from Top Earners
                </CardTitle>
                <CardDescription>
                  Insider secrets to maximize your Osirix earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProTipCard
                  category="Content Strategy"
                  tips={[
                    "Post at 7am, 12pm, and 7pm - these are peak engagement times",
                    "Use trending topics from AI Manager's suggestions - ride the viral wave",
                    "Create series of 10+ videos on one topic - algorithm loves consistency",
                    "Mix entertainment (70%) with promotion (30%) for best engagement"
                  ]}
                />

                <ProTipCard
                  category="Monetization Hacks"
                  tips={[
                    "Bundle products together for 3x higher sales - 'Ultimate Creator Pack'",
                    "Create 'lite' and 'pro' versions of products for price anchoring",
                    "Use AI-generated thumbnails with high contrast colors for clicks",
                    "Add affiliate links in every video description - passive income layer"
                  ]}
                />

                <ProTipCard
                  category="Automation Secrets"
                  tips={[
                    "Let AI Manager run for 48 hours before adjusting - give it time to learn",
                    "Create character personas for different niches - education, comedy, tech",
                    "Set up webhook automations to cross-post content instantly",
                    "Use job queue during off-peak hours (2am-6am) for faster processing"
                  ]}
                />

                <ProTipCard
                  category="Growth Tactics"
                  tips={[
                    "Collaborate with other Osirix users - comment and share each other's content",
                    "Reply to every comment in first hour - boosts algorithm visibility",
                    "Create 'behind the scenes' content showing your AI workflow - very engaging",
                    "Run monthly contests giving away your digital products for viral growth"
                  ]}
                />

                <ProTipCard
                  category="Credit Optimization"
                  tips={[
                    "Batch create content during sales when credits are discounted",
                    "Use shorter videos (30-60s) initially - costs less, tests faster",
                    "Reuse successful character/logo assets across multiple projects",
                    "Schedule posts in bulk to save on API calls and credits"
                  ]}
                />

                <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-5 w-5" />
                      Common Mistakes to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-medium">Posting inconsistently</p>
                          <p className="text-sm text-muted-foreground">Algorithm punishes gaps. Let AI maintain schedule.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-medium">Over-promoting products</p>
                          <p className="text-sm text-muted-foreground">70% value content, 30% sales. Build trust first.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-medium">Ignoring analytics</p>
                          <p className="text-sm text-muted-foreground">Check dashboard weekly. Double down on what works.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-medium">Using generic content</p>
                          <p className="text-sm text-muted-foreground">Customize AI outputs. Add your unique voice and style.</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <CardContent className="p-12 text-center relative z-10">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6 gold-glow float-animation" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your AI Money Machine?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              You now have the complete blueprint. Pick one strategy and start today. OZ is here to guide you every step! 🧙‍♂️✨
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/ai/manager">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Start AI Manager
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function ToolCard({ icon, title, description, earnings, link }: any) {
  return (
    <Link href={link}>
      <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
        <CardContent className="p-6">
          <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">{earnings}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

function MoneyStrategyCard({ number, title, description, steps, potential, difficulty, timeToProfit }: any) {
  return (
    <Card className="border-primary/30 hover:border-primary/50 transition-all">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary text-xl font-bold flex-shrink-0">
            {number}
          </div>
          <div className="flex-1">
            <CardTitle className="mb-2">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Steps:</h4>
          <ol className="space-y-2">
            {steps.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Potential</p>
            <p className="font-bold text-green-500">{potential}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Difficulty</p>
            <Badge variant="outline">{difficulty}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time to Profit</p>
            <p className="font-medium">{timeToProfit}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialPlatformGuide({ icon, platform, color, steps, benefits, moneyPotential }: any) {
  return (
    <Card className={`bg-gradient-to-br ${color}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          <span>{platform}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Connection Steps:
          </h4>
          <ol className="space-y-2">
            {steps.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Will Handle:
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Money Potential:</p>
          <p className="font-bold text-lg text-green-500">{moneyPotential}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AutomationFlow() {
  const steps = [
    { icon: <Target className="h-6 w-6" />, title: "1. Set Goals", description: "Tell AI your targets (followers, revenue, content type)" },
    { icon: <Bot className="h-6 w-6" />, title: "2. AI Plans", description: "Creates strategy, content calendar, and campaigns" },
    { icon: <Video className="h-6 w-6" />, title: "3. Content Generated", description: "Videos, posts, products created automatically" },
    { icon: <Calendar className="h-6 w-6" />, title: "4. Auto-Published", description: "Posted across all platforms at optimal times" },
    { icon: <BarChart3 className="h-6 w-6" />, title: "5. Performance Tracked", description: "Analytics monitored, strategy adjusted" },
    { icon: <DollarSign className="h-6 w-6" />, title: "6. Money Flows", description: "Revenue from ads, sales, sponsorships" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-6 text-center">The Autonomous Money Loop</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, idx) => (
          <Card key={idx} className="bg-primary/5 border-primary/20 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <CardContent className="p-6 relative z-10">
              <div className="mb-4 text-primary">{step.icon}</div>
              <h4 className="font-semibold mb-2">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardContent>
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                <ArrowRight className="h-6 w-6 text-primary/50" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ title, recommendations }: any) {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="p-4 bg-primary/5 rounded-lg space-y-2">
              <h4 className="font-semibold">{rec.action}</h4>
              <div className="grid gap-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Why:</span> {rec.why}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">How:</span> {rec.howTo}
                </p>
                <p>
                  <Badge variant="outline" className="text-xs">⏱️ {rec.timeframe}</Badge>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProTipCard({ category, tips }: any) {
  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-500">
          <Lightbulb className="h-5 w-5" />
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p className="text-sm pt-0.5">{tip}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
