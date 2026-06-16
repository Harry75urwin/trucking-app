import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Truck,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LoadStatusBadge } from "@/components/status-badges";
import { supabase, type Load, type Driver } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38500 },
  { month: "Mar", revenue: 51200 },
  { month: "Apr", revenue: 47800 },
  { month: "May", revenue: 55600 },
  { month: "Jun", revenue: 48200 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface Stats {
  activeLoads: number;
  availableDrivers: number;
  activeVehicles: number;
  monthRevenue: number;
  problemLoads: number;
  pendingLoads: number;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    activeLoads: 0,
    availableDrivers: 0,
    activeVehicles: 0,
    monthRevenue: 0,
    problemLoads: 0,
    pendingLoads: 0,
  });
  const [recentLoads, setRecentLoads] = useState<Load[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: loads }, { data: drivers }, { data: vehicles }] =
        await Promise.all([
          supabase
            .from("loads")
            .select("*, customers(name)")
            .order("created_at", { ascending: false }),
          supabase.from("drivers").select("*"),
          supabase.from("vehicles").select("*"),
        ]);

      if (loads) {
        const active = loads.filter((l: Load) =>
          ["dispatched", "in_transit"].includes(l.status),
        );
        const problems = loads.filter((l: Load) => l.status === "problem");
        const pending = loads.filter((l: Load) => l.status === "pending");
        const monthRev = loads
          .filter((l: Load) => l.status === "delivered")
          .reduce((sum: number, l: Load) => sum + (l.total_revenue || 0), 0);

        setStats((prev) => ({
          ...prev,
          activeLoads: active.length,
          problemLoads: problems.length,
          pendingLoads: pending.length,
          monthRevenue: monthRev,
        }));
        setRecentLoads(loads.slice(0, 6));
      }

      if (drivers) {
        const avail = drivers.filter((d: Driver) => d.status === "available");
        setStats((prev) => ({ ...prev, availableDrivers: avail.length }));
        setAvailableDrivers(avail.slice(0, 4));
      }

      if (vehicles) {
        const active = vehicles.filter(
          (v: any) => v.status === "active" && v.type === "truck",
        );
        setStats((prev) => ({ ...prev, activeVehicles: active.length }));
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("Dashboard", "डैशबोर्ड")}
        </h1>
        <p className="text-muted-foreground">
          {t("Fleet operations overview", "फ्लीट संचालन अवलोकन")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("Active Loads", "सक्रिय लोड")}
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingLoads} {t("pending dispatch", "लंबित डिस्पैच")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("Available Drivers", "उपलब्ध ड्राइवर")}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableDrivers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("Ready for dispatch", "डिस्पैच के लिए तैयार")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("Active Trucks", "सक्रिय ट्रक")}
            </CardTitle>
            <Truck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">In service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("Month Revenue", "मासिक राजस्व")}
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {stats.monthRevenue.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="size-3 text-green-600" />
              {t("From delivered loads", "डिलीवर किए गए लोड से")}
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.problemLoads > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-red-700 dark:text-red-300">
            <strong>
              {stats.problemLoads} {t("load", "लोड")}
              {stats.problemLoads > 1 ? t("s", "स") : ""}
            </strong>{" "}
            {t("require attention", "ध्यान की आवश्यकता है")}
          </span>
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/loads">{t("View Loads", "लोड देखें")}</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("Revenue Trend", "राजस्व प्रवृत्ति")}</CardTitle>
            <CardDescription>
              {t(
                "Monthly revenue over the past 6 months",
                "पिछले 6 महीने का मासिक राजस्व",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-55 w-full">
              <BarChart
                accessibilityLayer
                data={revenueData}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        `$${Number(value).toLocaleString()}`,
                        t("Revenue", "राजस्व"),
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("Available Drivers", "उपलब्ध ड्राइवर")}</CardTitle>
              <CardDescription>
                {t("Ready for dispatch", "डिस्पैच के लिए तैयार")}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/drivers">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {availableDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("No available drivers", "कोई ड्राइवर उपलब्ध नहीं")}
              </p>
            ) : (
              availableDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {driver.first_name[0]}
                    {driver.last_name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      {driver.home_city}, {driver.home_state}
                    </p>
                  </div>
                </div>
              ))
            )}
            {availableDrivers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                asChild
              >
                <Link to="/dispatch">{t("Dispatch Load", "लोड भेजें")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("Recent Loads", "हाल के लोड")}</CardTitle>
            <CardDescription>
              {t("Latest load activity", "नवीनतम लोड गतिविधि")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/loads">{t("View All", "सभी देखें")}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    {t("Load #", "लोड #")}
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    {t("Customer", "ग्राहक")}
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    {t("Route", "मार्ग")}
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    {t("Status", "स्थिति")}
                  </th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">
                    {t("Revenue", "राजस्व")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentLoads.map((load) => (
                  <tr key={load.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs font-medium">
                      {load.load_number}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {(load as Load & { customers?: { name: string } })
                        .customers?.name ?? "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {load.origin_city}, {load.origin_state} →{" "}
                      {load.destination_city}, {load.destination_state}
                    </td>
                    <td className="py-3">
                      <LoadStatusBadge status={load.status} />
                    </td>
                    <td className="py-3 text-right font-medium">
                      $
                      {load.total_revenue?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                {recentLoads.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {t("No loads found", "कोई लोड नहीं मिला")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
