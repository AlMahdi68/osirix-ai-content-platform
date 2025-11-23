"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Calendar,
  Users,
  Filter,
  Plus,
  Loader2,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";

interface Opportunity {
  id: number;
  brandUserId: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  requirements: any;
  durationDays: number;
  slotsAvailable: number;
  slotsFilled: number;
  status: string;
  createdAt: string;
  brandName: string;
  brandEmail: string;
  brandImage: string | null;
}

const CATEGORIES = [
  "All",
  "fashion",
  "tech",
  "fitness",
  "beauty",
  "gaming",
  "lifestyle",
  "travel",
  "food",
];

export default function SponsorshipsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [budgetRange, setBudgetRange] = useState("all");

  useEffect(() => {
    fetchOpportunities();
  }, [category, budgetRange]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (budgetRange && budgetRange !== "all") {
        const [min, max] = budgetRange.split("-");
        if (min) params.append("budgetMin", min);
        if (max) params.append("budgetMax", max);
      }

      const response = await fetch(`/api/sponsorships/opportunities?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Award className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Sponsorship Marketplace</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with brands and earn <span className="text-green-400 font-bold">$500-$5,000+</span> per campaign
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8 justify-center">
        {session?.user ? (
          <>
            <Link href="/sponsorships/create">
              <Button className="gap-2 bg-primary">
                <Plus className="h-4 w-4" />
                Post Opportunity (Brands)
              </Button>
            </Link>
            <Link href="/sponsorships/my-applications">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                My Applications
              </Button>
            </Link>
            <Link href="/sponsorships/my-deals">
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4" />
                My Deals
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <Button className="gap-2 bg-green-600 hover:bg-green-500">
              <DollarSign className="h-4 w-4" />
              Login to Start Earning
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="0-50000">$0 - $500</SelectItem>
                <SelectItem value="50000-100000">$500 - $1,000</SelectItem>
                <SelectItem value="100000-200000">$1,000 - $2,000</SelectItem>
                <SelectItem value="200000-999999999">$2,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : opportunities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No opportunities found. Try adjusting your filters.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const slotsRemaining = opportunity.slotsAvailable - opportunity.slotsFilled;
  const budgetDisplay = `$${(opportunity.budgetMin / 100).toFixed(0)} - $${(opportunity.budgetMax / 100).toFixed(0)}`;

  return (
    <Link href={`/sponsorships/${opportunity.id}`}>
      <Card className="p-6 h-full hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-primary/20 text-primary">
            {opportunity.category}
          </Badge>
          {slotsRemaining > 0 ? (
            <Badge className="bg-green-500/20 text-green-400">
              {slotsRemaining} slots left
            </Badge>
          ) : (
            <Badge variant="secondary">Full</Badge>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {opportunity.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="font-semibold text-green-400">{budgetDisplay}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{opportunity.durationDays} days</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{opportunity.brandName || "Brand"}</span>
          </div>
        </div>

        <Button className="w-full mt-4" variant="outline">
          View Details
        </Button>
      </Card>
    </Link>
  );
}