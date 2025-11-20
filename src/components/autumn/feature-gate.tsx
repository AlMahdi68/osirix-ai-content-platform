"use client";

import { useCustomer } from "autumn-js/react";
import { useEffect, useState, ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export default function FeatureGate({ 
  featureId, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const { check, isLoading } = useCustomer();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (isLoading) return;
      
      setChecking(true);
      try {
        const { data } = await check({ featureId });
        setAllowed(data.allowed);
      } catch (error) {
        console.error("Failed to check feature access:", error);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [featureId, check, isLoading]);

  if (isLoading || checking || allowed === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Premium Feature</CardTitle>
            </div>
            <CardDescription>
              This feature requires a paid plan. Upgrade to unlock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/plans">
              <Button>
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    return null;
  }

  return <>{children}</>;
}
