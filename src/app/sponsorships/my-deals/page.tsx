"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Handshake,
  DollarSign,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Deal {
  id: number;
  agreedPayment: number;
  deliverables: any;
  status: string;
  contentUrls: string[] | null;
  paymentReleasedAt: string | null;
  createdAt: string;
  opportunity: {
    title: string;
    category: string;
    description: string;
  };
  brand?: {
    name: string;
    email: string;
  };
  influencer?: {
    name: string;
    email: string;
  };
}

export default function MyDealsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [contentUrl1, setContentUrl1] = useState("");
  const [contentUrl2, setContentUrl2] = useState("");
  const [contentUrl3, setContentUrl3] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
      return;
    }
    if (session?.user) {
      fetchDeals();
    }
  }, [session, isPending, router]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sponsorships/deals?role=influencer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContent = async (dealId: number) => {
    const contentUrls = [contentUrl1, contentUrl2, contentUrl3].filter(
      (url) => url.trim() !== ""
    );

    if (contentUrls.length === 0) {
      toast.error("Please provide at least one content URL");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/sponsorships/deals/${dealId}/submit-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentUrls }),
      });

      if (response.ok) {
        toast.success("Content submitted successfully!");
        setSelectedDeal(null);
        setContentUrl1("");
        setContentUrl2("");
        setContentUrl3("");
        fetchDeals();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit content");
      }
    } catch (error) {
      console.error("Failed to submit content:", error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Deals</h1>
        <p className="text-muted-foreground">
          Manage your active sponsorship deals and track earnings
        </p>
      </div>

      {deals.length === 0 ? (
        <Card className="p-12 text-center">
          <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            You don't have any active deals yet
          </p>
          <Link href="/sponsorships">
            <Button>Browse Opportunities</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/20 text-primary">
                      {deal.opportunity.category}
                    </Badge>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {deal.opportunity.title}
                  </h3>
                  {deal.brand && (
                    <p className="text-sm text-muted-foreground">
                      Brand: {deal.brand.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Earnings</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(deal.agreedPayment / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {deal.status === "active" && (
                <>
                  {selectedDeal?.id === deal.id ? (
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <h4 className="font-semibold mb-3">Submit Your Content</h4>
                      <div className="space-y-3">
                        <Input
                          type="url"
                          value={contentUrl1}
                          onChange={(e) => setContentUrl1(e.target.value)}
                          placeholder="https://instagram.com/p/your-post"
                        />
                        <Input
                          type="url"
                          value={contentUrl2}
                          onChange={(e) => setContentUrl2(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... (optional)"
                        />
                        <Input
                          type="url"
                          value={contentUrl3}
                          onChange={(e) => setContentUrl3(e.target.value)}
                          placeholder="https://tiktok.com/@.../video/... (optional)"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitContent(deal.id)}
                            disabled={submitting}
                            className="flex-1"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Submit Content
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedDeal(null)}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Button
                      onClick={() => setSelectedDeal(deal)}
                      className="w-full gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Submit Content
                    </Button>
                  )}
                </>
              )}

              {deal.status === "content_submitted" && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>Waiting for brand approval</span>
                </div>
              )}

              {deal.status === "paid" && deal.paymentReleasedAt && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    Payment received on{" "}
                    {new Date(deal.paymentReleasedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {deal.contentUrls && deal.contentUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Submitted Content:</h4>
                  <div className="space-y-1">
                    {deal.contentUrls.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-500/20 text-blue-400";
    case "content_submitted":
      return "bg-yellow-500/20 text-yellow-400";
    case "approved":
      return "bg-green-500/20 text-green-400";
    case "paid":
      return "bg-green-500/20 text-green-400";
    case "disputed":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}
