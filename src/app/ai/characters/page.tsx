"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Loader2, Trash2, Eye, Sparkles } from "lucide-react";
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

export default function AICharactersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<AICharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
        setCharacters(data.characters || []);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("Failed to load characters");
    } finally {
      setIsLoading(false);
    }
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
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 gold-glow"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Create Character
          </Button>
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
              Create your first AI character
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Character
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => (
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
                    {character.traits.slice(0, 3).map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {trait}
                      </span>
                    ))}
                    {character.traits.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{character.traits.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/ai/characters/${character.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
