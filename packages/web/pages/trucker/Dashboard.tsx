import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Truck, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchLoads, type BackendLoad } from "@/lib/trucker-api";

export default function TruckerDashboard() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLoads(session)
      .then((data) => {
        if (!cancelled) setLoads(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const activeLoads = useMemo(
    () =>
      loads.filter((l) =>
        ["pending", "dispatched", "in_transit", "problem"].includes(l.status)
      ),
    [loads]
  );

  const stats = useMemo(
    () => [
      {
        label: t("Active Loads", "सक्रिय लोड"),
        value: String(activeLoads.length),
        icon: Truck,
        color: "from-blue-500 to-indigo-600",
        bg: "from-blue-50 to-indigo-50",
        darkBg: "from-blue-950/30 to-indigo-950/30",
      },
      {
        label: t("In Transit", "यातायात में"),
        value: String(loads.filter((l) => l.status === "in_transit").length),
        icon: MapPin,
        color: "from-emerald-500 to-teal-600",
        bg: "from-emerald-50 to-teal-50",
        darkBg: "from-emerald-950/30 to-teal-950/30",
      },
      {
        label: t("Delivered", "डिलीवर की गई"),
        value: String(loads.filter((l) => l.status === "delivered").length),
        icon: TrendingUp,
        color: "from-amber-500 to-orange-600",
        bg: "from-amber-50 to-orange-50",
        darkBg: "from-amber-950/30 to-orange-950/30",
      },
      {
        label: t("Problem", "समस्या"),
        value: String(loads.filter((l) => l.status === "problem").length),
        icon: Clock,
        color: "from-rose-500 to-pink-600",
        bg: "from-rose-50 to-pink-50",
        darkBg: "from-rose-950/30 to-pink-950/30",
      },
    ],
    [loads, activeLoads.length, t]
  );

  const statusLabel = (status: BackendLoad["status"]) => {
    switch (status) {
      case "in_transit":
        return {
          badgeClass: "bg-linear-to-r from-blue-500 to-indigo-600 border-0",
          text: t("In Transit", "यातायात में"),
        };
      case "pending":
        return {
          badgeClass: "bg-linear-to-r from-amber-500 to-orange-600 border-0",
          text: t("Pending", "लंबित"),
        };
      case "dispatched":
        return {
          badgeClass: "bg-linear-to-r from-purple-500 to-violet-600 border-0",
          text: t("Dispatched", "भेजा गया"),
        };
      case "delivered":
        return {
          badgeClass: "bg-linear-to-r from-emerald-500 to-teal-600 border-0",
          text: t("Delivered", "डिलीवर"),
        };
      case "problem":
        return {
          badgeClass: "bg-linear-to-r from-rose-500 to-pink-600 border-0",
          text: t("Problem", "समस्या"),
        };
      default:
        return { badgeClass: "", text: status };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {t("Hello, Raj!", "नमस्ते, राज!")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Welcome to your truck network dashboard",
            "आपके ट्रक नेटवर्क डैशबोर्ड में आपका स्वागत है"
          )}
        </p>
      </div>

      {/* Stats */}
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

      {/* Main Content */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            {t("Active Loads", "सक्रिय लोड")} ({activeLoads.length})
          </TabsTrigger>
          <TabsTrigger value="history">{t("History", "इतिहास")}</TabsTrigger>
        </TabsList>

        {/* Active Loads Tab */}
        <TabsContent value="active" className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("Loading loads...", "लोड लोड हो रहे हैं...")}
              </CardContent>
            </Card>
          )}
          {error && (
            <Card>
              <CardContent className="pt-6 text-center text-rose-500">
                {error}
              </CardContent>
            </Card>
          )}
          {!loading && !error && activeLoads.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t("No active loads found", "कोई सक्रिय लोड नहीं मिला")}
              </CardContent>
            </Card>
          )}
          {activeLoads.map((load) => {
            const progressMap: Record<string, number> = {
              pending: 0,
              dispatched: 20,
              in_transit: 65,
              delivered: 100,
              problem: 45,
            };
            const progress = progressMap[load.status] ?? 0;
            const price = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(load.rate + load.fuel_surcharge + load.detention);
            const status = statusLabel(load.status);

            return (
              <Card key={load.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          {load.load_number}
                        </CardTitle>
                        <Badge className={status.badgeClass}>
                          {status.text}
                        </Badge>
                      </div>
                      <CardDescription>
                        {load.origin_city} → {load.destination_city}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-primary">
                        {price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {load.weight_lbs.toLocaleString()} lbs
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("Progress", "प्रगति")}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all shadow-sm"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/trucker/tracking/${load.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="w-4 h-4 mr-1" />{" "}
                        {t("Track", "ट्रैक करें")}
                      </Button>
                    </Link>
                    <Link to={`/trucker/load/${load.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Clock className="w-4 h-4 mr-1" />{" "}
                        {t("Details", "विवरण")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-8">
              {t(
                "Your load history will appear here",
                "आपका लोड इतिहास यहाँ दिखाई देगा"
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
