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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Loader2, Trash2, Eye, Sparkles, LayoutDashboard, Zap } from "lucide-react";
import { toast } from "sonner";

interface AICharacter {
  id: number;
  name: string;
  personality: string;
  backstory: string;
  voiceStyle: string;
  avatarId: number | null;
  traits: string[];
  useCases: string[];
  createdAt: string;
}

const characterTemplates = [
  {
    id: "professional-presenter",
    name: "Professional Presenter",
    gradient: "from-blue-600 to-cyan-500",
    icon: "👔",
    personality: "Confident, articulate, and authoritative. Speaks with clarity and commands attention.",
    backstory: "Former news anchor with 15 years of broadcasting experience. Master of clear communication and audience engagement.",
    voiceStyle: "Professional, clear, well-paced",
    traits: ["Confident", "Articulate", "Professional", "Engaging", "Trustworthy"],
    useCases: ["Corporate presentations", "Product demos", "Training videos"],
    examples: [
      "Business webinars and presentations",
      "Product launch announcements",
      "Professional training content"
    ]
  },
  {
    id: "friendly-educator",
    name: "Friendly Educator",
    gradient: "from-green-500 to-emerald-500",
    icon: "🎓",
    personality: "Warm, patient, and encouraging. Makes complex topics easy to understand with enthusiasm.",
    backstory: "Award-winning teacher passionate about making learning fun and accessible for everyone.",
    voiceStyle: "Warm, enthusiastic, patient",
    traits: ["Patient", "Encouraging", "Clear", "Enthusiastic", "Supportive"],
    useCases: ["Educational content", "Tutorials", "Explainer videos"],
    examples: [
      "Online course instruction",
      "How-to tutorials and guides",
      "Educational explainer videos"
    ]
  },
  {
    id: "energetic-host",
    name: "Energetic Host",
    gradient: "from-orange-500 to-red-500",
    icon: "🎬",
    personality: "Dynamic, charismatic, and entertaining. Brings energy and excitement to every moment.",
    backstory: "Popular YouTuber and content creator known for keeping audiences engaged and entertained.",
    voiceStyle: "Energetic, dynamic, expressive",
    traits: ["Charismatic", "Energetic", "Fun", "Engaging", "Dynamic"],
    useCases: ["Entertainment content", "Vlogs", "Social media"],
    examples: [
      "YouTube channel hosting",
      "Entertainment vlogs",
      "Social media content"
    ]
  },
  {
    id: "calming-narrator",
    name: "Calming Narrator",
    gradient: "from-purple-500 to-indigo-500",
    icon: "🎙️",
    personality: "Soothing, contemplative, and serene. Creates a peaceful atmosphere with every word.",
    backstory: "Meditation guide and audiobook narrator with a gift for creating tranquil experiences.",
    voiceStyle: "Calm, soothing, measured",
    traits: ["Soothing", "Peaceful", "Contemplative", "Gentle", "Serene"],
    useCases: ["Meditation", "Audiobooks", "Relaxation content"],
    examples: [
      "Meditation and mindfulness guides",
      "Audiobook narration",
      "Sleep and relaxation content"
    ]
  },
  {
    id: "tech-expert",
    name: "Tech Expert",
    gradient: "from-cyan-500 to-blue-700",
    icon: "💻",
    personality: "Knowledgeable, precise, and innovative. Explains technology with clarity and expertise.",
    backstory: "Senior software engineer and tech reviewer with deep expertise in cutting-edge technology.",
    voiceStyle: "Precise, knowledgeable, clear",
    traits: ["Expert", "Analytical", "Precise", "Innovative", "Clear"],
    useCases: ["Tech reviews", "Software tutorials", "Developer content"],
    examples: [
      "Technology reviews and analysis",
      "Software development tutorials",
      "Tech industry updates"
    ]
  },
  {
    id: "motivational-coach",
    name: "Motivational Coach",
    gradient: "from-yellow-500 to-amber-600",
    icon: "💪",
    personality: "Inspiring, empowering, and uplifting. Motivates people to achieve their best potential.",
    backstory: "Life coach and motivational speaker dedicated to helping people unlock their full potential.",
    voiceStyle: "Inspiring, powerful, uplifting",
    traits: ["Inspiring", "Empowering", "Passionate", "Supportive", "Driven"],
    useCases: ["Motivational content", "Coaching", "Personal development"],
    examples: [
      "Motivational speeches and content",
      "Personal development coaching",
      "Fitness and wellness motivation"
    ]
  }
];

