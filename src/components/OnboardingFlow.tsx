"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, 
  Mic, 
  ShoppingBag, 
  Calendar, 
  Crown,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  DollarSign,
  TrendingUp,
  Zap,
  Target
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  revenue?: string;
  workflow?: string[];
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Your Money-Making Machine",
    description: "Osirix is not just a tool - it's your AI employee that works 24/7 to generate income. In the next 2 minutes, you'll learn EXACTLY how you'll make money.",
    icon: <DollarSign className="h-16 w-16" />,
    color: "text-primary",
    revenue: "$500-$10,000+/month"
  },
  {
    id: 2,
    title: "Workflow #1: Sell AI-Generated Products",
    description: "Create digital products (logos, characters, videos) with AI and sell them in our marketplace. Each product sells for $10-$500.",
    icon: <ShoppingBag className="h-16 w-16" />,
    color: "text-primary",
    revenue: "$200-$2,000/month",
    workflow: [
      "Click 'AI Tools' → Generate 10 logos in 30 minutes",
      "List them in Marketplace at $50-$200 each",
      "Osirix auto-promotes to thousands of buyers",
      "Get paid instantly when products sell"
    ]
  },
  {
    id: 3,
    title: "Workflow #2: Automated Social Media Empire",
    description: "OZ creates content, schedules posts, and publishes automatically across all platforms. You earn from monetization, brand deals, and affiliate links.",
    icon: <Calendar className="h-16 w-16" />,
    color: "text-primary",
    revenue: "$300-$5,000/month",
    workflow: [
      "Connect your social accounts (YouTube, Instagram, Twitter)",
      "AI Manager creates 30 days of content in 10 minutes",
      "Auto-publishes at optimal times for maximum reach",
      "Earn from ads, sponsorships, and product promotions"
    ]
  },
  {
    id: 4,
    title: "Workflow #3: AI Video Production Service",
    description: "Offer professional video creation services. Generate lip-synced videos with AI avatars and charge $100-$500 per video.",
    icon: <Video className="h-16 w-16" />,
    color: "text-primary",
    revenue: "$1,000-$5,000/month",
    workflow: [
      "Create custom avatar for client in 5 minutes",
      "Input client's script → AI generates video",
      "Perfect lip-sync + professional voice in 10 minutes",
      "Deliver to client → Get paid $100-$500/video"
    ]
  },
  {
    id: 5,
    title: "Your 30-Day Money-Making Plan",
    description: "Follow this exact roadmap and you'll be making money within 30 days. OZ will guide you every step of the way.",
    icon: <Target className="h-16 w-16" />,
    color: "text-primary",
    revenue: "Start earning in 30 days"
  }
];

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="container max-w-4xl p-4">
        <Card className="border-primary/30 shadow-2xl gold-glow">
          <CardContent className="p-12">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {steps.map((s, index) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        index <= currentStep
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                          index < currentStep ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-12 space-y-8">
              <div className={`${step.color} mx-auto w-fit p-4 rounded-2xl bg-primary/10 gold-glow float-animation`}>
                {step.icon}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">{step.title}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {step.description}
                </p>
                
                {/* Revenue Potential Badge */}
                {step.revenue && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Revenue: {step.revenue}
                  </div>
                )}
              </div>

              {/* Workflow Steps */}
              {step.workflow && (
                <div className="bg-card border border-primary/20 rounded-xl p-6 text-left max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                    <Zap className="h-5 w-5" />
                    Precise Workflow:
                  </div>
                  <ol className="space-y-3">
                    {step.workflow.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Welcome Step Features */}
              {currentStep === 0 && (
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-6 rounded-lg border border-green-500/30 bg-green-500/5">
                    <TrendingUp className="h-8 w-8 text-green-400 mb-2 mx-auto" />
                    <p className="text-sm font-semibold text-green-400">Real Money</p>
                    <p className="text-xs text-muted-foreground mt-1">Not passive income hype</p>
                  </div>
                  <div className="p-6 rounded-lg border border-primary/30 bg-primary/5">
                    <Zap className="h-8 w-8 text-primary mb-2 mx-auto" />
                    <p className="text-sm font-semibold text-primary">AI Automation</p>
                    <p className="text-xs text-muted-foreground mt-1">Works while you sleep</p>
                  </div>
                  <div className="p-6 rounded-lg border border-primary/30 bg-primary/5">
                    <Crown className="h-8 w-8 text-primary mb-2 mx-auto" />
                    <p className="text-sm font-semibold text-primary">Proven System</p>
                    <p className="text-xs text-muted-foreground mt-1">Tested workflows</p>
                  </div>
                </div>
              )}

              {/* Final Step - 30 Day Plan */}
              {currentStep === 4 && (
                <div className="space-y-4 mt-8">
                  <div className="p-6 rounded-lg border border-primary/30 bg-primary/5 text-left">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Week 1-2: Setup & First Sale
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Connect 3 social media accounts (5 min)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Generate 5 logos with AI, list in marketplace ($250-500)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Create 1 AI character, sell for $100-300</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-lg border border-primary/30 bg-primary/5 text-left">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Week 3-4: Scale & Automate
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Enable AI Manager to auto-post content (3 times/day)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Offer video creation service on Fiverr/Upwork ($500-1000)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Generate 30-day content calendar, schedule everything</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl border-2 border-green-500/50 bg-green-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Earnings (Month 1)</p>
                          <p className="text-2xl font-bold text-green-400">$500 - $2,000</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push('/oz')}
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        See Full Plan with OZ
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip (I'll Read Later)
              </Button>

              <Button
                onClick={handleNext}
                className="gap-2 bg-primary hover:bg-primary/90 gold-glow"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Start Making Money <DollarSign className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Workflow <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}