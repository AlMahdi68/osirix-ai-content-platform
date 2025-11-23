"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Calendar,
  Users,
  Loader2,
  Award,
  CheckCircle2,
  ArrowLeft,
  Send,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
  applicationCount: number;
}

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [pitch, setPitch] = useState("");
  const [expectedReach, setExpectedReach] = useState("");
  const [portfolioLink1, setPortfolioLink1] = useState("");
  const [portfolioLink2, setPortfolioLink2] = useState("");
  const [portfolioLink3, setPortfolioLink3] = useState("");

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sponsorships/opportunities/${id}?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunity(data);
      } else {
        toast.error("Failed to load opportunity");
      }
    } catch (error) {
      console.error("Failed to fetch opportunity:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!pitch || pitch.length < 50) {
      toast.error("Pitch must be at least 50 characters");
      return;
    }

    if (!expectedReach || parseInt(expectedReach) <= 0) {
      toast.error("Please enter a valid expected reach");
      return;
    }

    const portfolioLinks = [portfolioLink1, portfolioLink2, portfolioLink3].filter(
      (link) => link.trim() !== ""
    );

    if (portfolioLinks.length === 0) {
      toast.error("Please provide at least one portfolio link");
      return;
    }

    try {
      setApplying(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sponsorships/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          opportunityId: id,
          pitch,
          expectedReach: parseInt(expectedReach),
          portfolioLinks,
        }),
      });

      if (response.ok) {
        toast.success("Application submitted successfully!");
        router.push("/sponsorships/my-applications");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      toast.error("An error occurred");
    } finally {
      setApplying(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-muted-foreground">Opportunity not found</p>
        <Link href="/sponsorships">
          <Button className="mt-4">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const slotsRemaining = opportunity.slotsAvailable - opportunity.slotsFilled;
  const budgetDisplay = `$${(opportunity.budgetMin / 100).toFixed(0)} - $${(
    opportunity.budgetMax / 100
  ).toFixed(0)}`;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Link href="/sponsorships">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>

      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge className="bg-primary/20 text-primary mb-2">
              {opportunity.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {opportunity.brandName}
            </p>
          </div>
          {slotsRemaining > 0 ? (
            <Badge className="bg-green-500/20 text-green-400">
              {slotsRemaining} slots available
            </Badge>
          ) : (
            <Badge variant="secondary">Fully Booked</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm text-muted-foreground">Budget</span>
            </div>
            <p className="text-xl font-bold text-green-400">{budgetDisplay}</p>
          </Card>

          <Card className="p-4 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <p className="text-xl font-bold">{opportunity.durationDays} days</p>
          </Card>

          <Card className="p-4 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <p className="text-xl font-bold">{opportunity.applicationCount}</p>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            {opportunity.description}
          </p>
        </div>

        {opportunity.requirements && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <div className="space-y-2">
              {opportunity.requirements.min_followers && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>
                    Minimum {opportunity.requirements.min_followers.toLocaleString()}{" "}
                    followers
                  </span>
                </div>
              )}
              {opportunity.requirements.platforms &&
                Array.isArray(opportunity.requirements.platforms) && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Platforms: {opportunity.requirements.platforms.join(", ")}
                    </span>
                  </div>
                )}
              {opportunity.requirements.engagement_rate && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>
                    Engagement rate: {opportunity.requirements.engagement_rate}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!showApplicationForm ? (
          <Button
            onClick={() => {
              if (!session?.user) {
                router.push("/login");
                return;
              }
              setShowApplicationForm(true);
            }}
            className="w-full gap-2 bg-green-600 hover:bg-green-500"
            disabled={slotsRemaining === 0}
          >
            <Send className="h-4 w-4" />
            {slotsRemaining === 0 ? "Fully Booked" : "Apply Now"}
          </Button>
        ) : (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Submit Application</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Pitch (min 50 characters) *
                </label>
                <Textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Explain why you're perfect for this campaign..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {pitch.length}/50 characters minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Reach *
                </label>
                <Input
                  type="number"
                  value={expectedReach}
                  onChange={(e) => setExpectedReach(e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Portfolio Links (at least 1 required) *
                </label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    value={portfolioLink1}
                    onChange={(e) => setPortfolioLink1(e.target.value)}
                    placeholder="https://instagram.com/your-post"
                  />
                  <Input
                    type="url"
                    value={portfolioLink2}
                    onChange={(e) => setPortfolioLink2(e.target.value)}
                    placeholder="https://youtube.com/your-video (optional)"
                  />
                  <Input
                    type="url"
                    value={portfolioLink3}
                    onChange={(e) => setPortfolioLink3(e.target.value)}
                    placeholder="https://tiktok.com/@your-profile (optional)"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 bg-green-600 hover:bg-green-500"
                >
                  {applying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  disabled={applying}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}