export default function AICharactersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<AICharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<AICharacter | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof characterTemplates[0] | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    personality: "",
    backstory: "",
    voiceStyle: "",
    traits: "",
    useCases: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCharacters();
    }
  }, [session]);

  const fetchCharacters = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/characters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Parse traits and useCases if they come as JSON strings
        const parsedCharacters = (data.characters || []).map((char: any) => ({
          ...char,
          traits: typeof char.traits === 'string' ? JSON.parse(char.traits) : (Array.isArray(char.traits) ? char.traits : []),
          useCases: typeof char.useCases === 'string' ? JSON.parse(char.useCases) : (Array.isArray(char.useCases) ? char.useCases : []),
        }));
        setCharacters(parsedCharacters);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("Failed to load characters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTemplate = (template: typeof characterTemplates[0]) => {
    setFormData({
      name: template.name,
      personality: template.personality,
      backstory: template.backstory,
      voiceStyle: template.voiceStyle,
      traits: template.traits.join(", "),
      useCases: template.useCases.join(", "),
    });
    setShowTemplates(false);
    setShowForm(true);
    setPreviewTemplate(null);
    toast.success("Template applied! Customize and create.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const traitsArray = formData.traits
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const useCasesArray = formData.useCases
        .split(",")
        .map((u) => u.trim())
        .filter((u) => u);

      const response = await fetch("/api/ai/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          personality: formData.personality,
          backstory: formData.backstory,
          voiceStyle: formData.voiceStyle,
          traits: traitsArray,
          useCases: useCasesArray,
        }),
      });

      if (response.ok) {
        toast.success("Character created successfully!");
        setShowForm(false);
        setFormData({
          name: "",
          personality: "",
          backstory: "",
          voiceStyle: "",
          traits: "",
          useCases: "",
        });
        fetchCharacters();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create character");
      }
    } catch (error) {
      console.error("Error creating character:", error);
      toast.error("Failed to create character");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/characters/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Character deleted successfully");
        fetchCharacters();
      } else {
        toast.error("Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character");
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
              <Users className="h-10 w-10 text-primary gold-glow" />
              AI Character Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create unique AI characters with personality and backstory
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
              onClick={() => setShowTemplates(true)}
              variant="outline"
              className="border-primary/30"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Templates
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 gold-glow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Create Character
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30 gold-glow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Character Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Alex the Marketing Expert"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voiceStyle">Voice Style *</Label>
                  <Input
                    id="voiceStyle"
                    value={formData.voiceStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, voiceStyle: e.target.value })
                    }
                    placeholder="e.g., Professional, friendly"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality *</Label>
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) =>
                    setFormData({ ...formData, personality: e.target.value })
                  }
                  placeholder="Describe the character's personality traits..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backstory">Backstory *</Label>
                <Textarea
                  id="backstory"
                  value={formData.backstory}
                  onChange={(e) =>
                    setFormData({ ...formData, backstory: e.target.value })
                  }
                  placeholder="Character's background and history..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="traits">Character Traits (comma-separated) *</Label>
                <Input
                  id="traits"
                  value={formData.traits}
                  onChange={(e) =>
                    setFormData({ ...formData, traits: e.target.value })
                  }
                  placeholder="e.g., Creative, analytical, empathetic"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCases">Use Cases (comma-separated) *</Label>
                <Input
                  id="useCases"
                  value={formData.useCases}
                  onChange={(e) =>
                    setFormData({ ...formData, useCases: e.target.value })
                  }
                  placeholder="e.g., Marketing videos, customer support, training"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Character
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

        {characters.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No characters yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI character or explore our templates
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowTemplates(true)} variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Templates
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Character
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => {
              // Ensure traits is always an array
              const traitsArray = Array.isArray(character.traits) ? character.traits : [];
              
              return (
                <Card
                  key={character.id}
                  className="p-6 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {character.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {character.voiceStyle}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-primary/50" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {character.personality}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Traits:</p>
                    <div className="flex flex-wrap gap-1">
                      {traitsArray.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                      {traitsArray.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{traitsArray.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPreviewCharacter(character)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(character.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Templates Gallery Dialog */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-primary" />
                Character Templates
              </DialogTitle>
              <p className="text-muted-foreground">
                Explore professional character archetypes and personalities
              </p>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {characterTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className={`h-32 bg-gradient-to-br ${template.gradient} relative flex flex-col items-center justify-center text-white`}>
                    <div className="text-5xl mb-2">{template.icon}</div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 text-lg group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.personality}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.traits.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                    >
                      <Sparkles className="mr-2 h-3 w-3" />
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className={`-mx-6 -mt-6 mb-6 h-48 bg-gradient-to-br ${previewTemplate?.gradient} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{previewTemplate?.icon}</div>
                  <DialogTitle className="text-3xl font-bold">{previewTemplate?.name}</DialogTitle>
                  <p className="text-sm mt-2 opacity-90">{previewTemplate?.voiceStyle}</p>
                </div>
              </div>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Personality</p>
                  <p className="text-base">{previewTemplate.personality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Backstory</p>
                  <p className="text-base">{previewTemplate.backstory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Character Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.traits.map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Ideal Use Cases</p>
                  <ul className="space-y-2">
                    {previewTemplate.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Best For</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.useCases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleUseTemplate(previewTemplate)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Use This Template
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Character Preview Dialog */}
        <Dialog open={!!previewCharacter} onOpenChange={() => setPreviewCharacter(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {previewCharacter?.name}
              </DialogTitle>
            </DialogHeader>
            {previewCharacter && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Voice Style</p>
                  <p>{previewCharacter.voiceStyle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Personality</p>
                  <p>{previewCharacter.personality}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Backstory</p>
                  <p className="text-sm">{previewCharacter.backstory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Character Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(previewCharacter.traits) ? previewCharacter.traits : []).map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(previewCharacter.useCases) ? previewCharacter.useCases : []).map((useCase, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
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