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
  Wand2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

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
            <Link href="/plans">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105">
                Pricing
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition hover:scale-105">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-110 hover:rotate-1">
                Get Started
              </Button>
            </Link>
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

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 smooth-transition hover:border-primary/50 hover:bg-primary/10 hover:scale-105 cursor-pointer group">
          <Star className="h-4 w-4 text-primary animate-pulse group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm text-primary font-medium">AI-Powered Content Creation Platform</span>
          <Sparkles className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
        </div>

        <div className="flex max-w-4xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-tight relative z-10">
              <span className="inline-flex items-center gap-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animated-gradient">
                <Wand2 className="h-16 w-16 text-primary inline float-animation gold-glow" />
                Meet The Wizard of Oz
              </span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-3xl -z-10 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in duration-1000" style={{ animationDelay: "300ms" }}>
            Transform text into professional videos with AI avatars, voice synthesis, and perfect lip-sync. 
            Publish everywhere, monetize instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-110 hover:shadow-2xl hover:-translate-y-1 group">
              Start Creating Free 
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link href="/plans">
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary/30 hover:bg-primary/5 smooth-transition hover:scale-110 hover:-translate-y-1">
              View Pricing
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm text-muted-foreground mt-8 animate-in fade-in duration-700" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary hover:scale-110 cursor-pointer group">
            <Sparkles className="h-4 w-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary hover:scale-110 cursor-pointer group">
            <Zap className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
            <span>100 free credits</span>
          </div>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary hover:scale-110 cursor-pointer group">
            <Crown className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
            <span>Premium features</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary animated-gradient">Dominate Content Creation</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade tools powered by cutting-edge AI technology
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Video className="h-8 w-8 text-primary" />}
            title="AI Video Generation"
            description="Create professional videos with Wav2Lip lip-sync technology and custom avatars. Perfect synchronization every time."
            delay="100ms"
          />
          
          <FeatureCard
            icon={<Mic className="h-8 w-8 text-primary" />}
            title="Text-to-Speech"
            description="Generate natural-sounding voiceovers with ElevenLabs integration. Multiple voices and languages supported."
            delay="200ms"
          />
          
          <FeatureCard
            icon={<ShoppingBag className="h-8 w-8 text-primary" />}
            title="Digital Marketplace"
            description="Sell your content, avatars, and voice packs to a global audience. Monetize your creativity instantly."
            delay="300ms"
          />
          
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-primary" />}
            title="Social Publishing"
            description="Schedule and auto-publish to Twitter, Facebook, Instagram, and LinkedIn. Maximize your reach effortlessly."
            delay="400ms"
          />
          
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-primary" />}
            title="Analytics Dashboard"
            description="Track performance, revenue, and engagement across all platforms. Data-driven content strategy."
            delay="500ms"
          />
          
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary" />}
            title="Job Queue System"
            description="Efficient background processing with real-time progress tracking. Never wait for content generation."
            delay="600ms"
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary animated-gradient">Simple Pricing</span> for Every Creator
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready to scale
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            features={[
              "100 credits/month",
              "1 avatar",
              "TTS & Video generation"
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
              "Lip-sync videos",
              "Social scheduling"
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
              "Priority support"
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
              "Custom branding",
              "API access"
            ]}
            href="/plans"
            delay="400ms"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="relative p-16 text-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden hover:border-primary/50 smooth-transition group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative z-10">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6 gold-glow float-animation group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
            <h2 className="mb-4 text-4xl font-bold">Ready to Transform Your Content?</h2>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators using AI to scale their content business and reach millions
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-primary hover:bg-primary/90 gold-glow smooth-transition hover:scale-110 hover:shadow-2xl hover:-translate-y-1 group">
                Start Free Trial 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
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
          <p className="text-sm text-muted-foreground">
            © 2024 Osirix. Empowering creators with AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
}

// 3D Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
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
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
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