import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  User,
  Truck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadStatusBadge } from "@/components/status-badges";
import {
  supabase,
  type Load,
  type Driver,
  type Vehicle,
  type LoadAssignment,
} from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";

type LoadWithAssignment = Load & {
  customers?: { name: string };
  load_assignments?: Array<
    LoadAssignment & {
      drivers?: Driver;
      trucks?: Vehicle;
      trailers?: Vehicle;
    }
  >;
};

export default function Dispatch() {
  const { t } = useLanguage();
  const [loads, setLoads] = useState<LoadWithAssignment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<Vehicle[]>([]);
  const [trailers, setTrailers] = useState<Vehicle[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<
    Record<string, { driver_id: string; truck_id: string; trailer_id: string }>
  >({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [{ data: loadsData }, { data: driversData }, { data: vehiclesData }] =
      await Promise.all([
        supabase
          .from("loads")
          .select(
            "*, customers(name), load_assignments(*, drivers(*), trucks:vehicles!load_assignments_truck_id_fkey(*), trailers:vehicles!load_assignments_trailer_id_fkey(*))"
          )
          .in("status", ["pending", "dispatched", "in_transit", "problem"])
          .order("pickup_date", { ascending: true }),
        supabase.from("drivers").select("*").in("status", ["available"]),
        supabase.from("vehicles").select("*").eq("status", "active"),
      ]);
    if (loadsData) setLoads(loadsData as LoadWithAssignment[]);
    if (driversData) setDrivers(driversData);
    if (vehiclesData) {
      setTrucks(vehiclesData.filter((v: Vehicle) => v.type === "truck"));
      setTrailers(vehiclesData.filter((v: Vehicle) => v.type === "trailer"));
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function getAssignment(load: LoadWithAssignment) {
    return load.load_assignments?.[0];
  }

  async function handleAssign(loadId: string) {
    const a = assignments[loadId];
    if (!a?.driver_id) return;
    setSaving(loadId);

    const existing = loads.find((l) => l.id === loadId)?.load_assignments?.[0];

    if (existing) {
      await supabase
        .from("load_assignments")
        .update({
          driver_id: a.driver_id || null,
          truck_id: a.truck_id || null,
          trailer_id: a.trailer_id || null,
        })
        .eq("load_id", loadId);
    } else {
      await supabase.from("load_assignments").insert({
        load_id: loadId,
        driver_id: a.driver_id || null,
        truck_id: a.truck_id || null,
        trailer_id: a.trailer_id || null,
      });
    }

    await supabase
      .from("loads")
      .update({ status: "dispatched", updated_at: new Date().toISOString() })
      .eq("id", loadId)
      .eq("status", "pending");

    setSaving(null);
    setAssigning(null);
    void fetchData();
  }

  const pendingLoads = loads.filter((l) => l.status === "pending");
  const activeLoads = loads.filter((l) =>
    ["dispatched", "in_transit"].includes(l.status)
  );
  const problemLoads = loads.filter((l) => l.status === "problem");

  function LoadCard({
    load,
    showAssign = false,
  }: {
    load: LoadWithAssignment;
    showAssign?: boolean;
  }) {
    const assignment = getAssignment(load);
    const isAssigning = assigning === load.id;
    const a = assignments[load.id] ?? {
      driver_id: "",
      truck_id: "",
      trailer_id: "",
    };

    return (
      <Card
        key={load.id}
        className={`${load.status === "problem" ? "border-red-200 dark:border-red-900" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {load.load_number}
                </span>
                <LoadStatusBadge status={load.status} />
              </div>
              <CardTitle className="text-sm mt-1">
                {load.origin_city}, {load.origin_state}
                <ArrowRight className="inline size-3 mx-1" />
                {load.destination_city}, {load.destination_state}
              </CardTitle>
              {load.customers?.name && (
                <CardDescription className="mt-0.5">
                  {load.customers.name}
                </CardDescription>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold">
                ${load.rate.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{load.miles} mi</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span>
              <Package className="inline size-3 mr-1" />
              {load.commodity}
            </span>
            <span>{load.weight_lbs?.toLocaleString()} lbs</span>
            {load.pickup_date && (
              <span>
                {t("Pickup:", "पिकअप:")}{" "}
                {new Date(load.pickup_date).toLocaleDateString()}
              </span>
            )}
            {load.delivery_date && (
              <span>
                {t("Delivery:", "डिलीवरी:")}{" "}
                {new Date(load.delivery_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {assignment && !isAssigning && (
            <div className="rounded-md bg-muted/50 px-3 py-2 text-xs flex flex-col gap-1">
              {assignment.drivers && (
                <span className="flex items-center gap-1.5">
                  <User className="size-3 text-muted-foreground" />
                  {assignment.drivers.first_name} {assignment.drivers.last_name}
                </span>
              )}
              {assignment.trucks && (
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3 text-muted-foreground" />
                  {assignment.trucks.unit_number} — {assignment.trucks.year}{" "}
                  {assignment.trucks.make}
                </span>
              )}
            </div>
          )}

          {load.notes && (
            <p className="text-xs text-muted-foreground italic">{load.notes}</p>
          )}

          {showAssign && (
            <>
              {!isAssigning ? (
                <Button
                  size="sm"
                  variant={assignment ? "outline" : "default"}
                  onClick={() => {
                    setAssigning(load.id);
                    setAssignments((p) => ({
                      ...p,
                      [load.id]: {
                        driver_id: assignment?.driver_id ?? "",
                        truck_id: assignment?.truck_id ?? "",
                        trailer_id: assignment?.trailer_id ?? "",
                      },
                    }));
                  }}
                >
                  {assignment
                    ? t("Reassign", "पुनः असाइन करें")
                    : t("Assign & Dispatch", "असाइन करें और भेजें")}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Select
                    value={a.driver_id}
                    onValueChange={(v) =>
                      setAssignments((p) => ({
                        ...p,
                        [load.id]: { ...a, driver_id: v },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue
                        placeholder={t("Select driver", "ड्राइवर चुनें")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id} className="text-xs">
                          {d.first_name} {d.last_name} — {d.home_city},{" "}
                          {d.home_state}
                        </SelectItem>
                      ))}
                      {drivers.length === 0 && (
                        <SelectItem value="" disabled>
                          {t("No available drivers", "कोई ड्राइवर उपलब्ध नहीं")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    value={a.truck_id}
                    onValueChange={(v) =>
                      setAssignments((p) => ({
                        ...p,
                        [load.id]: { ...a, truck_id: v },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue
                        placeholder={t("Select truck", "ट्रक चुनें")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          {t.unit_number} — {t.year} {t.make} {t.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={a.trailer_id}
                    onValueChange={(v) =>
                      setAssignments((p) => ({
                        ...p,
                        [load.id]: { ...a, trailer_id: v },
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue
                        placeholder={t(
                          "Select trailer (optional)",
                          "ट्रेलर चुनें (वैकल्पिक)"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {t("No trailer", "कोई ट्रेलर नहीं")}
                      </SelectItem>
                      {trailers.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          {t.unit_number} — {t.make} {t.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => void handleAssign(load.id)}
                      disabled={!a.driver_id || saving === load.id}
                    >
                      <CheckCircle2 className="size-3" />
                      {saving === load.id
                        ? t("Saving...", "सहेज रहे हैं...")
                        : t("Confirm", "पुष्टि करें")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAssigning(null)}
                    >
                      {t("Cancel", "रद्द करें")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Dispatch Board", "डिस्पैच बोर्ड")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Assign drivers and trucks to loads",
              "ड्राइवरों और ट्रक को लोड में असाइन करें"
            )}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/loads">
            <Package className="size-4" />{" "}
            {t("Manage Loads", "लोड प्रबंधित करें")}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingLoads.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Pending Dispatch", "लंबित डिस्पैच")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {activeLoads.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Active Loads", "सक्रिय लोड")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {problemLoads.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Problems", "समस्याएं")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-yellow-500" />
            <h2 className="font-semibold text-sm">
              {t("Pending", "लंबित")} ({pendingLoads.length})
            </h2>
          </div>
          {pendingLoads.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t("No loads pending dispatch", "डिस्पैच के लिए कोई लोड नहीं")}
            </div>
          ) : (
            pendingLoads.map((load) => (
              <LoadCard key={load.id} load={load} showAssign />
            ))
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-500" />
            <h2 className="font-semibold text-sm">
              {t("Active", "सक्रिय")} ({activeLoads.length})
            </h2>
          </div>
          {activeLoads.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t("No active loads", "कोई सक्रिय लोड नहीं")}
            </div>
          ) : (
            activeLoads.map((load) => (
              <LoadCard key={load.id} load={load} showAssign />
            ))
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 text-red-500" />
            <h2 className="font-semibold text-sm">
              {t("Needs Attention", "ध्यान की आवश्यकता है")} (
              {problemLoads.length})
            </h2>
          </div>
          {problemLoads.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t("No issues", "कोई समस्या नहीं")}
            </div>
          ) : (
            problemLoads.map((load) => (
              <LoadCard key={load.id} load={load} showAssign />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
