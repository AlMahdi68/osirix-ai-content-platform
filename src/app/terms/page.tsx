"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Scale, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function TermsPage() {
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
            <Link href="/privacy">
              <Button variant="ghost">Privacy</Button>
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
              <Scale className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: November 23, 2024
          </p>
          <p className="text-muted-foreground">
            Please read these terms carefully before using Osirix. By accessing or using our
            services, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Quick Summary */}
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">Key Points</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">You Own Your Content</p>
                  <p className="text-sm text-muted-foreground">
                    All AI-generated content belongs to you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Fair Use Policy</p>
                  <p className="text-sm text-muted-foreground">
                    Use credits fairly, no abuse or reselling
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">No Illegal Content</p>
                  <p className="text-sm text-muted-foreground">
                    Prohibited: harmful, illegal, or infringing content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Cancel Anytime</p>
                  <p className="text-sm text-muted-foreground">
                    Easy cancellation, no long-term commitment
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <TermsSection
            title="1. Acceptance of Terms"
            content={
              <>
                <p className="mb-4">
                  By creating an account and using Osirix ("the Service"), you agree to these
                  Terms of Service ("Terms"). If you don't agree, please don't use our services.
                </p>
                <p className="mb-4">
                  These Terms apply to all users, including free and paid subscribers. We may
                  update these Terms from time to time. Continued use of the Service after
                  changes constitutes acceptance of the updated Terms.
                </p>
                <p>
                  If you're using Osirix on behalf of a company or organization, you represent
                  that you have the authority to bind that entity to these Terms.
                </p>
              </>
            }
          />

          <TermsSection
            title="2. Description of Service"
            content={
              <>
                <p className="mb-4">
                  Osirix is an AI-powered content creation and monetization platform that
                  provides:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI-generated logos, products, characters, and marketing content</li>
                  <li>Text-to-speech and video generation with lip-sync technology</li>
                  <li>Social media scheduling and automation tools</li>
                  <li>Digital product marketplace for buying and selling</li>
                  <li>Wallet system for earnings and withdrawals</li>
                  <li>Analytics and performance tracking</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to modify, suspend, or discontinue any aspect of the
                  Service at any time, with or without notice.
                </p>
              </>
            }
          />

          <TermsSection
            title="3. Account Registration and Security"
            content={
              <>
                <p className="mb-4">To use Osirix, you must:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Be at least 18 years old</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
                <p className="mb-4">
                  You are responsible for all activities that occur under your account. We
                  recommend using a strong, unique password and enabling two-factor
                  authentication when available.
                </p>
                <p>
                  We reserve the right to refuse service, terminate accounts, or remove content
                  at our discretion, especially in cases of Terms violations.
                </p>
              </>
            }
          />

          <TermsSection
            title="4. Subscription Plans and Billing"
            content={
              <>
                <h3 className="font-semibold mb-2">Plans and Credits</h3>
                <p className="mb-4">
                  Osirix offers multiple subscription tiers (Free, Starter, Pro, Enterprise).
                  Each plan includes a monthly credit allocation for AI generation jobs. Unused
                  credits do not roll over to the next billing period.
                </p>

                <h3 className="font-semibold mb-2">Payment</h3>
                <p className="mb-4">
                  Paid subscriptions are billed monthly or annually in advance. All payments are
                  processed securely through Stripe. By subscribing, you authorize us to charge
                  your payment method on a recurring basis.
                </p>

                <h3 className="font-semibold mb-2">Cancellation and Refunds</h3>
                <p className="mb-4">
                  You may cancel your subscription at any time through your account settings.
                  Cancellation takes effect at the end of your current billing period. We do not
                  provide refunds for partial months or unused credits, except as required by law.
                </p>

                <h3 className="font-semibold mb-2">Price Changes</h3>
                <p>
                  We may change our pricing with 30 days' notice. Price changes apply to new
                  billing cycles. If you don't agree with a price change, you may cancel your
                  subscription before the new price takes effect.
                </p>
              </>
            }
          />

          <TermsSection
            title="5. Acceptable Use Policy"
            content={
              <>
                <p className="mb-4">You agree not to use Osirix to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Create or distribute illegal, harmful, or offensive content</li>
                  <li>Violate intellectual property rights of others</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Spread misinformation, spam, or malware</li>
                  <li>Attempt to circumvent our security measures</li>
                  <li>Resell or redistribute our services without permission</li>
                  <li>Use automated tools to abuse our API or services</li>
                  <li>Generate content that violates platform policies (if distributing on social media)</li>
                </ul>
                <p>
                  Violations may result in immediate account suspension or termination without
                  refund.
                </p>
              </>
            }
          />

          <TermsSection
            title="6. Content Ownership and Licensing"
            content={
              <>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="mb-4">
                  You retain all ownership rights to content you create using Osirix. This
                  includes AI-generated logos, characters, products, videos, and other materials.
                  You may use, modify, and monetize your content as you see fit.
                </p>

                <h3 className="font-semibold mb-2">Limited License to Osirix</h3>
                <p className="mb-4">
                  By using our Service, you grant Osirix a limited, worldwide, non-exclusive
                  license to host, store, and process your content solely to provide the Service.
                  We will not use your content for marketing or other purposes without your
                  explicit consent.
                </p>

                <h3 className="font-semibold mb-2">Marketplace Content</h3>
                <p className="mb-4">
                  When you list content on the Osirix Marketplace, you grant buyers a license to
                  use the purchased content according to the license terms you specify. You
                  represent that you have the right to sell and license the content.
                </p>

                <h3 className="font-semibold mb-2">Third-Party Content</h3>
                <p>
                  Some features may use third-party AI services (ElevenLabs, Wav2Lip). Your use
                  of generated content must comply with their respective terms of service and
                  licensing requirements.
                </p>
              </>
            }
          />

          <TermsSection
            title="7. Marketplace Terms"
            content={
              <>
                <h3 className="font-semibold mb-2">Selling on Osirix Marketplace</h3>
                <p className="mb-4">
                  Sellers can list digital products (logos, templates, characters, etc.) for
                  sale. Osirix takes a commission on each sale (detailed in your seller
                  dashboard). Payouts are processed according to our withdrawal policies.
                </p>

                <h3 className="font-semibold mb-2">Buyer Protection</h3>
                <p className="mb-4">
                  Buyers receive the content as described in the listing. If content is
                  materially different or unusable, buyers may request a refund within 7 days.
                </p>

                <h3 className="font-semibold mb-2">Seller Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate descriptions and previews</li>
                  <li>Ensure you have the right to sell the content</li>
                  <li>Deliver content as promised</li>
                  <li>Respond to buyer inquiries promptly</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </>
            }
          />

          <TermsSection
            title="8. Wallet and Earnings"
            content={
              <>
                <p className="mb-4">
                  Your Osirix Wallet holds earnings from marketplace sales, sponsorships,
                  affiliate commissions, and other monetization activities.
                </p>

                <h3 className="font-semibold mb-2">Withdrawals</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Minimum withdrawal: $10 USD</li>
                  <li>Processing time: 3-5 business days</li>
                  <li>Payment methods: PayPal, Bank Transfer, Stripe</li>
                  <li>You're responsible for any taxes on your earnings</li>
                </ul>

                <h3 className="font-semibold mb-2">Holds and Disputes</h3>
                <p>
                  We may place temporary holds on funds for disputed transactions, pending
                  investigations, or suspected fraud. Holds are released once issues are
                  resolved.
                </p>
              </>
            }
          />

          <TermsSection
            title="9. Intellectual Property"
            content={
              <>
                <p className="mb-4">
                  The Osirix platform, including its software, design, logos, and branding, is
                  protected by copyright, trademark, and other intellectual property laws. You
                  may not copy, modify, or reverse-engineer our platform.
                </p>
                <p className="mb-4">
                  "Osirix" and our logo are trademarks. You may not use our trademarks without
                  written permission, except to refer to our services.
                </p>
                <p>
                  If you believe content on Osirix infringes your intellectual property rights,
                  please contact us at dmca@osirix.ai with details of the infringement.
                </p>
              </>
            }
          />

          <TermsSection
            title="10. Disclaimers and Limitations"
            content={
              <>
                <p className="mb-4 font-semibold uppercase text-sm">
                  The Service is provided "as is" without warranties of any kind.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    We don't guarantee the accuracy, reliability, or quality of AI-generated
                    content
                  </li>
                  <li>We're not responsible for third-party services or integrations</li>
                  <li>We don't guarantee uninterrupted or error-free service</li>
                  <li>
                    You're responsible for ensuring your use of generated content complies with
                    all applicable laws
                  </li>
                </ul>
                <p className="mb-4">
                  <strong>Limitation of Liability:</strong> To the maximum extent permitted by
                  law, Osirix's total liability is limited to the amount you paid us in the 12
                  months preceding the claim. We're not liable for indirect, incidental, or
                  consequential damages.
                </p>
                <p className="text-sm">
                  Some jurisdictions don't allow limitations on implied warranties or liability,
                  so these limitations may not apply to you.
                </p>
              </>
            }
          />

          <TermsSection
            title="11. Indemnification"
            content={
              <>
                <p>
                  You agree to indemnify and hold Osirix harmless from any claims, damages, or
                  expenses (including legal fees) arising from: (a) your use of the Service, (b)
                  your violation of these Terms, (c) your violation of any rights of others, or
                  (d) content you create or distribute using our Service.
                </p>
              </>
            }
          />

          <TermsSection
            title="12. Termination"
            content={
              <>
                <p className="mb-4">
                  Either party may terminate this agreement at any time:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>You:</strong> Cancel your account through account settings
                  </li>
                  <li>
                    <strong>Us:</strong> Terminate or suspend accounts for Terms violations,
                    inactivity, or at our discretion
                  </li>
                </ul>
                <p className="mb-4">Upon termination:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to the Service ends immediately</li>
                  <li>You may download your content within 30 days</li>
                  <li>Pending withdrawals will be processed</li>
                  <li>We may delete your data after 30 days</li>
                  <li>Certain provisions (payment obligations, disclaimers) survive termination</li>
                </ul>
              </>
            }
          />

          <TermsSection
            title="13. Dispute Resolution"
            content={
              <>
                <p className="mb-4">
                  Most disputes can be resolved through our support team. Please contact us first
                  before pursuing legal action.
                </p>

                <h3 className="font-semibold mb-2">Arbitration Agreement</h3>
                <p className="mb-4">
                  If we can't resolve a dispute informally, you agree that disputes will be
                  resolved through binding arbitration, not court litigation, except for small
                  claims court matters.
                </p>

                <h3 className="font-semibold mb-2">Class Action Waiver</h3>
                <p>
                  You agree to resolve disputes individually, not as part of a class action or
                  collective proceeding.
                </p>
              </>
            }
          />

          <TermsSection
            title="14. General Provisions"
            content={
              <>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Governing Law:</strong> These Terms are governed by the laws of
                    Delaware, USA, without regard to conflict of law provisions.
                  </li>
                  <li>
                    <strong>Entire Agreement:</strong> These Terms constitute the entire
                    agreement between you and Osirix regarding the Service.
                  </li>
                  <li>
                    <strong>Severability:</strong> If any provision is found unenforceable, the
                    remaining provisions remain in effect.
                  </li>
                  <li>
                    <strong>No Waiver:</strong> Our failure to enforce any right doesn't waive
                    that right.
                  </li>
                  <li>
                    <strong>Assignment:</strong> You may not assign these Terms. We may assign
                    them to a successor in a merger or acquisition.
                  </li>
                  <li>
                    <strong>Force Majeure:</strong> We're not liable for delays caused by events
                    beyond our reasonable control.
                  </li>
                </ul>
              </>
            }
          />

          <TermsSection
            title="15. Contact Information"
            content={
              <>
                <p className="mb-4">
                  Questions about these Terms? Need support? Contact us:
                </p>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">Osirix Support</p>
                  <p className="text-sm text-muted-foreground">Email: legal@osirix.ai</p>
                  <p className="text-sm text-muted-foreground">Support: support@osirix.ai</p>
                  <p className="text-sm text-muted-foreground">
                    Response time: Within 48 hours
                  </p>
                </div>
              </>
            }
          />

          {/* Acknowledgment */}
          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Acknowledgment</h3>
                <p className="text-sm text-muted-foreground">
                  By using Osirix, you acknowledge that you have read, understood, and agree to
                  be bound by these Terms of Service. If you have questions or concerns, please
                  contact us before using the Service.
                </p>
              </div>
            </div>
          </Card>
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

function TermsSection({
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
