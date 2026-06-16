import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle2, Clock, Phone } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchLoads, type BackendLoad } from "@/lib/trucker-api";
import { useEffect, useState } from "react";

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
  const x1 = 50;
  const y1 = 110;
  const x2 = 350;
  const y2 = 110;
  const cx = 200;
  const cy = 40;
  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const dashOffset = 100 - progress;

  return (
    <svg
      viewBox="0 0 400 160"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="routeGradC" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="shadowC" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#000"
            floodOpacity="0.2"
          />
        </filter>
      </defs>
      <rect width="400" height="160" fill="url(#routeGradC)" opacity="0.05" />

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
        stroke="url(#routeGradC)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="6 4"
        strokeDashoffset={dashOffset}
        className="transition-all duration-1000"
      />

      <circle cx={x1} cy={y1} r="12" fill="#10b981" filter="url(#shadowC)" />
      <text
        x={x1}
        y={y1 + 3}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "9px", fill: "white" }}
      >
        A
      </text>
      <circle cx={x2} cy={y2} r="12" fill="#6366f1" filter="url(#shadowC)" />
      <text
        x={x2}
        y={y2 + 3}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "9px", fill: "white" }}
      >
        B
      </text>

      <g
        transform={`translate(${x1 + (x2 - x1) * (progress / 100)}, ${y1 - (y1 - cy) * Math.sin((progress / 100) * Math.PI)})`}
      >
        <circle r="14" fill="#1e293b" filter="url(#shadowC)" />
        <text
          textAnchor="middle"
          dy="4"
          style={{ fontFamily: "system-ui", fontSize: "11px" }}
        >
          🚚
        </text>
      </g>

      <text
        x={x1}
        y={y1 + 30}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "10px", fill: "#475569" }}
      >
        {fromLabel}
      </text>
      <text
        x={x2}
        y={y2 + 30}
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "10px", fill: "#475569" }}
      >
        {toLabel}
      </text>
      <text
        x="200"
        y="150"
        textAnchor="middle"
        style={{ fontFamily: "system-ui", fontSize: "11px", fill: "#64748b" }}
      >
        {progress}% {completeLabel}
      </text>
    </svg>
  );
}

export default function TrackingPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<BackendLoad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLoads(session)
      .then((data) => {
        if (!cancelled) {
          setLoads(data);
          setSelectedLoad(data[0] || null);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const load = selectedLoad || {
    id: "LD-2024-001",
    origin_city: "Mumbai",
    origin_state: "Maharashtra",
    destination_city: "Delhi",
    destination_state: "Delhi",
    status: "in_transit",
    weight_lbs: 12000,
    commodity: "Electronics",
    miles: 650,
    rate: 2500,
    fuel_surcharge: 150,
    detention: 50,
    load_number: "LD-2024-001",
    created_at: "",
    updated_at: "",
  };

  const from = `${load.origin_city}, ${load.origin_state}`;
  const to = `${load.destination_city}, ${load.destination_state}`;
  const progress =
    load.status === "delivered"
      ? 100
      : load.status === "in_transit"
        ? 65
        : load.status === "dispatched"
          ? 20
          : 0;

  const timeline = [
    {
      status: t("Load Picked Up", "लोड पिक हुआ"),
      time: "Jun 10, 8:00 AM",
      location: load.origin_city,
      done: progress >= 20,
    },
    {
      status: t("In Transit", "यातायात में"),
      time: "Jun 10, 4:30 PM",
      location: `${load.origin_state} Toll`,
      done: progress >= 40,
    },
    {
      status: t("Approaching Destination", "गंतव्य के पास"),
      time: "Jun 11, 2:00 AM",
      location: `Near ${load.destination_city}`,
      done: progress >= 70,
    },
    {
      status: t("Delivery", "डिलीवरी"),
      time: "Jun 11, 3:00 PM",
      location: `${load.destination_city} Warehouse`,
      done: progress >= 100,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Live Tracking", "लाइव ट्रैकिंग")}
        </h1>
        <p className="text-muted-foreground">
          {t("Real-time shipment location", "रियल-टाइम शिपमेंट लोकेशन")}
        </p>
      </div>

      {loading && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("Loading tracking...", "ट्रैकिंग लोड हो रही है...")}
          </CardContent>
        </Card>
      )}

      {!loading && (
        <>
          {loads.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {loads.map((l) => (
                <Button
                  key={l.id}
                  size="sm"
                  variant={selectedLoad?.id === l.id ? "default" : "outline"}
                  className={
                    selectedLoad?.id === l.id
                      ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0"
                      : ""
                  }
                  onClick={() => setSelectedLoad(l)}
                >
                  {l.load_number}
                </Button>
              ))}
            </div>
          )}

          <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="gradient-text">
                    {t("Live Map", "लाइव मैप")}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {from} → {to}
                  </CardDescription>
                </div>
                <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0">
                  {t("65% of route completed", "रास्ते का 65% पूरा")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-linear-to-brrom-emerald-100 to-blue-100 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-xl overflow-hidden border border-border">
                <RouteMap
                  from={from}
                  to={to}
                  progress={progress}
                  completeLabel={t("Complete", "पूर्ण")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="gradient-text">
                  {t("Trucker Details", "ट्रकर विवरण")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-brrom-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    R
                  </div>
                  <div>
                    <p className="font-semibold">
                      {session.user?.firstName} {session.user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {session.user?.phoneNumber ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      {t("Vehicle", "वाहन")}:
                    </span>{" "}
                    <span className="font-medium text-primary">
                      MH 04 AB 1234
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="gradient-text">
                  {t("Journey Timeline", "यात्रा टाइमलाइन")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${event.done ? "bg-linear-to-br rom-emerald-500 to-teal-600" : "bg-muted border-2 border-muted-foreground/30"}`}
                      >
                        {event.done && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className={event.done ? "" : "opacity-50"}>
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time} · {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
