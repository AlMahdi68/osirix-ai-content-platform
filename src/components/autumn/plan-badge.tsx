"use client";

import { useCustomer } from "autumn-js/react";
import { Crown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PlanBadge() {
  const { customer, isLoading } = useCustomer();

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  const currentPlan = customer?.products?.at(-1);
  const planName = currentPlan?.name || "Free";
  const isPaid = planName !== "Free";

  return (
    <Link href="/plans">
      <Badge 
        variant={isPaid ? "default" : "secondary"} 
        className="gap-1 cursor-pointer hover:opacity-80 transition-opacity"
      >
        {isPaid && <Crown className="h-3 w-3" />}
        {planName}
      </Badge>
    </Link>
  );
}
