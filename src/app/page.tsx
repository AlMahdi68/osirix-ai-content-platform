"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  Video, 
  Mic, 
  ShoppingBag, 
  Calendar, 
  BarChart3,
  Zap,
  ArrowRight,
  Crown,
  Star,
  Wand2,
  Package,
  Palette,
  Users,
  TrendingUp,
  Bot,
  DollarSign,
  Target,
  CheckCircle2,
  Clock,
  Wallet,
  Award
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Animated cursor follower */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-300 ease-out z-0"
        style={{
          background: "radial-gradient(circle, oklch(0.75 0.15 85) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 smooth-transition">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Crown className="h-8 w-8 text-primary gold-glow" />
              <div className="absolute inset-0 animate-pulse">
                <Crown className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Osirix
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/oz">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105 gap-2">
                <Wand2 className="h-4 w-4" />
                Meet OZ
              </Button>
            </Link>
            <Link href="/sponsorships">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105 gap-2">
                <Award className="h-4 w-4" />
                Sponsorships
              </Button>
            </Link>
            <Link href="/plans">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105">
                Pricing
              </Button>
            </Link>
            {!isPending && session?.user ? (
              <>
                <Link href="/wallet">
                  <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105 gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-110 hover:rotate-1">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-110 hover:rotate-1">
                    Start Making Money
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative container flex flex-col items-center gap-10 py-32 text-center overflow-hidden">
        {/* 3D Animated background orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl float-animation" />
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/50 bg-green-500/10 smooth-transition hover:border-green-500/70 hover:bg-green-500/15 hover:scale-105 cursor-pointer group">
          <DollarSign className="h-4 w-4 text-green-400 animate-pulse group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm text-green-400 font-bold">Users Making $500-$10,000+/Month</span>
          <TrendingUp className="h-4 w-4 text-green-400 group-hover:scale-125 transition-transform" />
        </div>

        <div className="flex max-w-4xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-tight relative z-10">
              <span className="inline-flex flex-col items-center gap-4">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animated-gradient">
                  Your AI Employee That
                </span>
                <span className="text-green-400 flex items-center gap-4">
                  <DollarSign className="h-16 w-16 inline float-animation gold-glow" />
                  Makes You Money
                </span>
              </span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-primary/10 to-green-500/20 blur-3xl -z-10 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in duration-1000" style={{ animationDelay: "300ms" }}>
            <span className="font-bold text-green-400">$500-$10,000+ per month.</span> Osirix creates products, designs logos, generates videos, and manages your social media automatically. <span className="font-bold text-foreground">You get paid while you sleep.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-green-600 text-white hover:bg-green-500 gold-glow smooth-transition hover:scale-110 hover:shadow-2xl hover:-translate-y-1 group">
              Start Earning Today (Free)
              <DollarSign className="h-5 w-5 group-hover:scale-125 transition-transform" />
            </Button>
          </Link>
          <Link href="#workflows">
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary/30 hover:bg-primary/5 smooth-transition hover:scale-110 hover:-translate-y-1">
              <Target className="h-5 w-5" />
              See Exact Workflows
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 text-center mt-8 animate-in fade-in duration-700" style={{ animationDelay: "600ms" }}>
          <div className="smooth-transition hover:scale-110 cursor-pointer group">
            <div className="text-3xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform">$500-2K</div>
            <div className="text-sm text-muted-foreground">Month 1 Earnings</div>
          </div>
          <div className="smooth-transition hover:scale-110 cursor-pointer group">
            <div className="text-3xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform">10 min</div>
            <div className="text-sm text-muted-foreground">Setup Time</div>
          </div>
          <div className="smooth-transition hover:scale-110 cursor-pointer group">
            <div className="text-3xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform">24/7</div>
            <div className="text-sm text-muted-foreground">AI Working</div>
          </div>
        </div>
      </section>

      {/* Money-Making Guarantee */}
      <section className="container py-16 bg-gradient-to-b from-green-500/5 to-transparent">
        <Card className="p-12 text-center border-green-500/30 bg-green-500/5">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Money-Making Guarantee</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Follow our proven workflows for 30 days. If you don't make at least <span className="font-bold text-green-400">$500</span> in your first month, we'll give you personalized coaching from OZ until you do. <span className="font-bold text-foreground">That's our promise.</span>
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Proven System</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Real Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Precise Workflows Section */}
      <section id="workflows" className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-green-400">3 Proven Workflows</span> To Start Making Money Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Step-by-step systems that guarantee results. No guesswork, just profits.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <WorkflowCard
            number="1"
            title="Digital Product Sales"
            revenue="$200-$2,000/month"
            time="30 min setup"
            steps={[
              "Generate 10 AI logos (30 min)",
              "List in marketplace at $50-200",
              "Osirix auto-promotes to buyers",
              "Get paid instantly on sales"
            ]}
            icon={<ShoppingBag className="h-8 w-8 text-primary" />}
            delay="100ms"
          />
          
          <WorkflowCard
            number="2"
            title="Social Media Automation"
            revenue="$300-$5,000/month"
            time="10 min setup"
            steps={[
              "Connect social accounts (5 min)",
              "AI creates 30-day content plan",
              "Auto-posts at peak engagement times",
              "Earn from ads & sponsorships"
            ]}
            icon={<Calendar className="h-8 w-8 text-primary" />}
            popular
            delay="200ms"
          />
          
          <WorkflowCard
            number="3"
            title="Video Production Service"
            revenue="$1,000-$5,000/month"
            time="5 min per video"
            steps={[
              "Create client avatar (5 min)",
              "Input script → AI generates video",
              "Perfect lip-sync in 10 minutes",
              "Deliver & charge $100-500/video"
            ]}
            icon={<Video className="h-8 w-8 text-primary" />}
            delay="300ms"
          />
        </div>

        <div className="text-center mt-12">
          <Link href="/register">
            <Button size="lg" className="gap-2 bg-green-600 text-white hover:bg-green-500 gold-glow">
              Start With Workflow #1 (Easiest)
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="container py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary animated-gradient">AI Tools</span> That Work While You Sleep
          </h2>
          <p className="text-xl text-muted-foreground">
            Every tool is designed to generate revenue automatically
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Bot className="h-8 w-8 text-primary" />}
            title="AI Manager Agent"
            description="Autonomous AI that orchestrates campaigns, creates content, and maximizes your earnings 24/7."
            earning="$500-2K/month passive"
            delay="100ms"
          />
          
          <FeatureCard
            icon={<Package className="h-8 w-8 text-primary" />}
            title="AI Product Creator"
            description="Generate complete products with descriptions, pricing, and marketing. List & sell instantly."
            earning="$50-200 per product"
            delay="200ms"
          />
          
          <FeatureCard
            icon={<Palette className="h-8 w-8 text-primary" />}
            title="AI Logo Generator"
            description="Create professional logos in seconds. Each logo can sell for $50-500 in marketplace."
            earning="$200-1K/month"
            delay="300ms"
          />
          
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="AI Character Creator"
            description="Design unique characters with personalities. License or sell for $100-1000 each."
            earning="$100-1K per character"
            delay="400ms"
          />
          
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
            title="AI Digital Marketer"
            description="Execute complete marketing campaigns. Auto-generates and publishes high-converting content."
            earning="$300-5K/month"
            delay="500ms"
          />
          
          <FeatureCard
            icon={<Video className="h-8 w-8 text-primary" />}
            title="AI Video Generation"
            description="Create professional videos with lip-sync. Offer as service for $100-500 per video."
            earning="$100-500 per video"
            delay="600ms"
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary animated-gradient">Start Free,</span> Scale As You Earn
          </h2>
          <p className="text-xl text-muted-foreground">
            No credit card required. Start making money today.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            features={[
              "100 credits/month",
              "1 avatar",
              "TTS & Video generation",
              "Start earning today"
            ]}
            href="/register"
            delay="100ms"
          />

          <PricingCard
            name="Starter"
            price="$9.99"
            features={[
              "500 credits/month",
              "5 avatars",
              "Social scheduling",
              "Earn $500-1K/month"
            ]}
            href="/plans"
            popular
            delay="200ms"
          />

          <PricingCard
            name="Pro"
            price="$29.99"
            features={[
              "2000 credits/month",
              "20 avatars",
              "Marketplace access",
              "Earn $2K-5K/month"
            ]}
            href="/plans"
            delay="300ms"
          />

          <PricingCard
            name="Enterprise"
            price="$99.99"
            features={[
              "10,000 credits/month",
              "Unlimited avatars",
              "API access",
              "Earn $5K-10K+/month"
            ]}
            href="/plans"
            delay="400ms"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="relative p-16 text-center bg-gradient-to-br from-green-500/20 via-primary/10 to-transparent border-green-500/30 overflow-hidden hover:border-green-500/50 smooth-transition group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent gold-shimmer" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative z-10">
            <DollarSign className="h-16 w-16 text-green-400 mx-auto mb-6 gold-glow float-animation group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
            <h2 className="mb-4 text-4xl font-bold">Ready To Start Making Money?</h2>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join creators earning <span className="font-bold text-green-400">$500-$10,000+/month</span> with AI automation. Your first sale could happen today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-green-600 hover:bg-green-500 gold-glow smooth-transition hover:scale-110 hover:shadow-2xl hover:-translate-y-1 group">
                  Start Free Trial (No Card Required)
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/oz">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary/30 hover:bg-primary/5">
                  <Wand2 className="h-5 w-5" />
                  Talk to OZ (Free Consultation)
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 inline text-green-400 mr-1" />
              100 free credits • No credit card • Cancel anytime
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3 group">
            <Crown className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-lg">Osirix</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Osirix. Empowering creators to make money with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Workflow Card Component
function WorkflowCard({ 
  number,
  title, 
  revenue,
  time,
  steps,
  icon,
  popular,
  delay 
}: { 
  number: string;
  title: string;
  revenue: string;
  time: string;
  steps: string[];
  icon: React.ReactNode;
  popular?: boolean;
  delay: string; 
}) {
  return (
    <Card 
      className={`p-8 bg-card transition-all duration-300 relative overflow-hidden cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 ${
        popular 
          ? "border-green-500/50 hover:border-green-500 gold-glow scale-105" 
          : "border-border/50 hover:border-primary/30 hover:scale-105"
      }`}
      style={{ animationDelay: delay }}
    >
      {popular && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          {number}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          {icon}
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-bold">{title}</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 text-green-400 font-bold">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">{revenue}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{time}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
              {i + 1}
            </div>
            <span className="text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      <Link href="/register">
        <Button className="w-full smooth-transition hover:scale-105" variant={popular ? "default" : "outline"}>
          Start This Workflow
        </Button>
      </Link>
    </Card>
  );
}

// 3D Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description,
  earning,
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  earning?: string;
  delay: string; 
}) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setTransform({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  return (
    <Card 
      ref={cardRef}
      className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group animate-in fade-in slide-in-from-bottom-4 duration-700 cursor-pointer"
      style={{ 
        animationDelay: delay,
        transform: `perspective(1000px) rotateX(${transform.x}deg) rotateY(${transform.y}deg) scale(1.02)`,
        transition: "transform 0.3s ease-out, border 0.3s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="mb-3 text-2xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>
      {earning && (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold">
          <DollarSign className="h-3 w-3" />
          {earning}
        </div>
      )}
    </Card>
  );
}

// 3D Pricing Card Component
function PricingCard({
  name,
  price,
  features,
  href,
  popular,
  delay
}: {
  name: string;
  price: string;
  features: string[];
  href: string;
  popular?: boolean;
  delay: string;
}) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTransform({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  return (
    <Card 
      ref={cardRef}
      className={`p-8 bg-card transition-all duration-300 relative overflow-hidden cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 ${
        popular 
          ? "border-primary/50 hover:border-primary gold-glow" 
          : "border-border/50 hover:border-primary/20 hover:scale-105"
      }`}
      style={{ 
        animationDelay: delay,
        transform: `perspective(1000px) rotateX(${transform.x}deg) rotateY(${transform.y}deg) ${popular ? "scale(1.05)" : "scale(1.02)"}`,
        transition: "transform 0.3s ease-out, border 0.3s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {popular && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full pulse-glow">
            Popular
          </span>
        </div>
      )}
      <h3 className="mb-2 text-2xl font-bold">{name}</h3>
      <div className="mb-6">
        <span className={`text-5xl font-bold ${popular ? "text-primary animated-gradient" : ""}`}>{price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 group hover:text-primary transition-colors">
            <Sparkles className="h-4 w-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
            {feature}
          </li>
        ))}
      </ul>
      <Link href={href}>
        <Button 
          className={`w-full smooth-transition hover:scale-105 ${
            popular 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-primary hover:bg-primary/90"
          }`}
          variant={popular ? "default" : "default"}
        >
          Get Started
        </Button>
      </Link>
    </Card>
  );
}