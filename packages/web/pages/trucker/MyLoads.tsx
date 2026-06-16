import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchLoads, type BackendLoad } from "@/lib/trucker-api";

export default function MyLoadsTrucker() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const filtered = loads.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesStatus = filter === "all" || l.status === filter;
    const matchesSearch =
      !q ||
      l.id.toLowerCase().includes(q) ||
      l.origin_city.toLowerCase().includes(q) ||
      l.destination_city.toLowerCase().includes(q) ||
      l.commodity.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const toAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("My Loads", "मेरे लोड")}
        </h1>
        <p className="text-muted-foreground">
          {t("All loads assigned to you", "आपको सौंपे गए सभी लोड")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            placeholder={t("Search...", "खोजें...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {[
          "all",
          "in_transit",
          "delivered",
          "dispatched",
          "pending",
          "problem",
        ].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            className={
              filter === status
                ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                : ""
            }
            onClick={() => setFilter(status)}
          >
            {status === "all" ? t("All", "सभी") : status.replace("_", " ")}
          </Button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          {t("Loading loads...", "लोड लोड हो रहे हैं...")}
        </p>
      )}
      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="space-y-4">
        {filtered.map((load) => {
          const progressMap: Record<string, number> = {
            pending: 0,
            dispatched: 20,
            in_transit: 65,
            delivered: 100,
            problem: 45,
          };
          const progress = progressMap[load.status] ?? 0;

          return (
            <Card
              key={load.id}
              className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{load.load_number}</span>
                      <Badge
                        className={
                          load.status === "in_transit"
                            ? "bg-linear-to-r from-blue-500 to-indigo-600 border-0"
                            : load.status === "delivered"
                              ? "bg-linear-to-r from-emerald-500 to-teal-600 border-0"
                              : "bg-linear-to-r from-amber-500 to-orange-600 border-0"
                        }
                      >
                        {load.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {load.origin_city} → {load.destination_city} ·{" "}
                      {load.weight_lbs} lbs
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("Commodity", "माल")}: {load.commodity} ·{" "}
                      {new Date(
                        load.pickup_date || load.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {toAmount(load.rate + load.fuel_surcharge + load.detention)}
                  </p>
                </div>

                {["dispatched", "in_transit"].includes(load.status) && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t("Progress", "प्रगति")}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-indigo-500 to-purple-600 h-2 rounded-full shadow-sm"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-muted"
                        asChild
                      >
                        <Link to={`/trucker/tracking/${load.id}`}>
                          {t("Update Location", "लोकेशन अपडेट करें")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md"
                        asChild
                      >
                        <Link to={`/trucker/load/${load.id}`}>
                          {t("View Details", "विवरण देखें")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
