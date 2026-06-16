import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, TrendingUp, Clock, Plus, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";

export default function CustomerDashboard() {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("Active Loads", "सक्रिय लोड"),
      value: "4",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      darkBg: "from-blue-950/30 to-indigo-950/30",
    },
    {
      label: t("In Transit", "यातायात में"),
      value: "2",
      icon: Truck,
      color: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-50",
      darkBg: "from-orange-950/30 to-amber-950/30",
    },
    {
      label: t("Delivered", "डिलीवर हुए"),
      value: "38",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      darkBg: "from-emerald-950/30 to-teal-950/30",
    },
    {
      label: t("Avg. Delivery Time", "औसत डिलीवरी समय"),
      value: "2.4d",
      icon: Clock,
      color: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      darkBg: "from-purple-950/30 to-violet-950/30",
    },
  ];

  const recentLoads = [
    {
      id: "LD-001",
      from: t("Mumbai", "मुंबई"),
      to: t("Delhi", "दिल्ली"),
      status: "in_transit",
      amount: "₹35,000",
      progress: 65,
    },
    {
      id: "LD-002",
      from: t("Pune", "पुणे"),
      to: t("Bengaluru", "बेंगलुरु"),
      status: "delivered",
      amount: "₹22,000",
      progress: 100,
    },
    {
      id: "LD-003",
      from: t("Jaipur", "जयपुर"),
      to: t("Ahmedabad", "अहमदाबाद"),
      status: "pending",
      amount: "₹18,500",
      progress: 0,
    },
  ];

  const statusLabel: Record<string, string> = {
    in_transit: t("In Transit", "यातायात में"),
    delivered: t("Delivered", "डिलीवर हुआ"),
    pending: t("Pending", "लंबित"),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("Welcome back!", "वापस आपका स्वागत है!")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Manage your shipments easily",
              "अपने शिपमेंट आसानी से प्रबंधित करें"
            )}
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
        >
          <Link to="/customer/post-load">
            <Plus className="w-4 h-4 mr-1" />
            {t("Post a Load", "लोड पोस्ट करें")}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className={`overflow-hidden border-0 bg-linear-to-br ${stat.bg} dark:${stat.darkBg}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}
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
          <CardTitle>{t("Recent Shipments", "हाल के शिपमेंट")}</CardTitle>
          <CardDescription>
            {t(
              "Track all your active and recent loads",
              "अपने सभी सक्रिय और हाल के लोड ट्रैक करें"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentLoads.map((load) => (
            <div
              key={load.id}
              className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{load.id}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {load.from} → {load.to}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary">
                  {load.amount}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                    load.status === "in_transit"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : load.status === "delivered"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                  }`}
                >
                  {statusLabel[load.status]}
                </span>
                {load.status === "in_transit" && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-muted"
                  >
                    <Link to="/customer/tracking">
                      <MapPin className="w-3 h-3 mr-1" />
                      {t("Track", "ट्रैक")}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
