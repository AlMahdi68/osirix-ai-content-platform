"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wand2, Loader2, Palette, Trash2, Download, LayoutDashboard, Eye } from "lucide-react";
import { toast } from "sonner";

interface AILogo {
  id: number;
  name: string;
  prompt: string;
  imageUrl: string | null;
  style: string;
  colors: string[];
  status: string;
  createdAt: string;
}

export default function AILogosPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [logos, setLogos] = useState<AILogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<AILogo | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    prompt: "",
    style: "modern",
    colors: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchLogos();
    }
  }, [session]);

  const fetchLogos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/logos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogos(data.logos || []);
      }
    } catch (error) {
      console.error("Error fetching logos:", error);
      toast.error("Failed to load logos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const colorsArray = formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      const response = await fetch("/api/ai/logos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          prompt: formData.prompt,
          style: formData.style,
          colors: colorsArray,
          status: "generating",
        }),
      });

      if (response.ok) {
        toast.success("Logo generation started!");
        setShowForm(false);
        setFormData({
          name: "",
          prompt: "",
          style: "modern",
          colors: "",
        });
        fetchLogos();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate logo");
      }
    } catch (error) {
      console.error("Error generating logo:", error);
      toast.error("Failed to generate logo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this logo?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/logos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Logo deleted successfully");
        fetchLogos();
      } else {
        toast.error("Failed to delete logo");
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      toast.error("Failed to delete logo");
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Palette className="h-10 w-10 text-primary gold-glow" />
              AI Logo Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create stunning logos with AI-powered design
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-primary/30"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 gold-glow"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Logo
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30 gold-glow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Logo Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Tech Startup Logo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Design Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  placeholder="Describe your logo: modern tech company logo with geometric shapes..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="style">Style *</Label>
                  <Select
                    value={formData.style}
                    onValueChange={(value) =>
                      setFormData({ ...formData, style: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="geometric">Geometric</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma-separated) *</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) =>
                      setFormData({ ...formData, colors: e.target.value })
                    }
                    placeholder="gold, black, white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Logo
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {logos.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No logos yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first AI-powered logo
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Logo
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {logos.map((logo) => (
              <Card
                key={logo.id}
                className="p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                  {logo.status === "completed" && logo.imageUrl ? (
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : logo.status === "generating" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Generating...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Palette className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Failed
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                    {logo.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {logo.style} style
                  </p>
                </div>

                <div className="flex gap-1 mb-3">
                  {logo.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  {logo.status === "completed" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setPreviewLogo(logo)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(logo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewLogo} onOpenChange={() => setPreviewLogo(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                {previewLogo?.name}
              </DialogTitle>
            </DialogHeader>
            {previewLogo && (
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {previewLogo.imageUrl && (
                    <img
                      src={previewLogo.imageUrl}
                      alt={previewLogo.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Style</p>
                    <p className="capitalize">{previewLogo.style}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Prompt</p>
                    <p className="text-sm">{previewLogo.prompt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Colors</p>
                    <div className="flex gap-2">
                      {previewLogo.colors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border border-border"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}