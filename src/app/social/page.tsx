"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Send, Twitter, Facebook, Instagram, Linkedin, Clock, CheckCircle, XCircle, Edit2, Trash2, MoreVertical, Lock, Link as LinkIcon, Youtube, Unlink, RefreshCw, TrendingUp, Eye, Heart, MousePointerClick, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCustomer } from "autumn-js/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SocialAccount {
  id: number;
  platform: string;
  platformUsername: string;
  isConnected: boolean;
  tokenExpiresAt: string | null;
  lastRefreshedAt: string | null;
  metadata: any;
}

interface SocialPost {
  id: number;
  platform: string;
  content: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  status: string;
  impressions: number;
  engagements: number;
  clicks: number;
  errorMessage: string | null;
  createdAt: string;
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [disconnectAccountId, setDisconnectAccountId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { check, isLoading: checkingAccess } = useCustomer();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkFeatureAccess();
    fetchAccounts();
    fetchPosts();
  }, []);

  const checkFeatureAccess = async () => {
    try {
      const { data } = await check({ featureId: "social_scheduling" });
      setHasAccess(data.allowed);
    } catch (error) {
      console.error("Failed to check access:", error);
      setHasAccess(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
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
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/social/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        toast.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const redirectUrl = `${window.location.origin}/api/auth/callback/social`;
      
      const response = await fetch("/api/social/accounts/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, redirectUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to initiate connection");
      }
    } catch (error) {
      toast.error("Failed to connect platform");
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

  const handleRefreshToken = async (accountId: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/accounts/${accountId}/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Token refreshed successfully");
        fetchAccounts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to refresh token");
      }
    } catch (error) {
      toast.error("Failed to refresh token");
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const platform = formData.get("platform") as string;
    const content = formData.get("content") as string;
    const scheduledAt = formData.get("scheduledAt") as string;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/social/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform,
          content,
          scheduledAt: scheduledAt || null,
          mediaUrls: [],
        }),
      });

      if (response.ok) {
        toast.success("Post scheduled successfully!");
        setDialogOpen(false);
        fetchPosts();
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to schedule post");
      }
    } catch (error) {
      toast.error("Failed to schedule post");
    } finally {
      setCreating(false);
    }
  };

  const handleEditPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;

    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const scheduledAt = formData.get("scheduledAt") as string;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          scheduledAt: scheduledAt || null,
        }),
      });

      if (response.ok) {
        toast.success("Post updated successfully!");
        setEditingPost(null);
        setDialogOpen(false);
        fetchPosts();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update post");
      }
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    setDeleting(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/posts/${deletePostId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        setDeletePostId(null);
        fetchPosts();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishNow = async (postId: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/social/posts/${postId}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Post published successfully!");
        fetchPosts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to publish post");
      }
    } catch (error) {
      toast.error("Failed to publish post");
    }
  };

  const openEditDialog = (post: SocialPost) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      default:
        return <Send className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const isConnected = (platform: string) => {
    return accounts.some(acc => acc.platform === platform && acc.isConnected);
  };

  if (checkingAccess || hasAccess === null) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking access...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-6 w-6 text-muted-foreground" />
                <CardTitle>Premium Feature</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Social media scheduling is available on Starter plan and above. Upgrade to unlock this feature.
              </p>
              <Link href="/plans">
                <Button className="w-full">
                  Upgrade to Starter Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Social Media</h2>
            <p className="text-muted-foreground">Connect accounts and schedule posts automatically</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings/social-accounts">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage Accounts
              </Button>
            </Link>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingPost(null);
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Edit Post" : "Schedule Social Media Post"}</DialogTitle>
                  <DialogDescription>
                    {editingPost ? "Update your scheduled post" : "Create and schedule content for your social platforms"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={editingPost ? handleEditPost : handleCreatePost} className="space-y-4">
                  {!editingPost && (
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select name="platform" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {isConnected("twitter") && <SelectItem value="twitter">Twitter</SelectItem>}
                          {isConnected("facebook") && <SelectItem value="facebook">Facebook</SelectItem>}
                          {isConnected("instagram") && <SelectItem value="instagram">Instagram</SelectItem>}
                          {isConnected("linkedin") && <SelectItem value="linkedin">LinkedIn</SelectItem>}
                          {isConnected("youtube") && <SelectItem value="youtube">YouTube</SelectItem>}
                        </SelectContent>
                      </Select>
                      {accounts.filter(a => a.isConnected).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No platforms connected. <Link href="/settings/social-accounts" className="text-primary hover:underline">Connect accounts</Link> to get started.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="What would you like to share?"
                      rows={4}
                      required
                      disabled={creating}
                      defaultValue={editingPost?.content || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">Schedule Date & Time (Optional)</Label>
                    <Input
                      id="scheduledAt"
                      name="scheduledAt"
                      type="datetime-local"
                      disabled={creating}
                      defaultValue={editingPost?.scheduledAt ? new Date(editingPost.scheduledAt).toISOString().slice(0, 16) : ""}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={creating}>
                      {creating ? "Saving..." : editingPost ? "Update Post" : "Schedule Post"}
                    </Button>
                    {editingPost && (
                      <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditingPost(null); }} disabled={creating}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts & Schedule</TabsTrigger>
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Twitter</CardTitle>
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.platform === "twitter").length}
                  </div>
                  <p className="text-xs text-muted-foreground">posts scheduled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Facebook</CardTitle>
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.platform === "facebook").length}
                  </div>
                  <p className="text-xs text-muted-foreground">posts scheduled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Instagram</CardTitle>
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.platform === "instagram").length}
                  </div>
                  <p className="text-xs text-muted-foreground">posts scheduled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">LinkedIn</CardTitle>
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.platform === "linkedin").length}
                  </div>
                  <p className="text-xs text-muted-foreground">posts scheduled</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">{getPlatformIcon(post.platform)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold capitalize">{post.platform}</h3>
                              <Badge variant={post.status === "published" ? "default" : post.status === "failed" ? "destructive" : "secondary"}>
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.content}
                            </p>
                            {post.status === "published" && (
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {post.impressions} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {post.engagements} engagements
                                </span>
                                <span className="flex items-center gap-1">
                                  <MousePointerClick className="h-3 w-3" />
                                  {post.clicks} clicks
                                </span>
                              </div>
                            )}
                            {post.errorMessage && (
                              <p className="text-xs text-red-500 mb-2">
                                Error: {post.errorMessage}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {post.scheduledAt
                                ? `Scheduled for: ${new Date(post.scheduledAt).toLocaleString()}`
                                : post.publishedAt
                                ? `Published: ${new Date(post.publishedAt).toLocaleString()}`
                                : `Created: ${new Date(post.createdAt).toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          {post.status !== "published" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(post.status === "draft" || post.status === "scheduled") && (
                                  <DropdownMenuItem onClick={() => handlePublishNow(post.id)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Publish Now
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => { setEditingPost(post); setDialogOpen(true); }}>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setDeletePostId(post.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts scheduled</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first social media post to get started
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Connect Social Media Accounts</CardTitle>
                    <CardDescription>
                      Link your social media accounts to enable automated posting
                    </CardDescription>
                  </div>
                  <Link href="/settings/social-accounts">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Advanced Settings
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {accountsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {["twitter", "facebook", "instagram", "linkedin", "youtube"].map((platform) => {
                      const account = accounts.find(a => a.platform === platform);
                      const connected = account?.isConnected;

                      return (
                        <Card key={platform} className={connected ? "border-primary/30" : "border-dashed"}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-primary/10">
                                  {getPlatformIcon(platform)}
                                </div>
                                <div>
                                  <h4 className="font-semibold capitalize flex items-center gap-2">
                                    {platform}
                                    {connected && (
                                      <Badge variant="outline" className="text-green-500 border-green-500">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Connected
                                      </Badge>
                                    )}
                                  </h4>
                                  {connected && account ? (
                                    <p className="text-sm text-muted-foreground">
                                      @{account.platformUsername}
                                      {account.tokenExpiresAt && new Date(account.tokenExpiresAt) < new Date() && (
                                        <span className="text-yellow-500 ml-2">(Token expired)</span>
                                      )}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      Not connected
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {connected && account ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRefreshToken(account.id)}
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Refresh
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDisconnectAccountId(account.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Unlink className="h-4 w-4 mr-2" />
                                      Disconnect
                                    </Button>
                                  </>
                                ) : (
                                  <Button onClick={() => handleConnectPlatform(platform)}>
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Connect
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Need Help Connecting?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Visit the OZ Guide for step-by-step instructions on connecting each social media platform, or use our support chat for instant help.
                </p>
                <div className="flex gap-2">
                  <Link href="/oz">
                    <Button variant="outline">
                      Visit OZ Guide
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const event = new CustomEvent("openSupportChat");
                      window.dispatchEvent(event);
                    }}
                  >
                    Chat with Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deletePostId !== null} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={disconnectAccountId !== null} onOpenChange={() => setDisconnectAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect this social media account? You'll need to reconnect it to post again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnectAccount} disabled={disconnecting} className="bg-red-600 hover:bg-red-700">
              {disconnecting ? "Disconnecting..." : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}