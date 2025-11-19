"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Edit, Trash2, Eye, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  isPublished: boolean;
  salesCount: number;
  createdAt: string;
}

export default function SellPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchMyProducts();
    }
  }, [session]);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/marketplace/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter to only show user's own products
        const myProducts = data.products.filter(
          (p: Product) => p.sellerId === session?.user?.id
        );
        setProducts(myProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) * 100; // Convert to cents
    const category = formData.get("category") as string;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/marketplace/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          category,
          fileUrl: `https://storage.osirix.ai/products/${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-')}.zip`,
          previewUrl: null,
          tags: [category],
        }),
      });

      if (response.ok) {
        toast.success("Product created successfully!");
        setDialogOpen(false);
        fetchMyProducts();
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Failed to create product");
      }
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.salesCount), 0);
  const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
  const publishedCount = products.filter(p => p.isPublished).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sell Products</h2>
            <p className="text-muted-foreground">Manage your marketplace listings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  List a new product on the marketplace
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Professional Voice Pack"
                    required
                    disabled={creating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your product..."
                    rows={4}
                    required
                    disabled={creating}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="9.99"
                      required
                      disabled={creating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required disabled={creating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voice-packs">Voice Packs</SelectItem>
                        <SelectItem value="avatars">Avatars</SelectItem>
                        <SelectItem value="templates">Templates</SelectItem>
                        <SelectItem value="backgrounds">Backgrounds</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">{publishedCount} published</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
              <p className="text-xs text-muted-foreground">across all products</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">lifetime earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${products.length > 0 ? ((products.reduce((sum, p) => sum + p.price, 0) / products.length) / 100).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">per product</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>Manage your marketplace listings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{product.title}</h3>
                        <Badge variant={product.isPublished ? "default" : "secondary"}>
                          {product.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-medium">${(product.price / 100).toFixed(2)}</span>
                        <span className="text-muted-foreground">{product.salesCount} sales</span>
                        <span className="text-muted-foreground">
                          Revenue: ${((product.price * product.salesCount) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first product to start selling
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
