"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  X,
  Sparkles,
  DollarSign,
  ShoppingBag,
  Calendar,
  Video,
  Twitter,
  Instagram,
  Youtube,
  Zap,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: {
    label: string;
    path: string;
  };
  checkApi?: string;
}

export function InteractiveTutorial() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState<TutorialStep[]>([
    {
      id: "register",
      title: "Create Your Account",
      description: "Get started with 100 free credits",
      icon: <Sparkles className="h-5 w-5" />,
      completed: false,
      checkApi: "/api/dashboard/stats"
    },
    {
      id: "social",
      title: "Connect Social Media",
      description: "Link Twitter, Instagram, or YouTube",
      icon: <Calendar className="h-5 w-5" />,
      completed: false,
      action: {
        label: "Connect Now",
        path: "/settings/social-accounts"
      },
      checkApi: "/api/social/accounts"
    },
    {
      id: "logo",
      title: "Generate Your First Logo",
      description: "Create AI-powered designs in seconds",
      icon: <ShoppingBag className="h-5 w-5" />,
      completed: false,
      action: {
        label: "Create Logo",
        path: "/ai/logos"
      },
      checkApi: "/api/ai/logos"
    },
    {
      id: "oz",
      title: "Talk to OZ Agent",
      description: "Get personalized money-making strategy",
      icon: <Target className="h-5 w-5" />,
      completed: false,
      action: {
        label: "Meet OZ",
        path: "/oz"
      }
    },
    {
      id: "post",
      title: "Create Social Media Post",
      description: "Schedule your first automated post",
      icon: <Video className="h-5 w-5" />,
      completed: false,
      action: {
        label: "Create Post",
        path: "/social"
      },
      checkApi: "/api/social/posts"
    }
  ]);

  useEffect(() => {
    const tutorialDismissed = localStorage.getItem("tutorial_dismissed");
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    
    if (!tutorialDismissed && onboardingCompleted) {
      setTimeout(() => setIsVisible(true), 1000);
      checkProgress();
    }
  }, []);

  const checkProgress = async () => {
    const token = localStorage.getItem("bearer_token");
    if (!token) return;

    const updatedSteps = [...steps];

    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      if (step.checkApi) {
        try {
          const response = await fetch(step.checkApi, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Check if step is completed based on API response
            if (step.id === "register") {
              updatedSteps[i].completed = true;
            } else if (step.id === "social") {
              updatedSteps[i].completed = Array.isArray(data) ? data.length > 0 : false;
            } else if (step.id === "logo") {
              updatedSteps[i].completed = Array.isArray(data) ? data.length > 0 : false;
            } else if (step.id === "post") {
              updatedSteps[i].completed = data.posts?.length > 0;
            }
          }
        } catch (error) {
          console.error(`Error checking ${step.id}:`, error);
        }
      }
    }

    setSteps(updatedSteps);
  };

  const handleAction = (path: string) => {
    router.push(path);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("tutorial_dismissed", "true");
    setIsVisible(false);
    toast.success("You can reopen this tutorial anytime from the dashboard");
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 animate-in slide-in-from-bottom-4">
      <Card className="border-primary/30 shadow-2xl gold-glow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quick Start Guide</h3>
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {steps.length} completed
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={progress} className="h-2 mb-6" />

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${
                    step.completed
                      ? "border-primary/30 bg-primary/5"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${step.completed ? "text-primary" : "text-muted-foreground"}`}>
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <h4 className="font-semibold text-sm">{step.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      {step.action && !step.completed && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(step.action!.path)}
                          className="h-8 text-xs"
                        >
                          {step.action.label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      {step.completed && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Completed ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {completedCount === steps.length && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="font-bold text-green-400 mb-1">You're Ready!</p>
              <p className="text-xs text-muted-foreground">
                Start making money with Osirix AI
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
