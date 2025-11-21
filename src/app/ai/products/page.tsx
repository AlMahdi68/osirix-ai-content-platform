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
import { Sparkles, Loader2, Package, Trash2, Eye, LayoutDashboard, Zap } from "lucide-react";
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

const productTemplates = [
  {
    id: "saas-productivity",
    name: "SaaS Productivity Tool",
    category: "saas",
    gradient: "from-blue-500 to-cyan-500",
    icon: "💻",
    description: "Cloud-based productivity software with team collaboration features",
    targetAudience: "Remote teams, startups, and growing businesses",
    price: 29,
    features: [
      "Real-time collaboration & sync",
      "Automated workflows & integrations",
      "Advanced analytics dashboard",
      "Unlimited team members",
      "24/7 priority support"
    ],
    marketingCopy: "Transform your team's productivity with our all-in-one workspace. Streamline workflows, collaborate in real-time, and achieve more together. Join 50,000+ teams already working smarter.",
    examples: [
      "Project management platform",
      "Team communication hub",
      "Document collaboration suite"
    ]
  },
  {
    id: "online-course",
    name: "Online Course Package",
    category: "courses",
    gradient: "from-purple-500 to-pink-500",
    icon: "🎓",
    description: "Comprehensive video course with practical exercises and certification",
    targetAudience: "Aspiring professionals, career changers, students",
    price: 197,
    features: [
      "50+ hours of video content",
      "Practical projects & assignments",
      "Lifetime access & updates",
      "Certificate of completion",
      "Private community access"
    ],
    marketingCopy: "Master in-demand skills with our expert-led course. Learn at your own pace, build real projects, and earn a professional certificate. 10,000+ students have already transformed their careers.",
    examples: [
      "Web development bootcamp",
      "Digital marketing mastery",
      "AI & machine learning course"
    ]
  },
  {
    id: "digital-template",
    name: "Premium Template Pack",
    category: "templates",
    gradient: "from-orange-500 to-red-500",
    icon: "🎨",
    description: "Professional design templates for instant customization",
    targetAudience: "Designers, marketers, content creators, entrepreneurs",
    price: 49,
    features: [
      "50+ customizable templates",
      "Multiple file formats included",
      "Commercial use license",
      "Regular updates & new templates",
      "Video tutorials included"
    ],
    marketingCopy: "Skip the design work and launch faster with our pro templates. Fully customizable, professionally designed, and ready to use. Save 100+ hours of design time.",
    examples: [
      "Social media content bundle",
      "Landing page templates",
      "Email marketing designs"
    ]
  },
  {
    id: "automation-tool",
    name: "Automation Platform",
    category: "tools",
    gradient: "from-green-500 to-emerald-500",
    icon: "⚡",
    description: "No-code automation platform connecting your favorite apps",
    targetAudience: "Business owners, marketers, operations teams",
    price: 39,
    features: [
      "Connect 1000+ apps",
      "Visual workflow builder",
      "Unlimited automations",
      "Advanced scheduling & triggers",
      "Real-time monitoring & logs"
    ],
    marketingCopy: "Automate repetitive tasks and focus on what matters. Build powerful workflows in minutes without coding. Save 20+ hours every week on manual work.",
    examples: [
      "Marketing automation suite",
      "Sales pipeline automator",
      "Customer onboarding system"
    ]
  },
  {
    id: "digital-asset",
    name: "Digital Asset Library",
    category: "digital-products",
    gradient: "from-yellow-500 to-amber-500",
    icon: "📦",
    description: "Curated collection of premium digital resources",
    targetAudience: "Content creators, developers, designers",
    price: 79,
    features: [
      "1000+ premium assets",
      "Regular monthly additions",
      "Commercial licensing included",
      "Organized by category",
      "Instant download access"
    ],
    marketingCopy: "Everything you need in one place. Stop wasting time searching for assets. Get instant access to a professionally curated library that grows every month.",
    examples: [
      "Stock photo collection",
      "Icon & illustration pack",
      "Sound effects library"
    ]
  },
  {
    id: "membership-community",
    name: "Premium Membership",
    category: "other",
    gradient: "from-indigo-500 to-violet-500",
    icon: "👥",
    description: "Exclusive community with expert resources and networking",
    targetAudience: "Professionals, entrepreneurs, industry experts",
    price: 97,
    features: [
      "Private member community",
      "Weekly expert sessions",
      "Exclusive resources library",
      "Networking opportunities",
      "Member-only events"
    ],
    marketingCopy: "Join an elite community of professionals. Get exclusive access to expert insights, premium resources, and valuable connections. Invest in your professional growth.",
    examples: [
      "Industry mastermind group",
      "Professional development hub",
      "Entrepreneur network"
    ]
  }
];

export default function AIProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<AIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<AIProduct | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof productTemplates[0] | null>(null);

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

  const handleUseTemplate = (template: typeof productTemplates[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      priceSuggestion: template.price.toString(),
      targetAudience: template.targetAudience,
      keyFeatures: template.features.join("\n"),
      marketingCopy: template.marketingCopy,
      status: "draft",
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
              Create New Product
            </Button>
          </div>
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
              Create your first AI-generated product idea or explore templates
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowTemplates(true)} variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Templates
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </div>
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
                    onClick={() => setPreviewProduct(product)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
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

        {/* Templates Gallery Dialog */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-primary" />
                Product Templates
              </DialogTitle>
              <p className="text-muted-foreground">
                Explore proven product ideas and get inspired
              </p>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {productTemplates.map((template) => (
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
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">${template.price}</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                        {template.category.replace("-", " ")}
                      </span>
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
                  <p className="text-4xl font-bold mt-2">${previewTemplate?.price}</p>
                </div>
              </div>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-base">{previewTemplate.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                  <p className="text-base">{previewTemplate.targetAudience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Key Features</p>
                  <ul className="space-y-2">
                    {previewTemplate.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Marketing Copy</p>
                  <p className="text-sm italic">{previewTemplate.marketingCopy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Example Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {example}
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

        {/* Product Preview Dialog */}
        <Dialog open={!!previewProduct} onOpenChange={() => setPreviewProduct(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {previewProduct?.name}
              </DialogTitle>
            </DialogHeader>
            {previewProduct && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p>{previewProduct.description}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                    <p className="capitalize">{previewProduct.category.replace("-", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(previewProduct.priceSuggestion / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                  <p>{previewProduct.targetAudience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Key Features</p>
                  <ul className="list-disc list-inside space-y-1">
                    {previewProduct.keyFeatures.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Marketing Copy</p>
                  <p className="text-sm">{previewProduct.marketingCopy}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}