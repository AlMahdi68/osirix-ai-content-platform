"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  DollarSign, 
  LayoutDashboard,
  Store,
  TrendingUp,
  Globe,
  Link as LinkIcon,
  Settings
} from "lucide-react";
import { toast } from "sonner";

const dropshippingSuppliers = [
  {
    name: "Printful",
    category: "Print-on-Demand",
    products: "T-shirts, Mugs, Posters, Phone Cases",
    commission: "Wholesale pricing",
    integrationUrl: "https://www.printful.com/",
    logo: "🎨",
  },
  {
    name: "Spocket",
    category: "General Dropshipping",
    products: "Fashion, Electronics, Home Decor",
    commission: "30-60% margins",
    integrationUrl: "https://www.spocket.co/",
    logo: "📦",
  },
  {
    name: "Printify",
    category: "Print-on-Demand",
    products: "Apparel, Accessories, Home & Living",
    commission: "Up to 40% profit",
    integrationUrl: "https://printify.com/",
    logo: "🖼️",
  },
  {
    name: "CJ Dropshipping",
    category: "General Dropshipping",
    products: "Wide product range from China",
    commission: "Competitive prices",
    integrationUrl: "https://cjdropshipping.com/",
    logo: "🌏",
  },
];

const marketplaces = [
  {
    name: "Shopify",
    type: "E-commerce Platform",
    description: "Build your own online store with AI-generated products",
    features: ["Custom storefront", "Payment processing", "Inventory management"],
    icon: "🛍️",
  },
  {
    name: "Etsy",
    type: "Marketplace",
    description: "Sell AI-generated art, designs, and digital products",
    features: ["Built-in audience", "Low startup cost", "Creative focus"],
    icon: "🎨",
  },
  {
    name: "Amazon Merch",
    type: "Print-on-Demand",
    description: "Sell custom designs on Amazon's platform",
    features: ["Massive reach", "No upfront costs", "Amazon fulfillment"],
    icon: "📚",
  },
  {
    name: "Redbubble",
    type: "Print-on-Demand",
    description: "Upload designs, they handle production and shipping",
    features: ["Global marketplace", "No inventory", "Passive income"],
    icon: "🎭",
  },
];

export default function EcommercePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectStore = async () => {
    if (!storeName || !storeUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`${storeName} connected successfully!`);
      setIsConnecting(false);
      setStoreName("");
      setStoreUrl("");
    }, 1500);
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
              <Store className="h-10 w-10 text-primary gold-glow" />
              E-commerce & Dropshipping Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Start selling AI-generated products with zero inventory
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
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="marketplaces">Marketplaces</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-green-500/10 to-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">How It Works</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Turn your AI-generated content into physical products without holding inventory
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="font-semibold mb-2">1. Create Designs</h3>
                  <p className="text-sm text-muted-foreground">
                    Use Osirix AI tools to generate logos, artwork, and designs
                  </p>
                </Card>

                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">🏪</div>
                  <h3 className="font-semibold mb-2">2. List Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to dropshipping suppliers and list on marketplaces
                  </p>
                </Card>

                <Card className="p-6 bg-background">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="font-semibold mb-2">3. Earn Profits</h3>
                  <p className="text-sm text-muted-foreground">
                    Orders auto-fulfill, you keep the profit margin (30-60%)
                  </p>
                </Card>
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Products Listed</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-2">Connect a store to start</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-2">Waiting for first sale</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Revenue</h3>
                <p className="text-3xl font-bold">$0.00</p>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Profit Margin</h3>
                <p className="text-3xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground mt-2">Average margin</p>
              </Card>
            </div>

            <Card className="p-6 bg-green-500/10 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Earning Potential</h3>
                  <p className="text-muted-foreground mb-4">
                    With dropshipping, successful creators earn <span className="font-bold text-green-400">$2,000-$10,000/month</span> selling AI-generated designs on print-on-demand products.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      <span>30-60% profit margins per sale</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      <span>No inventory or upfront costs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      <span>Automated fulfillment and shipping</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Dropshipping Suppliers</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Connect with suppliers who handle production and shipping automatically
              </p>

              <div className="grid gap-6">
                {dropshippingSuppliers.map((supplier, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{supplier.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{supplier.name}</h3>
                            <span className="text-sm text-muted-foreground">{supplier.category}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => window.open(supplier.integrationUrl, "_blank")}
                          >
                            <LinkIcon className="mr-2 h-3 w-3" />
                            Connect
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium">Products:</span> {supplier.products}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded">
                            {supplier.commission}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="marketplaces" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Sales Marketplaces</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Where to sell your AI-generated products
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {marketplaces.map((marketplace, idx) => (
                  <Card key={idx} className="p-6 hover:border-primary/50 transition-all">
                    <div className="text-4xl mb-4">{marketplace.icon}</div>
                    <h3 className="text-lg font-semibold mb-1">{marketplace.name}</h3>
                    <span className="text-sm text-muted-foreground block mb-3">{marketplace.type}</span>
                    <p className="text-sm text-muted-foreground mb-4">
                      {marketplace.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      {marketplace.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Connect Your Store</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Link your e-commerce platform to start selling
              </p>

              <div className="max-w-xl space-y-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="My AI Art Store"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Store URL</Label>
                  <Input
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="https://mystore.com"
                  />
                </div>

                <Button
                  onClick={handleConnectStore}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? "Connecting..." : "Connect Store"}
                </Button>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Note:</span> Full integration with Shopify, WooCommerce, and other platforms coming soon. For now, you can manually list AI-generated products on these platforms.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Start Guide</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Generate Designs</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the AI Logo Generator to create unique designs
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Choose a Supplier</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign up with Printful or Printify for print-on-demand
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Products</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply your designs to t-shirts, mugs, posters, etc.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">List & Promote</h4>
                    <p className="text-sm text-muted-foreground">
                      List on marketplaces and promote on social media
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
