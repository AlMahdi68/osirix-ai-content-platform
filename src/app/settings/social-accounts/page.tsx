"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  Loader2,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface SocialAccount {
  id: number;
  platform: string;
  platformUsername: string;
  platformUserId: string;
  isConnected: boolean;
  tokenExpiresAt: string | null;
  lastRefreshedAt: string | null;
  metadata: any;
  createdAt: string;
}

const PLATFORMS = [
  {
    id: "twitter",
    name: "Twitter (X)",
    icon: Twitter,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    description: "Connect to schedule tweets and track engagement",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    description: "Post to your Facebook page and track insights",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Share photos and videos to your Instagram feed",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    description: "Post professional content to LinkedIn",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Upload videos to your YouTube channel",
  },
];

export default function SocialAccountsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnectAccountId, setDisconnectAccountId] = useState<number | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [refreshing, setRefreshing] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAccounts();
    }
  }, [session]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/social/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      toast.error("Failed to load social accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    setConnecting(platform);
    try {
      const token = localStorage.getItem("bearer_token");
      const redirectUrl = `${window.location.origin}/api/auth/callback/social`;

      const response = await fetch("/api/social/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, redirectUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle iframe compatibility
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          window.parent.postMessage(
            { type: "OPEN_EXTERNAL_URL", data: { url: data.authUrl } },
            "*"
          );
          toast.info("Opening authorization window...");
        } else {
          window.location.href = data.authUrl;
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to initiate connection");
      }
    } catch (error) {
      toast.error("Failed to connect platform");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnectAccount = async () => {
    if (!disconnectAccountId) return;

    setDisconnecting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/accounts/${disconnectAccountId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Account disconnected successfully");
        setDisconnectAccountId(null);
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to disconnect account");
      }
    } catch (error) {
      toast.error("Failed to disconnect account");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleRefreshToken = async (accountId: number, platform: string) => {
    setRefreshing(accountId);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/accounts/${accountId}/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success(`${platform} token refreshed successfully`);
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to refresh token");
      }
    } catch (error) {
      toast.error("Failed to refresh token");
    } finally {
      setRefreshing(null);
    }
  };

  const getAccountForPlatform = (platformId: string) => {
    return accounts.find(acc => acc.platform === platformId);
  };

  const isTokenExpired = (account: SocialAccount) => {
    if (!account.tokenExpiresAt) return false;
    return new Date(account.tokenExpiresAt) < new Date();
  };

  if (isPending || loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Social Media Accounts</h2>
          <p className="text-muted-foreground">
            Connect your social media accounts to enable automated posting and content distribution
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Why Connect Social Accounts?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Schedule posts across all platforms from one place</li>
                  <li>• Let OZ Agent automatically distribute your content</li>
                  <li>• Track engagement and analytics in real-time</li>
                  <li>• Save time with automated cross-posting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              {accounts.filter(a => a.isConnected).length} of {PLATFORMS.length} platforms connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {PLATFORMS.map((platform) => {
                const account = getAccountForPlatform(platform.id);
                const Icon = platform.icon;
                return (
                  <Badge
                    key={platform.id}
                    variant={account?.isConnected ? "default" : "outline"}
                    className={
                      account?.isConnected
                        ? "bg-primary/20 text-primary border-primary/30"
                        : ""
                    }
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {platform.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {PLATFORMS.map((platform) => {
            const account = getAccountForPlatform(platform.id);
            const isConnected = account?.isConnected;
            const isExpired = account ? isTokenExpired(account) : false;
            const Icon = platform.icon;
            const isConnectingThis = connecting === platform.id;
            const isRefreshingThis = account && refreshing === account.id;

            return (
              <Card
                key={platform.id}
                className={
                  isConnected
                    ? "border-primary/30 bg-gradient-to-br from-card to-card/50"
                    : "border-dashed"
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                        <Icon className={`h-6 w-6 ${platform.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        {isConnected && account ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-green-500 border-green-500"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                            {isExpired && (
                              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="mt-1">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>

                  {isConnected && account && (
                    <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Username:</span>
                        <span className="font-medium">@{account.platformUsername}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Connected:</span>
                        <span className="font-medium">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {account.lastRefreshedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Refresh:</span>
                          <span className="font-medium">
                            {new Date(account.lastRefreshedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {account.tokenExpiresAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Token Expires:</span>
                          <span
                            className={`font-medium ${
                              isExpired ? "text-yellow-500" : ""
                            }`}
                          >
                            {new Date(account.tokenExpiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isConnected && account ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRefreshToken(account.id, platform.name)}
                          disabled={isRefreshingThis}
                        >
                          {isRefreshingThis ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Refreshing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refresh Token
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDisconnectAccountId(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleConnectPlatform(platform.id)}
                        disabled={isConnectingThis}
                      >
                        {isConnectingThis ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Connect {platform.name}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Having trouble connecting your social media accounts? Here are some resources:
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/oz" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  OZ Guide
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const event = new CustomEvent("openSupportChat");
                  window.dispatchEvent(event);
                }}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog
        open={disconnectAccountId !== null}
        onOpenChange={() => setDisconnectAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this social media account? You'll need
              to reconnect it to schedule posts again. Any scheduled posts for this
              account will remain but won't be published.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectAccount}
              disabled={disconnecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {disconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
