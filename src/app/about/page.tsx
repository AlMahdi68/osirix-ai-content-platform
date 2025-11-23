"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Crown,
  Target,
  Users,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Rocket,
  Award,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Crown className="h-8 w-8 text-primary gold-glow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Osirix
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/plans">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              About Osirix
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            We're building the future of AI-powered content creation and monetization.
            Where creativity meets automation, and creators earn while they sleep.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-16">
        <Card className="p-12 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 rounded-full bg-primary/20">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              To democratize content creation and empower every creator to build a sustainable
              income through AI-powered automation. We believe everyone deserves the tools to
              turn their creativity into consistent revenue, without the endless grind.
            </p>
          </div>
        </Card>
      </section>

      {/* Values Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we build
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ValueCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Creator-First"
            description="Every feature is designed with creators in mind. Your success is our success."
          />
          <ValueCard
            icon={<Shield className="h-8 w-8 text-primary" />}
            title="Quality & Trust"
            description="Best-in-class AI APIs and infrastructure. We never compromise on quality."
          />
          <ValueCard
            icon={<Zap className="h-8 w-8 text-primary" />}
            title="Speed & Innovation"
            description="Constantly pushing boundaries with cutting-edge AI technology."
          />
          <ValueCard
            icon={<Heart className="h-8 w-8 text-primary" />}
            title="Community Driven"
            description="Built with feedback from thousands of creators worldwide."
          />
          <ValueCard
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
            title="Results Focused"
            description="Your earnings matter. We optimize for real revenue, not vanity metrics."
          />
          <ValueCard
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            title="Simplicity"
            description="Powerful tools that anyone can use. No technical expertise required."
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="container py-16">
        <Card className="p-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Osirix was born from a simple observation: content creators work incredibly hard
                but often struggle to monetize consistently. We saw talented artists, marketers,
                and entrepreneurs burning out from the constant content treadmill.
              </p>
              <p>
                We asked ourselves: what if AI could handle the repetitive work while creators
                focus on strategy and growth? What if creators could earn passive income while
                sleeping, traveling, or spending time with family?
              </p>
              <p>
                That vision became Osirix—an AI-powered platform that creates products, designs
                logos, generates videos, manages social media, and handles distribution automatically.
                Our users now earn $500-$10,000+ per month while the AI does the heavy lifting.
              </p>
              <p className="font-semibold text-foreground">
                Today, we're helping thousands of creators build sustainable businesses through
                AI automation. And we're just getting started.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <StatCard number="10,000+" label="Active Creators" />
          <StatCard number="$2M+" label="Creator Earnings" />
          <StatCard number="500K+" label="AI Jobs Completed" />
          <StatCard number="98%" label="Satisfaction Rate" />
        </div>
      </section>

      {/* Technology Section */}
      <section className="container py-16">
        <Card className="p-12 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Rocket className="h-10 w-10 text-primary" />
              <h2 className="text-3xl font-bold">Cutting-Edge Technology</h2>
            </div>
            <p className="text-muted-foreground">
              We partner with industry leaders to deliver the highest quality AI services:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <TechCard
                title="ElevenLabs"
                description="Premium text-to-speech with natural voices and emotions"
              />
              <TechCard
                title="Commercial Wav2Lip"
                description="Industry-leading lip-sync technology for perfect video generation"
              />
              <TechCard
                title="BullMQ & Redis"
                description="Enterprise-grade job queue for reliable, real-time processing"
              />
              <TechCard
                title="Stripe"
                description="Secure payment processing and instant payouts for creators"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Team Section */}
      <section className="container py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/20">
              <Award className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Built by Creators, for Creators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team combines expertise in AI, content creation, and digital marketing.
            We've been in your shoes, and we know what it takes to succeed in the creator economy.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="p-12 text-center bg-gradient-to-br from-green-500/20 via-primary/10 to-transparent border-green-500/30">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are building sustainable income with AI automation.
            No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-500">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Osirix</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered content creation and monetization platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/plans" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/oz" className="hover:text-primary">
                    Meet OZ
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-primary">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/wallet" className="hover:text-primary">
                    Wallet
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2024 Osirix. Empowering creators to make money with AI.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-xl bg-primary/10">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <Card className="p-6">
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}

function TechCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-card/50">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
