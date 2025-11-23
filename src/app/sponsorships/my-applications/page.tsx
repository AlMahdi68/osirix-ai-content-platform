"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

interface Application {
  id: number;
  pitch: string;
  expectedReach: number;
  portfolioLinks: string[];
  status: string;
  appliedAt: string;
  reviewedAt: string | null;
  opportunity: {
    id: number;
    title: string;
    category: string;
    budgetMin: number;
    budgetMax: number;
    durationDays: number;
  };
  brand: {
    id: string;
    name: string;
    email: string;
  };
}

export default function MyApplicationsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
      return;
    }
    if (session?.user) {
      fetchApplications();
    }
  }, [session, isPending, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/sponsorships/applications?role=influencer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track your sponsorship applications and their status
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            You haven't applied to any opportunities yet
          </p>
          <Link href="/sponsorships">
            <Button>Browse Opportunities</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "accepted":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "completed":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const budgetDisplay = `$${(application.opportunity.budgetMin / 100).toFixed(
    0
  )} - $${(application.opportunity.budgetMax / 100).toFixed(0)}`;

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/20 text-primary">
              {application.opportunity.category}
            </Badge>
            <Badge className={getStatusColor(application.status)}>
              {application.status}
            </Badge>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {application.opportunity.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Brand: {application.brand.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-400" />
          <span>{budgetDisplay}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{application.opportunity.durationDays} days</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Applied: {new Date(application.appliedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Your Pitch:</h4>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {application.pitch}
        </p>
      </div>

      <Link href={`/sponsorships/${application.opportunity.id}`}>
        <Button variant="outline" className="w-full">
          View Opportunity
        </Button>
      </Link>
    </Card>
  );
}
