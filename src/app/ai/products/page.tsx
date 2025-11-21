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
import { Sparkles, Loader2, Package, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

interface AIProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  priceSuggestion: number;
  targetAudience: string;
  keyFeatures: string[];
  marketingCopy: string;
  status: string;
  createdAt: string;
}

export default function AIProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<AIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "digital-products",
    priceSuggestion: "",
    targetAudience: "",
    keyFeatures: "",
    marketingCopy: "",
    status: "draft",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/ai/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const keyFeaturesArray = formData.keyFeatures
        .split("\n")
        .filter((f) => f.trim());

      const response = await fetch("/api/ai/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          priceSuggestion: parseInt(formData.priceSuggestion) * 100,
          targetAudience: formData.targetAudience,
          keyFeatures: keyFeaturesArray,
          marketingCopy: formData.marketingCopy,
          status: formData.status,
        }),
      });

      if (response.ok) {
        toast.success("AI Product created successfully!");
        setShowForm(false);
        setFormData({
          name: "",
          description: "",
          category: "digital-products",
          priceSuggestion: "",
          targetAudience: "",
          keyFeatures: "",
          marketingCopy: "",
          status: "draft",
        });
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/ai/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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
              <Package className="h-10 w-10 text-primary gold-glow" />
              AI Product Creator
            </h1>
            <p className="text-muted-foreground text-lg">
              Generate product ideas with AI-powered descriptions and marketing copy
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 gold-glow"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Create New Product
          </Button>
        </div>

        {showForm && (
          <Card className="p-8 mb-8 border-primary/30 gold-glow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., AI Social Media Manager"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital-products">Digital Products</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="templates">Templates</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed product description..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price Suggestion (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.priceSuggestion}
                    onChange={(e) =>
                      setFormData({ ...formData, priceSuggestion: e.target.value })
                    }
                    placeholder="29.99"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience *</Label>
                  <Input
                    id="audience"
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAudience: e.target.value })
                    }
                    placeholder="e.g., Content creators, marketers"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (one per line) *</Label>
                <Textarea
                  id="features"
                  value={formData.keyFeatures}
                  onChange={(e) =>
                    setFormData({ ...formData, keyFeatures: e.target.value })
                  }
                  placeholder="Automated scheduling&#10;AI-powered content generation&#10;Analytics dashboard"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketing">Marketing Copy *</Label>
                <Textarea
                  id="marketing"
                  value={formData.marketingCopy}
                  onChange={(e) =>
                    setFormData({ ...formData, marketingCopy: e.target.value })
                  }
                  placeholder="Compelling marketing copy to sell your product..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
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
                      Create Product
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

        {products.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-generated product idea
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {product.category.replace("-", " ")}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.status === "published"
                      ? "bg-primary/20 text-primary"
                      : product.status === "approved"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">
                    ${(product.priceSuggestion / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Target: {product.targetAudience}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/ai/products/${product.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(product.id)}
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
