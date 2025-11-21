"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Loader2,
  Shield,
  Package,
  Palette,
  TrendingUp,
  Bot,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import PlanBadge from "@/components/PlanBadge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Avatars", href: "/avatars", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Social Media", href: "/social", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const aiNavigation = [
  { name: "AI Manager", href: "/ai/manager", icon: Bot },
  { name: "Product Creator", href: "/ai/products", icon: Package },
  { name: "Logo Generator", href: "/ai/logos", icon: Palette },
  { name: "Character Creator", href: "/ai/characters", icon: Users },
  { name: "Digital Marketer", href: "/ai/campaigns", icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.email === "admin@osirix.com";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/20 bg-card/50 backdrop-blur overflow-y-auto">
        <div className="flex h-16 items-center gap-2 border-b border-primary/20 px-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold gold-gradient">Osirix</span>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive ? 'bg-primary/10 text-primary border border-primary/30' : 'hover:bg-primary/5 hover:text-primary'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
          
          {/* AI Tools Section */}
          <div className="pt-4">
            <div className="px-3 pb-2 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                AI Tools
              </span>
            </div>
            {aiNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-2 ${isActive ? 'bg-primary/10 text-primary border border-primary/30' : 'hover:bg-primary/5 hover:text-primary'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {isAdmin && (
            <div className="pt-4">
              <Link href="/admin">
                <Button
                  variant={pathname === "/admin" ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${pathname === "/admin" ? 'bg-primary/10 text-primary border border-primary/30' : 'hover:bg-primary/5 hover:text-primary'}`}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-primary/20 px-6 bg-card/30 backdrop-blur">
          <h1 className="text-xl font-semibold">
            {[...navigation, ...aiNavigation].find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>

          <div className="flex items-center gap-3">
            <PlanBadge />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-primary/5">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{session.user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}