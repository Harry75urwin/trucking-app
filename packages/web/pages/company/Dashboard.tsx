import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, TrendingUp, Users, Plus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";

export default function CompanyDashboard() {
  const { t } = useLanguage();
  const stats = [
    {
      label: t("Fleet Size", "बेड़े का आकार"),
      value: "24",
      icon: Truck,
      color: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      darkBg: "from-blue-950/30 to-indigo-950/30",
    },
    {
      label: t("Active Loads", "सक्रिय लोड"),
      value: "12",
      icon: Package,
      color: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-50",
      darkBg: "from-orange-950/30 to-amber-950/30",
    },
    {
      label: t("This Month Revenue", "इस महीने राजस्व"),
      value: "₹8.4L",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      darkBg: "from-emerald-950/30 to-teal-950/30",
    },
    {
      label: t("Active Truckers", "सक्रिय ट्रकर"),
      value: "18",
      icon: Users,
      color: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      darkBg: "from-purple-950/30 to-violet-950/30",
    },
  ];
  const loads = [
    {
      id: "LD-001",
      from: "Mumbai",
      to: "Delhi",
      trucker: "Raj Singh",
      status: "in_transit",
      amount: "₹45,000",
    },
    {
      id: "LD-002",
      from: "Pune",
      to: "Bengaluru",
      trucker: "Amit Yadav",
      status: "in_transit",
      amount: "₹32,000",
    },
    {
      id: "LD-003",
      from: "Jaipur",
      to: "Ahmedabad",
      trucker: "-",
      status: "pending",
      amount: "₹28,000",
    },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("Company Dashboard", "कंपनी डैशबोर्ड")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Manage your fleet and operations",
              "अपने बेड़े और संचालन प्रबंधित करें",
            )}
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Link to="/company/post-load">
            <Plus className="w-4 h-4 mr-1" />
            {t("Post Load", "लोड पोस्ट करें")}
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
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
      <Card>
        <CardHeader>
          <CardTitle>{t("Active Loads", "सक्रिय लोड")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loads.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{l.id}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {l.from} → {l.to} · {l.trucker}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{l.amount}</span>
                <Badge
                  className={
                    l.status === "in_transit"
                      ? "bg-linear-to-r from-emerald-500 to-teal-600 border-0"
                      : "bg-linear-to-r from-amber-500 to-orange-600 border-0"
                  }
                >
                  {l.status === "in_transit"
                    ? t("In Transit", "यातायात में")
                    : t("Pending", "लंबित")}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
