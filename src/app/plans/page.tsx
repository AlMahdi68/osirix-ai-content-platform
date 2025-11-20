"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Check, Zap } from "lucide-react";
import Link from "next/link";
import PlanBadge from "@/components/PlanBadge";
import { PricingTable } from "@/components/autumn/pricing-table";

const productDetails = [
  {
    id: "free",
    description: "Perfect for getting started with AI content creation",
  },
  {
    id: "starter",
    description: "For creators who need more power",
    recommendText: "Most Popular",
  },
  {
    id: "pro",
    description: "For professional content creators and marketers",
  },
  {
    id: "enterprise",
    description: "For teams and agencies with custom needs",
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-2xl font-bold gold-gradient">Osirix</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <PlanBadge />
                <Link href="/dashboard">
                  <Button variant="ghost" className="hover:text-primary">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hover:text-primary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="gold-glow">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Flexible Pricing</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 gold-gradient">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your content creation needs. All plans include core features.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="mb-16">
          <PricingTable productDetails={productDetails} />
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center gold-gradient">What's Included</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Video Generation",
                description: "Create professional videos with Wav2Lip lip-sync technology",
                icon: Check
              },
              {
                title: "Text-to-Speech",
                description: "Natural-sounding voiceovers with ElevenLabs integration",
                icon: Check
              },
              {
                title: "Custom Avatars",
                description: "Upload and manage your own AI avatars",
                icon: Check
              },
              {
                title: "Social Publishing",
                description: "Schedule and auto-publish to all major platforms",
                icon: Check
              },
              {
                title: "Analytics Dashboard",
                description: "Track performance and engagement metrics",
                icon: Check
              },
              {
                title: "Priority Support",
                description: "Get help from our team when you need it (Pro+)",
                icon: Check
              },
            ].map((feature, index) => (
              <Card key={index} className="luxury-card p-6">
                <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center gold-gradient">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-lg">What are credits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Credits are used to generate AI content. Different types of content require different amounts of credits. TTS uses 10 credits, videos use 50 credits, and lip-sync videos use 100 credits.
                </p>
              </CardContent>
            </Card>
            
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-lg">Do unused credits roll over?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Credits reset at the beginning of each billing period. We recommend using them before renewal to get the most value from your plan.
                </p>
              </CardContent>
            </Card>
            
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-lg">What payment methods are accepted?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards through Stripe. All payments are processed securely with industry-standard encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}