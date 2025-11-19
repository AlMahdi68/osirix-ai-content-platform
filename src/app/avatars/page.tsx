"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Video, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface AvatarType {
  id: number;
  name: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  fileSize: number;
  duration: number | null;
  mimeType: string;
  isDefault: boolean;
  createdAt: string;
}

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/avatars", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAvatars(data.avatars || []);
      }
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
      toast.error("Failed to load avatars");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/avatars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          fileUrl: "https://storage.osirix.com/avatars/user-avatar-" + Date.now() + ".mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
          fileSize: 5242880,
          duration: 30,
          mimeType: "video/mp4",
          metadata: { resolution: "1920x1080", fps: 30 },
        }),
      });

      if (response.ok) {
        toast.success("Avatar uploaded successfully!");
        setDialogOpen(false);
        fetchAvatars();
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Failed to upload avatar");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Avatars</h2>
            <p className="text-muted-foreground">Manage your AI avatars for video generation</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Avatar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Avatar</DialogTitle>
                <DialogDescription>
                  Add a new avatar video to use in your content generation
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Avatar Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Professional Male"
                    required
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Video File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="video/*"
                    required
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: MP4 format, 1920x1080, 30fps
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Avatar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-40 w-full rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : avatars.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avatars.map((avatar) => (
              <Card key={avatar.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {avatar.thumbnailUrl ? (
                      <img
                        src={avatar.thumbnailUrl}
                        alt={avatar.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Video className="h-16 w-16 text-muted-foreground" />
                    )}
                    {avatar.isDefault && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Default
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{avatar.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {avatar.duration ? `${avatar.duration}s` : "N/A"} • {(avatar.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No avatars yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first avatar to start creating AI-powered videos
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Avatar
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
