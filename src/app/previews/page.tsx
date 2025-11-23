"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Video, 
  Image as ImageIcon, 
  Download, 
  LayoutDashboard,
  Play,
  Palette,
  Wand2,
  Sparkles,
  Grid3x3,
  FileVideo,
} from "lucide-react";

const videoTemplates = [
  {
    id: 1,
    name: "Modern Product Showcase",
    category: "Product",
    thumbnail: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=300&fit=crop",
    duration: "30s",
    format: "16:9",
    style: "Professional",
  },
  {
    id: 2,
    name: "Social Media Reel",
    category: "Social",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop",
    duration: "15s",
    format: "9:16",
    style: "Dynamic",
  },
  {
    id: 3,
    name: "Tutorial Intro",
    category: "Educational",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    duration: "10s",
    format: "16:9",
    style: "Clean",
  },
  {
    id: 4,
    name: "Brand Story",
    category: "Brand",
    thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop",
    duration: "60s",
    format: "16:9",
    style: "Cinematic",
  },
  {
    id: 5,
    name: "Announcement Video",
    category: "Marketing",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop",
    duration: "20s",
    format: "1:1",
    style: "Bold",
  },
  {
    id: 6,
    name: "Testimonial Template",
    category: "Social Proof",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    duration: "45s",
    format: "16:9",
    style: "Authentic",
  },
];

const imageTemplates = [
  {
    id: 1,
    name: "Instagram Post",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1611926653670-1e5e8e553a54?w=400&h=400&fit=crop",
    dimensions: "1080x1080",
    format: "Square",
  },
  {
    id: 2,
    name: "YouTube Thumbnail",
    category: "Video Cover",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop",
    dimensions: "1280x720",
    format: "16:9",
  },
  {
    id: 3,
    name: "Blog Header",
    category: "Web",
    thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop",
    dimensions: "1200x630",
    format: "Wide",
  },
  {
    id: 4,
    name: "Instagram Story",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=225&h=400&fit=crop",
    dimensions: "1080x1920",
    format: "9:16",
  },
  {
    id: 5,
    name: "Twitter Header",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=133&fit=crop",
    dimensions: "1500x500",
    format: "3:1",
  },
  {
    id: 6,
    name: "Pinterest Pin",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop",
    dimensions: "1000x1500",
    format: "2:3",
  },
];

const logoStyles = [
  {
    id: 1,
    name: "Modern Minimal",
    preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    category: "Professional",
  },
  {
    id: 2,
    name: "Geometric Bold",
    preview: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=300&h=300&fit=crop",
    category: "Modern",
  },
  {
    id: 3,
    name: "Vintage Badge",
    preview: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=300&h=300&fit=crop",
    category: "Classic",
  },
  {
    id: 4,
    name: "Abstract Creative",
    preview: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=300&h=300&fit=crop",
    category: "Artistic",
  },
  {
    id: 5,
    name: "Tech Futuristic",
    preview: "https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=300&h=300&fit=crop",
    category: "Tech",
  },
  {
    id: 6,
    name: "Nature Organic",
    preview: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300&h=300&fit=crop",
    category: "Natural",
  },
];

export default function PreviewsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Eye className="h-10 w-10 text-primary gold-glow" />
              Content Previews & Templates
            </h1>
            <p className="text-muted-foreground text-lg">
              High-quality templates for videos, images, and logos
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-primary/30"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Video Templates</TabsTrigger>
            <TabsTrigger value="images">Image Templates</TabsTrigger>
            <TabsTrigger value="logos">Logo Styles</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <FileVideo className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Professional Video Templates</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Ready-to-use video templates for all your content needs
              </p>

              <div className="mb-6">
                <Input
                  placeholder="Search video templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videoTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="lg" className="gap-2">
                          <Play className="h-5 w-5" />
                          Preview
                        </Button>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-primary">
                        {template.duration}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{template.category}</span>
                        <span>{template.format}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Wand2 className="mr-1 h-3 w-3" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Image Templates</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Optimized templates for every social media platform
              </p>

              <div className="mb-6">
                <Input
                  placeholder="Search image templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {imageTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 aspect-square">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="lg" className="gap-2">
                          <Eye className="h-5 w-5" />
                          View Full
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{template.category}</span>
                        <span className="text-xs">{template.dimensions}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Sparkles className="mr-1 h-3 w-3" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="logos" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Logo Style Previews</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Explore different logo styles and design directions
              </p>

              <div className="mb-6">
                <Input
                  placeholder="Search logo styles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {logoStyles.map((style) => (
                  <Card key={style.id} className="overflow-hidden hover:border-primary/50 transition-all group">
                    <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center">
                      <img
                        src={style.preview}
                        alt={style.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="lg" className="gap-2">
                          <Wand2 className="h-5 w-5" />
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{style.name}</h3>
                      <Badge variant="outline" className="mb-3">
                        {style.category}
                      </Badge>
                      <Button size="sm" className="w-full">
                        <Sparkles className="mr-2 h-3 w-3" />
                        Generate in This Style
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Need a Custom Logo?</h3>
                  <p className="text-muted-foreground mb-4">
                    Use our AI Logo Generator to create unique, professional logos tailored to your brand in seconds.
                  </p>
                  <Button onClick={() => router.push("/ai/logos")}>
                    <Palette className="mr-2 h-4 w-4" />
                    Go to Logo Generator
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 mt-8 border-primary/30">
          <h3 className="font-semibold text-lg mb-4">How to Use Templates</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Browse Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Explore our collection of professional templates
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Customize with AI</h4>
                <p className="text-sm text-muted-foreground">
                  Use AI tools to personalize colors, text, and style
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Download & Share</h4>
                <p className="text-sm text-muted-foreground">
                  Export in multiple formats and publish instantly
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
