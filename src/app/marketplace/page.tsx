"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Search, Filter, TrendingUp, Package } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  previewUrl: string | null;
  salesCount: number;
  isPublished: boolean;
  sellerId: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/marketplace/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: number, price: number) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/marketplace/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        toast.success("Purchase successful!");
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || "Purchase failed");
      }
    } catch (error) {
      toast.error("Purchase failed");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "all" || product.category === activeTab;
    return matchesSearch && matchesCategory && product.isPublished;
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "voice-packs", label: "Voice Packs" },
    { value: "avatars", label: "Avatars" },
    { value: "templates", label: "Templates" },
    { value: "backgrounds", label: "Backgrounds" },
    { value: "music", label: "Music" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
            <p className="text-muted-foreground">Discover and purchase digital content</p>
          </div>
          <Link href="/marketplace/sell">
            <Button className="gap-2">
              <Package className="h-4 w-4" />
              Sell Products
            </Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-40 w-full rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {product.previewUrl ? (
                          <img
                            src={product.previewUrl}
                            alt={product.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-muted-foreground" />
                        )}
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {product.salesCount} sales
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge className="mb-2" variant="outline">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold mb-2">{product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(product.id, product.price)}
                        className="gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
