import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const stats = [
    {
      label: t("Total Users", "कुल उपयोगकर्ता"),
      value: "1,248",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      darkBg: "from-blue-950/30 to-indigo-950/30",
      change: "+12%",
    },
    {
      label: t("Active Loads", "सक्रिय लोड"),
      value: "342",
      icon: Package,
      color: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-50",
      darkBg: "from-orange-950/30 to-amber-950/30",
      change: "+8%",
    },
    {
      label: t("Registered Trucks", "पंजीकृत ट्रक"),
      value: "896",
      icon: Truck,
      color: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      darkBg: "from-emerald-950/30 to-teal-950/30",
      change: "+5%",
    },
    {
      label: t("Open Disputes", "खुले विवाद"),
      value: "7",
      icon: AlertTriangle,
      color: "from-rose-500 to-pink-600",
      bg: "from-rose-50 to-pink-50",
      darkBg: "from-rose-950/30 to-pink-950/30",
      change: "-2",
    },
    {
      label: t("Platform Revenue", "प्लेटफॉर्म राजस्व"),
      value: "₹12.4L",
      icon: IndianRupee,
      color: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      darkBg: "from-purple-950/30 to-violet-950/30",
      change: "+18%",
    },
    {
      label: t("Loads This Month", "इस महीने लोड"),
      value: "284",
      icon: TrendingUp,
      color: "from-cyan-500 to-sky-600",
      bg: "from-cyan-50 to-sky-50",
      darkBg: "from-cyan-950/30 to-sky-950/30",
      change: "+22%",
    },
  ];
  const recentActivity = [
    {
      type: "user",
      text: t(
        "New trucker registered: Suresh Kumar",
        "नया ट्रकर पंजीकृत: सुरेश कुमार",
      ),
      time: "5m ago",
    },
    {
      type: "load",
      text: t(
        "Load LD-2024-342 marked delivered",
        "लोड LD-2024-342 डिलीवर मार्क किया",
      ),
      time: "12m ago",
    },
    {
      type: "dispute",
      text: t(
        "New dispute filed on LD-2024-310",
        "LD-2024-310 पर नया विवाद दायर",
      ),
      time: "30m ago",
    },
    {
      type: "user",
      text: t('Company "FastFreight" verified', 'कंपनी "FastFreight" सत्यापित'),
      time: "1h ago",
    },
  ];
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Admin Dashboard", "एडमिन डैशबोर्ड")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Platform overview and management",
            "प्लेटफॉर्म अवलोकन और प्रबंधन",
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      {s.change} {t("vs last month", "पिछले महीने से")}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br ${s.color} shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
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
            {t("Recent Activity", "हाल की गतिविधि")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 transition-all hover:from-muted/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full shadow-md ${a.type === "dispute" ? "bg-linear-to-br from-rose-500 to-pink-600" : a.type === "load" ? "bg-linear-to-br from-emerald-500 to-teal-600" : "bg-linear-to-br from-blue-500 to-indigo-600"}`}
                />
                <p className="text-sm">{a.text}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                {a.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
