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
  Sparkles
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Osirix",
    description: "Your AI-powered content creation platform. Let's take a quick tour to help you get started with creating stunning videos in minutes.",
    icon: <Crown className="h-16 w-16" />,
    color: "text-primary"
  },
  {
    id: 2,
    title: "Create AI Videos",
    description: "Generate professional videos with AI avatars and perfect lip-sync. Upload your avatar, write your script, and let AI do the rest.",
    icon: <Video className="h-16 w-16" />,
    color: "text-primary"
  },
  {
    id: 3,
    title: "Natural Voice Synthesis",
    description: "Convert text to natural-sounding speech with ElevenLabs integration. Choose from multiple voices and languages for your content.",
    icon: <Mic className="h-16 w-16" />,
    color: "text-primary"
  },
  {
    id: 4,
    title: "Publish & Monetize",
    description: "Schedule posts to social media platforms automatically. Sell your content in the marketplace and earn from your creations.",
    icon: <ShoppingBag className="h-16 w-16" />,
    color: "text-primary"
  },
  {
    id: 5,
    title: "You're All Set!",
    description: "Start creating amazing AI content today. You have 100 free credits to get you started. Upgrade anytime for more features.",
    icon: <Sparkles className="h-16 w-16" />,
    color: "text-primary"
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
    // Mark onboarding as completed
    localStorage.setItem("onboarding_completed", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="container max-w-3xl p-4">
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
              <div className={`${step.color} mx-auto w-fit p-4 rounded-2xl bg-primary/10 gold-glow`}>
                {step.icon}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">{step.title}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {step.description}
                </p>
              </div>

              {/* Feature Highlights for specific steps */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <Crown className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm font-semibold">Premium Quality</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <Sparkles className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm font-semibold">AI-Powered</p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="p-6 rounded-lg border border-primary/30 bg-primary/5 mt-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Crown className="h-6 w-6 text-primary" />
                    <p className="text-lg font-semibold text-primary">Free Plan Benefits</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>100 credits/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>1 custom avatar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>TTS generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Video generation</span>
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
                Skip Tour
              </Button>

              <Button
                onClick={handleNext}
                className="gap-2 bg-primary hover:bg-primary/90 gold-glow"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Get Started <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
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
