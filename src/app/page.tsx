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
  Star
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 smooth-transition">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
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
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition">
                Pricing
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary smooth-transition">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-105">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container flex flex-col items-center gap-10 py-32 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 smooth-transition hover:border-primary/50 hover:bg-primary/10">
          <Star className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">AI-Powered Content Creation Platform</span>
        </div>

        <div className="flex max-w-4xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight leading-tight">
            Create <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent gold-shimmer">Stunning AI Videos</span> in Minutes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform text into professional videos with AI avatars, voice synthesis, and perfect lip-sync. 
            Publish everywhere, monetize instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 gold-glow smooth-transition hover:scale-105 hover:shadow-2xl">
              Start Creating Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/plans">
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary/30 hover:bg-primary/5 smooth-transition hover:scale-105">
              View Pricing
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm text-muted-foreground mt-8 animate-in fade-in duration-700" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary">
            <Zap className="h-4 w-4 text-primary" />
            <span>100 free credits</span>
          </div>
          <div className="flex items-center gap-2 smooth-transition hover:text-primary">
            <Crown className="h-4 w-4 text-primary" />
            <span>Premium features</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to <span className="text-primary">Dominate Content Creation</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade tools powered by cutting-edge AI technology
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">AI Video Generation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create professional videos with Wav2Lip lip-sync technology and custom avatars. Perfect synchronization every time.
            </p>
          </Card>
          
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Text-to-Speech</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate natural-sounding voiceovers with ElevenLabs integration. Multiple voices and languages supported.
            </p>
          </Card>
          
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Digital Marketplace</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sell your content, avatars, and voice packs to a global audience. Monetize your creativity instantly.
            </p>
          </Card>
          
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Social Publishing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Schedule and auto-publish to Twitter, Facebook, Instagram, and LinkedIn. Maximize your reach effortlessly.
            </p>
          </Card>
          
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "500ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track performance, revenue, and engagement across all platforms. Data-driven content strategy.
            </p>
          </Card>
          
          <Card className="p-8 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:gold-glow group hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "600ms" }}>
            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors smooth-transition group-hover:scale-110">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold">Job Queue System</h3>
            <p className="text-muted-foreground leading-relaxed">
              Efficient background processing with real-time progress tracking. Never wait for content generation.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container py-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary">Simple Pricing</span> for Every Creator
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready to scale
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <h3 className="mb-2 text-2xl font-bold">Free</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                100 credits/month
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                1 avatar
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                TTS & Video generation
              </li>
            </ul>
            <Link href="/register">
              <Button variant="outline" className="w-full smooth-transition hover:scale-105">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 bg-card border-primary/50 hover:border-primary transition-all duration-300 gold-glow relative overflow-hidden hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full pulse-glow">
                Popular
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold">Starter</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-primary">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                500 credits/month
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                5 avatars
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Lip-sync videos
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Social scheduling
              </li>
            </ul>
            <Link href="/plans">
              <Button className="w-full bg-primary hover:bg-primary/90 smooth-transition hover:scale-105">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            <h3 className="mb-2 text-2xl font-bold">Pro</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                2000 credits/month
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                20 avatars
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Marketplace access
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Priority support
              </li>
            </ul>
            <Link href="/plans">
              <Button className="w-full bg-primary hover:bg-primary/90 smooth-transition hover:scale-105">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 bg-card border-border/50 hover:border-primary/20 transition-all duration-300 hover:scale-105 smooth-transition animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
            <h3 className="mb-2 text-2xl font-bold">Enterprise</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold">$99.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                10,000 credits/month
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Unlimited avatars
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Custom branding
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                API access
              </li>
            </ul>
            <Link href="/plans">
              <Button className="w-full bg-primary hover:bg-primary/90 smooth-transition hover:scale-105">Get Started</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="relative p-16 text-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 overflow-hidden hover:border-primary/50 smooth-transition">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent gold-shimmer" />
          <div className="relative z-10">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6 gold-glow float-animation" />
            <h2 className="mb-4 text-4xl font-bold">Ready to Transform Your Content?</h2>
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators using AI to scale their content business and reach millions
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-primary hover:bg-primary/90 gold-glow smooth-transition hover:scale-105 hover:shadow-2xl">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
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