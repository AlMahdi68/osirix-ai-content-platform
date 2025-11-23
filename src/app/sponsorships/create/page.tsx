"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CATEGORIES = [
  "fashion",
  "tech",
  "fitness",
  "beauty",
  "gaming",
  "lifestyle",
  "travel",
  "food",
];

export default function CreateOpportunityPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [slotsAvailable, setSlotsAvailable] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [engagementRate, setEngagementRate] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleCreate = async () => {
    if (
      !title ||
      !description ||
      !category ||
      !budgetMin ||
      !budgetMax ||
      !durationDays ||
      !slotsAvailable
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const budgetMinCents = parseFloat(budgetMin) * 100;
    const budgetMaxCents = parseFloat(budgetMax) * 100;

    if (budgetMinCents >= budgetMaxCents) {
      toast.error("Maximum budget must be greater than minimum budget");
      return;
    }

    const requirements: any = {};
    if (minFollowers) requirements.min_followers = parseInt(minFollowers);
    if (platforms) requirements.platforms = platforms.split(",").map((p) => p.trim());
    if (engagementRate) requirements.engagement_rate = engagementRate;

    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sponsorships/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          budgetMin: budgetMinCents,
          budgetMax: budgetMaxCents,
          requirements,
          durationDays: parseInt(durationDays),
          slotsAvailable: parseInt(slotsAvailable),
        }),
      });

      if (response.ok) {
        toast.success("Opportunity created successfully!");
        router.push("/sponsorships");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create opportunity");
      }
    } catch (error) {
      console.error("Failed to create opportunity:", error);
      toast.error("An error occurred");
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
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Link href="/sponsorships">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>

      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">Create Sponsorship Opportunity</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Fashion Campaign - Instagram Influencers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the campaign goals, deliverables, and expectations..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Duration (days) *
              </label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="e.g., 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Budget ($) *
              </label>
              <Input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Budget ($) *
              </label>
              <Input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="e.g., 1500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slots Available *
            </label>
            <Input
              type="number"
              value={slotsAvailable}
              onChange={(e) => setSlotsAvailable(e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Requirements (Optional)</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Followers
                </label>
                <Input
                  type="number"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Platforms (comma-separated)
                </label>
                <Input
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  placeholder="e.g., instagram, tiktok, youtube"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Engagement Rate
                </label>
                <Input
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value)}
                  placeholder="e.g., 4%"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Opportunity
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
