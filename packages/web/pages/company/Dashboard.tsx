import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, TrendingUp, Users, Plus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchLoads, fetchVehicles, fetchDrivers } from "@/lib/trucker-api";
import type {
  BackendLoad,
  BackendVehicle,
  BackendDriver,
} from "@/lib/trucker-api";
import { useEffect, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  in_transit: "from-emerald-500 to-teal-600 border-0",
  pending: "bg-linear-to-r from-amber-500 to-orange-600 border-0",
  delivered: "from-blue-500 to-indigo-600 border-0",
};

function getStatusColor(status: string) {
  return STATUS_COLORS[status] ?? "from-gray-400 to-gray-500 border-0";
}

const STAT_CONFIGS = [
  {
    labelKey: ["Fleet Size", "बेड़े का आकार"],
    icon: Truck,
    color: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    darkBg: "from-blue-950/30 to-indigo-950/30",
  },
  {
    labelKey: ["Active Loads", "सक्रिय लोड"],
    icon: Package,
    color: "from-orange-500 to-amber-600",
    bg: "from-orange-50 to-amber-50",
    darkBg: "from-orange-950/30 to-amber-950/30",
  },
  {
    labelKey: ["This Month Revenue", "इस महीने राजस्व"],
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    darkBg: "from-emerald-950/30 to-teal-950/30",
  },
  {
    labelKey: ["Active Truckers", "सक्रिय ट्रकर"],
    icon: Users,
    color: "from-purple-500 to-violet-600",
    bg: "from-purple-50 to-violet-50",
    darkBg: "from-purple-950/30 to-violet-950/30",
  },
];

function StatSkeleton() {
  return (
    <Card className="overflow-hidden border-0">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-0 rounded-xl bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-5 w-16 rounded bg-muted animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [drivers, setDrivers] = useState<BackendDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session.isAuthenticated || !session.accessToken) return;

    const fetchData = async () => {
      try {
        const orgId = session.user?.organizationId;
        const [loadsData, vehiclesData, driversData] = await Promise.all([
          fetchLoads(session),
          fetchVehicles(session, orgId),
          fetchDrivers(session, orgId),
        ]);
        setLoads(loadsData);
        setVehicles(vehiclesData);
        setDrivers(driversData);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [session]);

  const fleetSize = vehicles.length;
  const activeLoads = loads.filter(
    (l) => l.status === "in_transit" || l.status === "pending"
  ).length;
  const activeDrivers = drivers.filter(
    (d) => d.status === "available" || d.status === "on_load"
  ).length;
  const thisMonthRevenue = loads
    .filter((l) => {
      const loadDate = new Date(l.created_at);
      const now = new Date();
      return (
        loadDate.getMonth() === now.getMonth() &&
        loadDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, l) => sum + (l.total_revenue ?? 0), 0);

  const displayLoads = loads.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="h-4 w-64 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CONFIGS.map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 rounded bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <LoadSkeleton key={i} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const stats = STAT_CONFIGS.map((cfg, i) => {
    const values = [fleetSize, activeLoads, thisMonthRevenue, activeDrivers];
    const formattedValues = [
      String(values[0]),
      String(values[1]),
      `₹${(values[2] / 100000).toFixed(1)}L`,
      String(values[3]),
    ];
    return {
      label: t(cfg.labelKey[0], cfg.labelKey[1]),
      value: formattedValues[i],
      icon: cfg.icon,
      color: cfg.color,
      bg: cfg.bg,
      darkBg: cfg.darkBg,
    };
  });

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
              "अपने बेड़े और संचालन प्रबंधित करें"
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
          const StatIcon = s.icon;
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
                    <StatIcon className="w-5 h-5 text-white" />
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
          {displayLoads.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("No loads found", "कोई लोड नहीं मिला")}
            </p>
          ) : (
            displayLoads.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{l.load_number}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {l.origin_city} → {l.destination_city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">
                    ₹{l.rate.toLocaleString()}
                  </span>
                  <Badge className={getStatusColor(l.status)}>
                    {t(l.status.replace("_", " "), l.status.replace("_", " "))}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
