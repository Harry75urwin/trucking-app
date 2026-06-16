import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Wrench, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchVehicles, type BackendVehicle } from "@/lib/trucker-api";

export default function MyVehicles() {
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
    status === "active" ? t("Active", "सक्रिय") : t("Maintenance", "रखरखाव");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("My Vehicles", "मेरे वाहन")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage your fleet", "अपना बेड़ा प्रबंधित करें")}
          </p>
        </div>
        <Button
          className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          asChild
        >
          <Link to="/trucker/vehicles/new">
            <Plus className="w-4 h-4 mr-1" />
            {t("Add Vehicle", "वाहन जोड़ें")}
          </Link>
        </Button>
      </div>
      {loading && (
        <p className="text-sm text-muted-foreground">
          {t("Loading vehicles...", "वाहन लोड हो रहे हैं...")}
        </p>
      )}
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <div className="space-y-4">
        {vehicles.map((v) => (
          <Card
            key={v.id}
            className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{v.unit_number}</h3>
                      <Badge
                        className={
                          v.status === "active"
                            ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0"
                            : "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0"
                        }
                      >
                        {v.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                            {label(v.status)}
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3 h-3 mr-1" />{" "}
                            {label(v.status)}
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {v.make} {v.model} · {v.type} · {v.year}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          {t("License", "लाइसेंस")}
                        </p>
                        <p className="font-medium">{v.license_plate}</p>
                      </div>
                      <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          {t("Mileage", "मैल की जानकारी")}
                        </p>
                        <p className="font-medium">
                          {v.mileage.toLocaleString()} mi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-muted"
                    asChild
                  >
                    <Link to={`/trucker/vehicles/${v.id}/edit`}>
                      {t("Edit", "संपादित करें")}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
