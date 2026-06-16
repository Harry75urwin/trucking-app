import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export default function EarningsPage() {
  const { t } = useLanguage();

  const summary = [
    {
      label: t("This Month", "इस महीने"),
      value: "₹48,000",
      icon: IndianRupee,
      color: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      darkBg: "from-emerald-950/30 to-teal-950/30",
    },
    {
      label: t("Last Month", "पिछले महीने"),
      value: "₹62,000",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      darkBg: "from-blue-950/30 to-indigo-950/30",
    },
    {
      label: t("Total (2024)", "कुल (2024)"),
      value: "₹3,45,000",
      icon: Calendar,
      color: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-50",
      darkBg: "from-orange-950/30 to-amber-950/30",
    },
  ];

  const transactions = [
    {
      load: "LD-2024-001",
      route: "Mumbai → Delhi",
      date: "Jun 10",
      amount: "₹35,000",
      status: "pending",
    },
    {
      load: "LD-2024-002",
      route: "Bengaluru → Chennai",
      date: "Jun 5",
      amount: "₹28,000",
      status: "paid",
    },
    {
      load: "LD-2023-099",
      route: "Jaipur → Delhi",
      date: "May 28",
      amount: "₹32,000",
      status: "paid",
    },
    {
      load: "LD-2023-091",
      route: "Mumbai → Pune",
      date: "May 15",
      amount: "₹15,000",
      status: "paid",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("Earnings", "कमाई")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Your payment history and stats",
              "आपका भुगतान इतिहास और आंकड़े"
            )}
          </p>
        </div>
        <Button variant="outline" className="hover:bg-muted">
          <Download className="w-4 h-4 mr-1" />
          {t("Export", "निर्यात करें")}
        </Button>
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
            {t("Payment History", "भुगतान इतिहास")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 transition-all hover:from-muted/50"
              >
                <div>
                  <p className="font-medium">{tx.load}</p>
                  <p className="text-sm text-muted-foreground">
                    {tx.route} · {tx.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary text-lg">
                    {tx.amount}
                  </span>
                  <Badge
                    className={
                      tx.status === "paid"
                        ? "bg-linear-to-r from-emerald-500 to-teal-600 border-0"
                        : "bg-linear-to-r from-amber-500 to-orange-600 border-0"
                    }
                  >
                    {tx.status === "paid"
                      ? t("Paid", "भुगतान हुआ")
                      : t("Pending", "लंबित")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
