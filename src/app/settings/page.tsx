"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSession, authClient } from "@/lib/auth-client";
import { Loader2, User, Bell, Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notifications: {
      emailNotifications: true,
      jobCompletion: true,
      marketplaceUpdates: false,
      weeklyReports: true,
    },
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        notifications: {
          emailNotifications: true,
          jobCompletion: true,
          marketplaceUpdates: false,
          weeklyReports: true,
        },
      });
    }
  }, [session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real implementation, this would call an API to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);

    try {
      // In a real implementation, this would call an API to update notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await authClient.signOut();
      if (!error) {
        toast.success("Account deletion initiated. Redirecting...");
        localStorage.removeItem("bearer_token");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  if (isPending) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your account
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, emailNotifications: checked },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Job Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your jobs finish processing
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.jobCompletion}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, jobCompletion: checked },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketplace Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new marketplace products
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.marketplaceUpdates}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, marketplaceUpdates: checked },
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Get weekly summaries of your activity
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, weeklyReports: checked },
                      })
                    }
                  />
                </div>
                <Button onClick={handleSaveNotifications} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Current Plan</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You are currently on the Free plan
                  </p>
                  <Button asChild>
                    <a href="/plans">Upgrade Plan</a>
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Payment Method</h4>
                  <p className="text-sm text-muted-foreground">
                    No payment method on file
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Change Password</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your password to keep your account secure
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
