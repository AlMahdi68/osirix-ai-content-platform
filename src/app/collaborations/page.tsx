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
  Star, 
  Video, 
  Users, 
  TrendingUp, 
  LayoutDashboard,
  Scissors,
  Upload,
  Download,
  Sparkles,
  Link as LinkIcon,
  Award
} from "lucide-react";
import { toast } from "sonner";

const celebrities = [
  {
    name: "Mr. Beast",
    category: "YouTube Creator",
    followers: "200M+",
    engagement: "12.5%",
    niche: "Entertainment, Challenges",
    avatar: "🎬",
    collaborationTypes: ["Content Clipping", "Reaction Videos", "Compilation"],
  },
  {
    name: "Kylie Jenner",
    category: "Instagram Influencer",
    followers: "400M+",
    engagement: "8.3%",
    niche: "Fashion, Beauty, Lifestyle",
    avatar: "👑",
    collaborationTypes: ["Product Reviews", "Style Analysis", "Behind-the-Scenes"],
  },
  {
    name: "Dwayne Johnson",
    category: "Multi-Platform Star",
    followers: "500M+",
    engagement: "9.7%",
    niche: "Fitness, Motivation, Entertainment",
    avatar: "💪",
    collaborationTypes: ["Motivational Clips", "Workout Analysis", "Interview Highlights"],
  },
  {
    name: "Charli D'Amelio",
    category: "TikTok Star",
    followers: "150M+",
    engagement: "15.2%",
    niche: "Dance, Lifestyle",
    avatar: "💃",
    collaborationTypes: ["Dance Tutorials", "Trend Analysis", "Daily Vlogs"],
  },
];

const clipTypes = [
  {
    type: "Viral Moments",
    description: "Extract the most engaging moments from celebrity content",
    icon: "⚡",
    examples: ["Funny reactions", "Surprising reveals", "Emotional moments"],
    potential: "$500-2,000/month",
  },
  {
    type: "Educational Clips",
    description: "Create teaching content from expert celebrities",
    icon: "📚",
    examples: ["Tutorial segments", "Tips & tricks", "How-to guides"],
    potential: "$1,000-3,000/month",
  },
  {
    type: "Compilations",
    description: "Curate best moments into themed compilations",
    icon: "🎞️",
    examples: ["Best of 2024", "Top 10 moments", "Evolution videos"],
    potential: "$800-2,500/month",
  },
  {
    type: "Reaction Content",
    description: "Add AI influencer reactions to celebrity content",
    icon: "😮",
    examples: ["Celebrity analysis", "Expert commentary", "Fan perspectives"],
    potential: "$1,500-4,000/month",
  },
];

export default function CollaborationsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClipVideo = async () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }

    setIsProcessing(true);
    // Simulate video processing
    setTimeout(() => {
      toast.success("Video clips generated successfully!");
      setIsProcessing(false);
      setVideoUrl("");
    }, 2000);
  };

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
              <Star className="h-10 w-10 text-primary gold-glow" />
              Celebrity Collaboration Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Create viral content with celebrity clips and AI-powered collaborations
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="celebrities">Celebrities</TabsTrigger>
            <TabsTrigger value="clip-tool">Clip Tool</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-yellow-500/10 to-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Leverage Celebrity Content</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Legally create engaging content by clipping, analyzing, and reacting to celebrity content under fair use
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">✂️</div>
                  <h3 className="font-semibold mb-2">1. Clip Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract viral moments from celebrity videos using AI tools
                  </p>
                </Card>

                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="font-semibold mb-2">2. Add AI Commentary</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your AI influencer to react and provide unique perspectives
                  </p>
                </Card>

                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="font-semibold mb-2">3. Grow & Monetize</h3>
                  <p className="text-sm text-muted-foreground">
                    Attract celebrity fans and monetize through ads & sponsorships
                  </p>
                </Card>
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <Scissors className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Clips Created</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-2">Start clipping content</p>
              </Card>

              <Card className="p-6">
                <Video className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2">Videos Published</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-2">Across all platforms</p>
              </Card>

              <Card className="p-6">
                <Users className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2">Total Views</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-2">From celebrity content</p>
              </Card>

              <Card className="p-6">
                <TrendingUp className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="font-semibold mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-green-400">$0</p>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </Card>
            </div>

            <Card className="p-6 bg-yellow-500/10 border-yellow-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Legal & Ethical Guidelines</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow these best practices to create content legally under fair use:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                      <span><strong>Transformative use:</strong> Add commentary, criticism, or analysis - don't just repost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                      <span><strong>Give credit:</strong> Always credit the original creator and link to their content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                      <span><strong>Use short clips:</strong> Keep clips brief (usually under 2 minutes) and use only what's necessary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                      <span><strong>Respect takedowns:</strong> If a creator requests removal, comply immediately</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="celebrities" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Top Celebrities to Collaborate With</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Popular creators whose content performs well when clipped and analyzed
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {celebrities.map((celeb, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{celeb.avatar}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{celeb.name}</h3>
                        <span className="text-sm text-muted-foreground block mb-3">{celeb.category}</span>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                            <div className="font-bold">{celeb.followers}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                            <div className="font-bold text-green-400">{celeb.engagement}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-xs text-muted-foreground mb-2">Content Types</div>
                          <div className="flex flex-wrap gap-1">
                            {celeb.collaborationTypes.map((type, tidx) => (
                              <Badge key={tidx} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          <Scissors className="mr-2 h-3 w-3" />
                          Start Clipping
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="clip-tool" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">AI Video Clipping Tool</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Automatically extract the most engaging moments from any video
              </p>

              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube/TikTok/Instagram video URL..."
                      className="flex-1"
                    />
                    <Button onClick={handleClipVideo} disabled={isProcessing}>
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Clips
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">How It Works:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-bold">1.</span>
                        <span>AI analyzes the video for high-engagement moments</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">2.</span>
                        <span>Automatically creates 10-60 second clips</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">3.</span>
                        <span>Adds captions, effects, and your AI influencer commentary</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">4.</span>
                        <span>Ready to post with one click</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Manual Upload</h3>
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drop video file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP4, MOV, AVI up to 500MB
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Content Strategies</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Proven approaches for creating viral celebrity collaboration content
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {clipTypes.map((strategy, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-all">
                    <div className="text-4xl mb-4">{strategy.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{strategy.type}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {strategy.description}
                    </p>

                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Examples:</div>
                      <ul className="space-y-1">
                        {strategy.examples.map((example, eidx) => (
                          <li key={eidx} className="flex items-center gap-2 text-sm">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Earning Potential</div>
                      <div className="font-bold text-green-400">{strategy.potential}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Pro Tips for Maximum Reach</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Ride Trending Topics</h4>
                    <p className="text-sm text-muted-foreground">
                      Clip celebrity content related to current trends and viral moments for maximum visibility
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Add Unique Value</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your AI influencer to provide expert analysis, humor, or unique perspectives
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Cross-Platform Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Post the same clip across TikTok, Instagram Reels, YouTube Shorts for 3x reach
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Engage with Celebrity Fans</h4>
                    <p className="text-sm text-muted-foreground">
                      Respond to comments and build community around your celebrity content niche
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
