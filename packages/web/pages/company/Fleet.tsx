import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, CheckCircle2, Wrench, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchVehicles, type BackendVehicle } from "@/lib/trucker-api";

const statusIcon = {
  active: <CheckCircle2 className="w-3 h-3 mr-1" />,
  idle: <AlertCircle className="w-3 h-3 mr-1" />,
  maintenance: <Wrench className="w-3 h-3 mr-1" />,
  inactive: <AlertCircle className="w-3 h-3 mr-1" />,
};

const statusColor = {
  active: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  idle: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  maintenance:
    "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
  inactive: "bg-muted text-foreground",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  idle: "Idle",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export default function FleetPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchVehicles(session)
      .then((data) => {
        if (!cancelled) setVehicles(data);
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

  const label = (status: BackendVehicle["status"]) =>
    statusLabel[status] ? t(statusLabel[status], statusLabel[status]) : status;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("Fleet Management", "बेड़ा प्रबंधन")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "All vehicles in your company fleet",
              "आपकी कंपनी के बेड़े में सभी वाहन"
            )}
          </p>
        </div>
        <Button className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
          <Plus className="w-4 h-4 mr-1" />
          {t("Add Vehicle", "वाहन जोड़ें")}
        </Button>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          {t("Loading vehicles...", "वाहन लोड हो रहे हैं...")}
        </p>
      )}
      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && !error && vehicles.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              {t("No vehicles found", "कोई वाहन नहीं मिला")}
            </CardContent>
          </Card>
        )}

        {vehicles.map((v) => (
          <Card
            key={v.id}
            className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            {v.imageUrls?.[0] && (
              <img
                src={v.imageUrls[0]}
                alt={v.unit_number}
                className="h-40 w-full object-cover bg-muted"
              />
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-purple-500 to-violet-600 rounded-lg shadow-md">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{v.unit_number}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {v.make} {v.model} · {v.type} · {v.year}
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusColor[v.status as keyof typeof statusColor]}
                >
                  {statusIcon[v.status as keyof typeof statusIcon]}
                  {label(v.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("License Plate", "लाइसेंस प्लेट")}
                  </p>
                  <p className="font-medium">{v.license_plate}</p>
                </div>
                <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Mileage", "माइलेज")}
                  </p>
                  <p className="font-medium">{v.mileage.toLocaleString()} mi</p>
                </div>
                <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Next Service", "अगली सेवा")}
                  </p>
                  <p className="font-medium">
                    {v.next_service_miles.toLocaleString()} mi
                  </p>
                </div>
                <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Updated", "अपडेट किया गया")}
                  </p>
                  <p className="font-medium">
                    {new Date(v.updated_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:bg-muted"
                asChild
              >
                <Link to={`/company/fleet/${v.id}`}>
                  {t("View Details", "विवरण देखें")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
