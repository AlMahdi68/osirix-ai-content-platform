"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Send, Twitter, Facebook, Instagram, Linkedin, Clock, CheckCircle, XCircle, Edit2, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SocialPost {
  id: number;
  platform: string;
  content: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Social Media</h2>
            <p className="text-muted-foreground">Schedule and publish content across platforms</p>
          </div>
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
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Button type="button" variant="outline" onClick={closeDialog} disabled={creating}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

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
                            <DropdownMenuItem onClick={() => openEditDialog(post)}>
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
    </DashboardLayout>
  );
}