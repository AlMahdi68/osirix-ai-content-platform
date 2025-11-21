"use client";

import { useCustomer } from "autumn-js/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PlanUsageIndicator() {
  const { customer, isLoading } = useCustomer();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const planName = customer?.products?.at(-1)?.name || "Free";
  const features = Object.values(customer?.features || {}).filter(
    (feature: any) => feature && feature.feature_id
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            {planName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.length > 0 ? (
          features.map((feature: any) => {
            const hasLimit = typeof feature.included_usage === 'number';
            const usage = feature.usage || 0;
            const limit = feature.included_usage;
            const percentage = hasLimit ? Math.min(100, (usage / limit) * 100) : 0;
            const isNearLimit = percentage > 75;
            const isAtLimit = percentage >= 90;
            const featureName = feature.feature_id?.replace(/_/g, ' ') || 'Unknown Feature';

            return (
              <div key={feature.feature_id || Math.random()} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {featureName}
                  </span>
                  <span className="font-mono text-xs font-medium">
                    {usage}
                    {hasLimit ? `/${limit}` : ' used'}
                  </span>
                </div>
                
                {hasLimit && (
                  <Progress 
                    value={percentage} 
                    className={cn(
                      "h-2",
                      isAtLimit && "[&>div]:bg-destructive",
                      isNearLimit && !isAtLimit && "[&>div]:bg-yellow-500"
                    )}
                  />
                )}

                {isAtLimit && hasLimit && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Limit reached
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">
            <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No usage data yet</p>
          </div>
        )}

        <Link href="/plans" className="block">
          <Button variant="outline" size="sm" className="w-full mt-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}