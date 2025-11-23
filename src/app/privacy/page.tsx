"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Shield, Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Crown className="h-8 w-8 text-primary gold-glow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Osirix
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost">Terms</Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Home
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/20">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: November 23, 2024
          </p>
          <p className="text-muted-foreground">
            Your privacy is important to us. This policy explains how Osirix collects, uses,
            and protects your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Quick Overview */}
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">Quick Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Data Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    All data encrypted in transit and at rest
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">No Selling</p>
                  <p className="text-sm text-muted-foreground">
                    We never sell your personal data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Your Control</p>
                  <p className="text-sm text-muted-foreground">
                    Delete your data anytime
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <PolicySection
            title="1. Information We Collect"
            content={
              <>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="mb-4">
                  When you create an account, we collect your name, email address, and password.
                  We use this information to provide you with access to our services and
                  communicate with you about your account.
                </p>

                <h3 className="font-semibold mb-2">Content You Create</h3>
                <p className="mb-4">
                  We store the AI-generated content you create (logos, characters, products,
                  videos) to provide our services. This content remains your property.
                </p>

                <h3 className="font-semibold mb-2">Usage Data</h3>
                <p className="mb-4">
                  We collect information about how you use our platform, including features
                  accessed, jobs created, and credits used. This helps us improve our services.
                </p>

                <h3 className="font-semibold mb-2">Payment Information</h3>
                <p>
                  Payment processing is handled by Stripe. We do not store your full credit card
                  details. We only store the last 4 digits and payment method type for your
                  reference.
                </p>
              </>
            }
          />

          <PolicySection
            title="2. How We Use Your Information"
            content={
              <>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our AI content creation services</li>
                  <li>To process your payments and manage your subscription</li>
                  <li>To send you important updates about your account and services</li>
                  <li>To respond to your support requests and inquiries</li>
                  <li>To improve our platform and develop new features</li>
                  <li>To detect and prevent fraud or abuse of our services</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="3. Information Sharing"
            content={
              <>
                <p className="mb-4">
                  We do not sell your personal information to third parties. We only share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We share data with trusted third-party
                    services (ElevenLabs, Stripe, cloud storage providers) to deliver our
                    services. These providers are bound by strict data protection agreements.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information if required
                    by law, court order, or government request.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> If Osirix is acquired or merged, your
                    information may be transferred to the new entity.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share information with your
                    explicit permission.
                  </li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="4. Data Security"
            content={
              <>
                <p className="mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End-to-end encryption for data in transit (TLS/SSL)</li>
                  <li>Encryption at rest for all stored data</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Secure authentication with JWT tokens and session management</li>
                  <li>Access controls and permission systems</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p className="mt-4">
                  While we strive to protect your data, no method of transmission over the
                  internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </>
            }
          />

          <PolicySection
            title="5. Your Rights and Choices"
            content={
              <>
                <p className="mb-4">You have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> You can request a copy of your personal data at any
                    time through your account settings.
                  </li>
                  <li>
                    <strong>Correction:</strong> You can update your account information directly
                    in your profile settings.
                  </li>
                  <li>
                    <strong>Deletion:</strong> You can delete your account and all associated data
                    at any time. Note that some data may be retained for legal or legitimate
                    business purposes.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> You can export your content and data in a
                    standard format.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> You can opt out of marketing emails at any time
                    using the unsubscribe link.
                  </li>
                </ul>
              </>
            }
          />

          <PolicySection
            title="6. Cookies and Tracking"
            content={
              <>
                <p className="mb-4">
                  We use cookies and similar technologies to provide and improve our services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for authentication and basic
                    functionality
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how users interact with
                    our platform
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences
                  </li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings, but disabling certain
                  cookies may affect functionality.
                </p>
              </>
            }
          />

          <PolicySection
            title="7. Data Retention"
            content={
              <>
                <p className="mb-4">
                  We retain your information for as long as your account is active or as needed
                  to provide services. Specific retention periods:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information: Retained while account is active</li>
                  <li>Generated content: Retained until you delete it</li>
                  <li>Transaction records: Retained for 7 years for tax and legal purposes</li>
                  <li>Usage logs: Retained for 90 days</li>
                  <li>Support tickets: Retained for 3 years</li>
                </ul>
                <p className="mt-4">
                  After account deletion, we may retain certain data for legal compliance, fraud
                  prevention, or legitimate business purposes.
                </p>
              </>
            }
          />

          <PolicySection
            title="8. Children's Privacy"
            content={
              <>
                <p>
                  Our services are not intended for users under the age of 18. We do not
                  knowingly collect personal information from children. If you believe we have
                  collected information from a child, please contact us immediately.
                </p>
              </>
            }
          />

          <PolicySection
            title="9. International Data Transfers"
            content={
              <>
                <p>
                  Your information may be transferred to and processed in countries other than
                  your country of residence. These countries may have different data protection
                  laws. We ensure appropriate safeguards are in place to protect your data in
                  accordance with this privacy policy.
                </p>
              </>
            }
          />

          <PolicySection
            title="10. Changes to This Policy"
            content={
              <>
                <p className="mb-4">
                  We may update this privacy policy from time to time. We will notify you of
                  significant changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the new policy on this page</li>
                  <li>Updating the "Last Updated" date</li>
                  <li>Sending you an email notification for material changes</li>
                </ul>
                <p className="mt-4">
                  Your continued use of our services after changes constitutes acceptance of the
                  updated policy.
                </p>
              </>
            }
          />

          <PolicySection
            title="11. Contact Us"
            content={
              <>
                <p className="mb-4">
                  If you have questions about this privacy policy or our data practices, please
                  contact us:
                </p>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">Osirix Support</p>
                  <p className="text-sm text-muted-foreground">Email: privacy@osirix.ai</p>
                  <p className="text-sm text-muted-foreground">
                    Response time: Within 48 hours
                  </p>
                </div>
              </>
            }
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-12">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Osirix</span>
          </div>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Osirix. Empowering creators to make money with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PolicySection({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        {title}
      </h2>
      <div className="text-muted-foreground space-y-4">{content}</div>
    </Card>
  );
}
