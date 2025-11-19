"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Plan {
  id: number;
  name: string;
  price: number;
  creditsMonthly: number;
  features: string[];
  isActive: boolean;
}

export default function PlansPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number, planName: string) => {
    if (!session?.user) {
      toast.error("Please login to subscribe");
      router.push("/login");
      return;
    }

    setPurchasing(planId);
    
    try {
      // In a real implementation, this would integrate with Stripe or another payment provider
      toast.success(`Subscription to ${planName} plan initiated!`);
      
      // Simulate subscription success
      setTimeout(() => {
        toast.success(`Welcome to ${planName}!`);
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Subscription failed");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Osirix</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your content creation needs
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-12 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isPopular = plan.name === "Starter";
              return (
                <Card key={plan.id} className={isPopular ? "border-primary shadow-lg" : ""}>
                  {isPopular && (
                    <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${(plan.price / 100).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription className="mt-2">
                      {plan.creditsMonthly} credits per month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id, plan.name)}
                      disabled={purchasing !== null}
                    >
                      {purchasing === plan.id ? "Processing..." : plan.price === 0 ? "Get Started" : "Subscribe"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What are credits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Credits are used to generate AI content. Different types of content require different amounts of credits. TTS typically uses 10 credits, videos use 50 credits, and lip-sync videos use 100 credits.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I upgrade or downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and your billing will be prorated.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do unused credits roll over?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Credits expire at the end of each billing period. We recommend using them before your renewal date. Upgrade to a higher tier for more credits.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
