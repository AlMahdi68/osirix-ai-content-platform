"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface WalletData {
  id: number;
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  sourceType: string;
  description: string;
  createdAt: string;
}

interface WithdrawalRequest {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

interface EarningsSummary {
  bySourceType: Record<string, { totalAmount: number; count: number; averageAmount: number }>;
  totalEarnings: number;
  totalTransactions: number;
}

export default function WalletPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("paypal");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/wallet");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchWalletData();
    }
  }, [session]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("bearer_token");

      const [walletRes, transactionsRes, withdrawalsRes, earningsRes] = await Promise.all([
        fetch("/api/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/wallet/transactions?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/wallet/withdrawals", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/wallet/earnings-summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions);
      }

      if (withdrawalsRes.ok) {
        const withdrawalsData = await withdrawalsRes.json();
        setWithdrawals(withdrawalsData.withdrawals);
      }

      if (earningsRes.ok) {
        const earningsData = await earningsRes.json();
        setEarnings(earningsData);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount) * 100; // Convert to cents

    if (!amount || amount < 1000) {
      toast.error("Minimum withdrawal amount is $10");
      return;
    }

    if (!wallet || amount > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!paymentEmail) {
      toast.error("Please enter your payment details");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          method: withdrawMethod,
          paymentDetails: {
            email: paymentEmail,
            accountName: session?.user?.name || "",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Withdrawal request submitted successfully!");
        setWithdrawDialogOpen(false);
        setWithdrawAmount("");
        setPaymentEmail("");
        fetchWalletData();
      } else {
        toast.error(data.error || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case "failed":
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
        </div>
        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Request a withdrawal from your wallet. Minimum amount is $10.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="10"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Available balance: {wallet ? formatCurrency(wallet.balance) : "$0.00"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Payment Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Withdrawal Request"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {wallet ? formatCurrency(wallet.balance) : "$0.00"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Pending Balance</p>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold">
            {wallet ? formatCurrency(wallet.pendingBalance) : "$0.00"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">
            {wallet ? formatCurrency(wallet.totalEarnings) : "$0.00"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Total Withdrawn</p>
            <Download className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">
            {wallet ? formatCurrency(wallet.totalWithdrawn) : "$0.00"}
          </p>
        </Card>
      </div>

      {/* Earnings Summary */}
      {earnings && Object.keys(earnings.bySourceType).length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Earnings by Source</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(earnings.bySourceType).map(([source, data]) => (
              <div
                key={source}
                className="p-4 rounded-lg border border-border/50 bg-card/50"
              >
                <p className="text-sm text-muted-foreground capitalize mb-1">
                  {source.replace(/_/g, " ")}
                </p>
                <p className="text-2xl font-bold mb-2">
                  {formatCurrency(data.totalAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.count} transactions · Avg {formatCurrency(data.averageAmount)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {transaction.type === "earning" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)} · {transaction.sourceType.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusIcon(transaction.status)}
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "earning"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "earning" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Withdrawal Requests</h2>
            {withdrawals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No withdrawal requests yet
              </p>
            ) : (
              <div className="space-y-2">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {withdrawal.method.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requested {formatDate(withdrawal.createdAt)}
                        </p>
                        {withdrawal.rejectionReason && (
                          <p className="text-sm text-red-400 mt-1">
                            Reason: {withdrawal.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusIcon(withdrawal.status)}
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(withdrawal.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {withdrawal.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
