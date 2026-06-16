import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function PaymentsPage() {
  const { t } = useLanguage();

  const summary = [
    {
      label: t("Total Spent", "कुल खर्च"),
      value: "₹3,42,500",
      icon: IndianRupee,
      color: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      darkBg: "from-blue-950/30 to-indigo-950/30",
    },
    {
      label: t("This Month", "इस महीने"),
      value: "₹75,000",
      icon: TrendingUp,
      color: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-50",
      darkBg: "from-orange-950/30 to-amber-950/30",
    },
    {
      label: t("Pending", "लंबित"),
      value: "₹35,000",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bg: "from-amber-50 to-orange-50",
      darkBg: "from-amber-950/30 to-orange-950/30",
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      loadId: "LD-2024-001",
      amount: "₹35,000",
      status: "pending",
      date: "Jun 10, 2024",
      method: "UPI",
    },
    {
      id: "TXN-002",
      loadId: "LD-2024-002",
      amount: "₹22,000",
      status: "paid",
      date: "Jun 5, 2024",
      method: "NEFT",
    },
    {
      id: "TXN-003",
      loadId: "LD-2023-098",
      amount: "₹48,000",
      status: "paid",
      date: "May 20, 2024",
      method: "UPI",
    },
    {
      id: "TXN-004",
      loadId: "LD-2023-092",
      amount: "₹31,500",
      status: "paid",
      date: "May 10, 2024",
      method: "Bank Transfer",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Payments", "भुगतान")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Manage all your payment transactions",
            "अपने सभी भुगतान लेनदेन प्रबंधित करें",
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card
              key={i}
              className={`overflow-hidden border-0 bg-linear-to-br ${s.bg} dark:${s.darkBg}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br ${s.color} shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="gradient-text">
            {t("Transaction History", "लेनदेन इतिहास")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 transition-all hover:from-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full shadow-md ${txn.status === "paid" ? "bg-linear-to-br from-emerald-500 to-teal-600" : "bg-linear-to-br from-amber-500 to-orange-600"}`}
                  >
                    {txn.status === "paid" ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.loadId}</p>
                    <p className="text-sm text-muted-foreground">
                      {txn.date} · {txn.method}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-primary text-lg">
                    {txn.amount}
                  </span>
                  {txn.status === "pending" ? (
                    <Button
                      size="sm"
                      className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      {t("Pay Now", "अभी भुगतान करें")}
                    </Button>
                  ) : (
                    <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0">
                      {t("Paid", "भुगतान हुआ")}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
