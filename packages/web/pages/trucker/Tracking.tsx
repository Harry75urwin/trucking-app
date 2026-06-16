import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Truck,
  Phone,
  Package,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchLoad, type BackendLoad } from "@/lib/trucker-api";

function RouteMap({
  from,
  to,
  progress,
  completeLabel,
}: {
  from: string;
  to: string;
  progress: number;
  completeLabel: string;
}) {
  const fromLabel = from.split(",")[0].trim();
  const toLabel = to.split(",")[0].trim();
  const x1 = 60;
  const y1 = 130;
  const x2 = 340;
  const y2 = 130;
  const cx = 200;
  const cy = 50;
  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const dashOffset = 100 - progress;

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#000"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <rect width="400" height="200" fill="url(#routeGrad)" opacity="0.05" />

      <path
        d={pathD}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke="url(#routeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="6 4"
        strokeDashoffset={dashOffset}
        className="transition-all duration-1000"
      />

      <circle cx={x1} cy={y1} r="14" fill="#10b981" filter="url(#shadow)" />
      <text
        x={x1}
        y={y1 + 4}
        textAnchor="middle"
        className="text-[10px] fill-white font-bold"
        style={{ fontFamily: "system-ui" }}
      >
        A
      </text>

      <circle cx={x2} cy={y2} r="14" fill="#6366f1" filter="url(#shadow)" />
      <text
        x={x2}
        y={y2 + 4}
        textAnchor="middle"
        className="text-[10px] fill-white font-bold"
        style={{ fontFamily: "system-ui" }}
      >
        B
      </text>

      <g
        transform={`translate(${x1 + (x2 - x1) * (progress / 100)}, ${y1 - (y1 - cy) * Math.sin((progress / 100) * Math.PI)})`}
      >
        <circle r="16" fill="#1e293b" filter="url(#shadow)" />
        <text
          textAnchor="middle"
          dy="4"
          style={{ fontFamily: "system-ui" }}
          fontSize="12"
        >
          🚚
        </text>
      </g>

      <text
        x={x1}
        y={y1 + 34}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "10px", fill: "#475569" }}
      >
        {fromLabel}
      </text>
      <text
        x={x2}
        y={y2 + 34}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "10px", fill: "#475569" }}
      >
        {toLabel}
      </text>

      <text
        x="200"
        y="190"
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "11px", fill: "#64748b" }}
      >
        {progress}% {completeLabel}
      </text>
    </svg>
  );
}

const waypoints = [
  { name: "Origin", status: "completed", time: "Pickup" },
  { name: "In Transit", status: "completed", time: "En route" },
  { name: "Current", status: "current", time: "Now" },
  { name: "Destination", status: "upcoming", time: "Expected" },
];

export default function TruckerTrackingPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [load, setLoad] = useState<BackendLoad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id || !session.isAuthenticated) return;

    setLoading(true);
    setError(null);

    fetchLoad(session, id)
      .then((loadData) => {
        if (!cancelled) {
          setLoad(loadData);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load tracking"
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, session]);

  const progress = load
    ? load.status === "delivered"
      ? 100
      : load.status === "in_transit"
        ? 65
        : load.status === "dispatched"
          ? 20
          : 0
    : 0;
  const from = load
    ? `${load.origin_city}, ${load.origin_state}`
    : t("Loading...", "लोड हो रहा है...");
  const to = load
    ? `${load.destination_city}, ${load.destination_state}`
    : t("Loading...", "लोड हो रहा है...");
  const displayWaypoints = useMemo(() => {
    if (!load) return waypoints;
    if (load.status === "delivered") {
      return [
        { name: from, status: "completed", time: load.pickup_date || "" },
        { name: to, status: "completed", time: load.delivery_date || "" },
      ];
    }
    if (load.status === "in_transit" || load.status === "dispatched") {
      return [
        { name: from, status: "completed", time: load.pickup_date || "" },
        {
          name: t("In Transit", "यातायात में"),
          status: "current",
          time: t("Now", "अभी"),
        },
        {
          name: to,
          status: "upcoming",
          time: load.delivery_date || t("Expected", "अपेक्षित"),
        },
      ];
    }
    return waypoints;
  }, [load, from, to]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/trucker/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {t("Live Tracking", "लाइव ट्रैकिंग")}
          </h1>
          <p className="text-muted-foreground">
            {load?.load_number ?? id} ·{" "}
            {t("Track your shipment", "अपनी शिपमेंट ट्रैक करें")}
          </p>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {t("Loading tracking data...", "ट्रैकिंग डेटा लोड हो रहा है...")}
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

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary" />
                      {t("Route Map", "रास्ता मानचित्र")}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {from} → {to}
                    </CardDescription>
                  </div>
                  <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0">
                    {progress}% {t("Complete", "पूर्ण")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-125 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden border border-border">
                  <RouteMap
                    from={from}
                    to={to}
                    progress={progress}
                    completeLabel={t("Complete", "पूर्ण")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />{" "}
                  {t("Journey Timeline", "यात्रा टाइमलाइन")}
                </CardTitle>
                <CardDescription>
                  {t("Checkpoints along the route", "मार्ग पर चेकपॉइंट")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  <div className="relative">
                    <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-emerald-500 via-indigo-500 to-slate-200 dark:to-slate-700" />
                    {displayWaypoints.map((wp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 pb-6 last:pb-0"
                      >
                        <div
                          className={`relative mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            wp.status === "completed"
                              ? "bg-emerald-500"
                              : wp.status === "current"
                                ? "bg-indigo-500 animate-pulse"
                                : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        >
                          {wp.status === "completed" && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                          {wp.status === "current" && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 flex items-start justify-between">
                          <div>
                            <p
                              className={`text-sm font-medium ${wp.status === "upcoming" ? "text-muted-foreground" : ""}`}
                            >
                              {wp.name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {wp.time}
                            </p>
                          </div>
                          {wp.status === "current" && (
                            <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0 text-xs">
                              {t("Current", "वर्तमान")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t("Current Status", "वर्तमान स्थिति")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("Progress", "प्रगति")}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-white/60 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sm text-muted-foreground">
                    {t("Status", "स्थिति")}
                  </span>
                  <span className="font-semibold">
                    {load?.status?.toUpperCase?.() ?? "-"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("Load Details", "लोड विवरण")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <p className="text-xs text-muted-foreground">
                    {t("From", "से")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {from}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <p className="text-xs text-muted-foreground">
                    {t("To", "तक")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    {to}
                  </p>
                </div>
                {load && (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        {t("Weight", "वजन")}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {load.weight_lbs.toLocaleString()} lbs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("Goods", "माल")}
                      </span>
                      <span className="font-medium">{load.commodity}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("Driver Info", "ड्राइवर जानकारी")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    {session.user?.firstName?.charAt(0) ?? "U"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {session.user?.firstName} {session.user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />{" "}
                      {session.user?.phoneNumber ?? "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
