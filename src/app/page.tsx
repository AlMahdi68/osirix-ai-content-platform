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
  Globe,
  Shield,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Osirix</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/plans">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-24 text-center">
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Autonomous AI Content Creation & Monetization
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate professional videos with AI avatars, voice synthesis, and lip-sync. 
            Publish to social media, sell in the marketplace, and scale your content business.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start Creating <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/plans">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <Video className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">AI Video Generation</h3>
            <p className="text-muted-foreground">
              Create professional videos with Wav2Lip lip-sync technology and custom avatars.
            </p>
          </Card>
          
          <Card className="p-6">
            <Mic className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Text-to-Speech</h3>
            <p className="text-muted-foreground">
              Generate natural-sounding voiceovers with ElevenLabs integration.
            </p>
          </Card>
          
          <Card className="p-6">
            <ShoppingBag className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Digital Marketplace</h3>
            <p className="text-muted-foreground">
              Sell your content, avatars, and voice packs to a global audience.
            </p>
          </Card>
          
          <Card className="p-6">
            <Calendar className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Social Publishing</h3>
            <p className="text-muted-foreground">
              Schedule and auto-publish to Twitter, Facebook, Instagram, and LinkedIn.
            </p>
          </Card>
          
          <Card className="p-6">
            <BarChart3 className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Track performance, revenue, and engagement across all platforms.
            </p>
          </Card>
          
          <Card className="p-6">
            <Zap className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Job Queue System</h3>
            <p className="text-muted-foreground">
              Efficient background processing with real-time progress tracking.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
        <p className="mb-12 text-center text-muted-foreground">
          Choose the plan that fits your content creation needs
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="mb-2 text-2xl font-bold">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li>✓ 100 credits/month</li>
              <li>✓ 1 avatar</li>
              <li>✓ TTS & Video generation</li>
              <li>✓ Community support</li>
            </ul>
            <Link href="/register">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-6 border-primary">
            <h3 className="mb-2 text-2xl font-bold">Starter</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li>✓ 500 credits/month</li>
              <li>✓ 5 avatars</li>
              <li>✓ Lip-sync videos</li>
              <li>✓ Social scheduling</li>
              <li>✓ Email support</li>
            </ul>
            <Link href="/plans">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="mb-2 text-2xl font-bold">Pro</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li>✓ 2000 credits/month</li>
              <li>✓ 20 avatars</li>
              <li>✓ Marketplace access</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <Link href="/plans">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="mb-2 text-2xl font-bold">Enterprise</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$99.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li>✓ 10,000 credits/month</li>
              <li>✓ Unlimited avatars</li>
              <li>✓ Custom branding</li>
              <li>✓ API access</li>
              <li>✓ Dedicated support</li>
            </ul>
            <Link href="/plans">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="p-12 text-center bg-primary text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Content?</h2>
          <p className="mb-6 text-lg opacity-90">
            Join thousands of creators using AI to scale their content business
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Osirix</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Osirix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}