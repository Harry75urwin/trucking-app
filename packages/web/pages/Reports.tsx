import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import {
  fetchLoads,
  fetchTrackingEvents,
  type BackendLoad,
  type BackendTrackingEvent,
} from "@/lib/trucker-api";

const statusConfigData = {
  delivered: { color: "var(--chart-1)" },
  in_transit: { color: "var(--chart-2)" },
  dispatched: { color: "var(--chart-3)" },
  pending: { color: "var(--chart-4)" },
  problem: { color: "var(--chart-5)" },
};

const statusLabels: Record<string, { en: string; hi: string }> = {
  delivered: { en: "Delivered", hi: "डिलीवर किया गया" },
  in_transit: { en: "In Transit", hi: "यातायात में" },
  dispatched: { en: "Dispatched", hi: "भेजा गया" },
  pending: { en: "Pending", hi: "लंबित" },
  problem: { en: "Problem", hi: "समस्या" },
};

interface MonthlyData {
  month: string;
  revenue: number;
  count: number;
}

interface StatusData {
  status: string;
  count: number;
  fill: string;
}

function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((field) => {
          const val = row[field];
          return typeof val === "string" && val.includes(",")
            ? `"${val}"`
            : String(val ?? "");
        })
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { t } = useLanguage();
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<BackendTrackingEvent[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6m");
  const { session } = { session: { accessToken: "" } };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchLoads({ accessToken: "" } as any).catch(() => []),
      fetchTrackingEvents({ accessToken: "" } as any).catch(() => []),
    ])
      .then(([loadsData, eventsData]) => {
        if (!cancelled) {
          setLoads(loadsData);
          setTrackingEvents(eventsData);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; count: number }> = {};
    const now = new Date();
    const range =
      period === "1m" ? 1 : period === "3m" ? 3 : period === "6m" ? 6 : 12;
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      months[key] = { revenue: 0, count: 0 };
    }
    loads.forEach((load) => {
      const d = new Date(load.created_at);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (months[key]) {
        months[key].revenue += load.total_revenue ?? 0;
        months[key].count++;
      }
    });
    return Object.entries(months).map(([month, v]) => ({ month, ...v }));
  }, [loads, period]);

  const statusData = useMemo<StatusData[]>(() => {
    const counts: Record<string, number> = {};
    loads.forEach((l) => {
      counts[l.status] = (counts[l.status] ?? 0) + 1;
    });
    const colors = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];
    return Object.entries(counts).map(([status, count], i) => ({
      status,
      count,
      fill: colors[i % colors.length],
    }));
  }, [loads]);

  const topRoutes = useMemo(() => {
    const routeMap: Record<string, { count: number; revenue: number }> = {};
    loads.forEach((l) => {
      const key = `${l.origin_state} → ${l.destination_state}`;
      if (!routeMap[key]) routeMap[key] = { count: 0, revenue: 0 };
      routeMap[key].count++;
      routeMap[key].revenue += l.total_revenue ?? 0;
    });
    return Object.entries(routeMap)
      .map(([route, v]) => ({ route, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [loads]);

  const totalRevenue = loads.reduce(
    (sum, l) => sum + (l.total_revenue ?? 0),
    0,
  );
  const deliveredLoads = loads.filter((l) => l.status === "delivered");
  const avgRevenue =
    deliveredLoads.length > 0 ? totalRevenue / deliveredLoads.length : 0;
  const totalMiles = loads.reduce((sum, l) => sum + (l.miles ?? 0), 0);
  const rpmLoads = loads.filter((l) => l.miles && l.miles > 0);
  const avgRPM =
    rpmLoads.length > 0
      ? rpmLoads.reduce((sum, l) => sum + (l.total_revenue ?? 0) / l.miles, 0) /
        rpmLoads.length
      : 0;

  const revenueConfig: ChartConfig = {
    revenue: { label: t("Revenue", "राजस्व"), color: "var(--chart-1)" },
  };
  const loadsConfig: ChartConfig = {
    count: { label: t("Loads", "लोड"), color: "var(--chart-2)" },
  };
  const statusConfig: ChartConfig = Object.fromEntries(
    Object.entries(statusConfigData).map(([key, val]) => [
      key,
      {
        label: statusLabels[key]
          ? t(statusLabels[key].en, statusLabels[key].hi)
          : key,
        color: val.color,
      },
    ]),
  ) as ChartConfig;

  const getStatusLabel = (status: string) =>
    statusLabels[status]
      ? t(statusLabels[status].en, statusLabels[status].hi)
      : status.replace("_", " ");

  const exportLoadsCsv = () => {
    exportToCsv(
      "loads-report.csv",
      loads.map((l) => ({
        id: l.load_number,
        status: l.status,
        from: `${l.origin_city}, ${l.origin_state}`,
        to: `${l.destination_city}, ${l.destination_state}`,
        commodity: l.commodity,
        weight_lbs: l.weight_lbs,
        miles: l.miles,
        rate: l.rate,
        revenue: l.total_revenue ?? 0,
        created_at: l.created_at,
      })),
    );
  };

  const exportMonthlyCsv = () => {
    exportToCsv("monthly-report.csv", monthlyData);
  };

  const exportTopRoutesCsv = () => {
    exportToCsv(
      "top-routes.csv",
      topRoutes.map((r) => ({
        route: r.route,
        count: r.count,
        revenue: r.revenue,
      })),
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Reports", "रिपोर्ट")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Operational analytics and performance metrics",
              "परिचालन विश्लेषण और प्रदर्शन मीट्रिक्स",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">
                {t("Last 1 Month", "पिछला 1 महीना")}
              </SelectItem>
              <SelectItem value="3m">
                {t("Last 3 Months", "पिछले 3 महीने")}
              </SelectItem>
              <SelectItem value="6m">
                {t("Last 6 Months", "पिछले 6 महीने")}
              </SelectItem>
              <SelectItem value="12m">
                {t("Last 12 Months", "पिछले 12 महीने")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("Loading reports...", "रिपोर्ट लोड हो रही है...")}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={exportLoadsCsv}
            >
              <FileText className="w-4 h-4" />{" "}
              {t("Export Loads CSV", "लोड CSV निर्यात")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={exportMonthlyCsv}
            >
              <Download className="w-4 h-4" />{" "}
              {t("Export Monthly CSV", "मासिक CSV निर्यात")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={exportTopRoutesCsv}
            >
              <Download className="w-4 h-4" />{" "}
              {t("Export Routes CSV", "मार्ग CSV निर्यात")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="border-0 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ₹
                  {totalRevenue.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("Total Revenue", "कुल राजस्व")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{loads.length}</div>
                <p className="text-sm text-muted-foreground">
                  {t("Total Loads", "कुल लोड")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-linear-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ₹
                  {avgRevenue.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("Avg. Revenue/Load", "औसत राजस्व/लोड")}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">₹{avgRPM.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">
                  {t("Avg. Rate per Mile", "प्रति मील औसत दर")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("Monthly Revenue", "मासिक राजस्व")}</CardTitle>
                <CardDescription>
                  {t(
                    "Revenue trend over selected period",
                    "चयनित अवधि का राजस्व प्रवृत्ति",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={revenueConfig}
                  className="min-h-50 w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={monthlyData}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(v) => [
                            `₹${Number(v).toLocaleString()}`,
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

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  {t("Monthly Load Count", "मासिक लोड गणना")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "Number of loads over selected period",
                    "चयनित अवधि में लोड की संख्या",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={loadsConfig}
                  className="min-h-50 w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={monthlyData}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      dataKey="count"
                      stroke="var(--color-count)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  {t("Load Status Distribution", "लोड स्थिति वितरण")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "Breakdown by current status",
                    "वर्तमान स्थिति के अनुसार विभाजन",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ChartContainer
                    config={statusConfig}
                    className="min-h-50 w-full max-w-75"
                  >
                    <PieChart>
                      <Tooltip
                        formatter={(value, name) => [value, String(name)]}
                      />
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="count"
                        nameKey="status"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {statusData.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <div
                        className="size-2.5 rounded-sm"
                        style={{ backgroundColor: s.fill }}
                      />
                      <span className="capitalize">
                        {getStatusLabel(s.status)}
                      </span>
                      <span className="font-medium text-foreground">
                        ({s.count})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("Top Routes", "शीर्ष मार्ग")}</CardTitle>
                <CardDescription>
                  {t("Highest revenue lane pairs", "उच्चतम राजस्व लेन जोड़े")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topRoutes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("No data yet", "अभी तक कोई डेटा नहीं")}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topRoutes.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">
                              {r.route}
                            </span>
                            <span className="text-sm font-semibold shrink-0">
                              ₹
                              {r.revenue.toLocaleString("en-US", {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${(r.revenue / topRoutes[0].revenue) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r.count} {t("load", "लोड")}
                            {r.count !== 1 ? t("s", "स") : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {t("Performance Summary", "प्रदर्शन सारांश")}
              </CardTitle>
              <CardDescription>
                {t("Key operational metrics", "मुख्य परिचालन मीट्रिक्स")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: t("Total Loads", "कुल लोड"), value: loads.length },
                  {
                    label: t("Delivered", "डिलीवर किए गए"),
                    value: deliveredLoads.length,
                  },
                  {
                    label: t("In Transit", "यातायात में"),
                    value: loads.filter((l) => l.status === "in_transit")
                      .length,
                  },
                  {
                    label: t("Pending", "लंबित"),
                    value: loads.filter((l) => l.status === "pending").length,
                  },
                  {
                    label: t("Problems", "समस्याएं"),
                    value: loads.filter((l) => l.status === "problem").length,
                  },
                  {
                    label: t("Total Miles", "कुल मील"),
                    value: totalMiles.toLocaleString(),
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border p-4 text-center">
                    <div className="text-xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
