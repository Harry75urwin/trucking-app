import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Phone, Plus, Trash2, MapPin, Truck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchDrivers,
  fetchLoads,
  type BackendDriver,
} from "@/lib/trucker-api";
import {
  fetchLoadAssignments,
  createLoadAssignment,
  deleteLoadAssignment,
  type BackendLoadAssignment,
} from "@/lib/trucker-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaticData } from "@/lib/hooks/use-static-data";

export default function DriversPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drivers, setDrivers] = useState<BackendDriver[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningDriverId, setAssigningDriverId] = useState<string | null>(
    null
  );
  const [loads, setLoads] = useState<any[]>([]);
  const [selectedLoadId, setSelectedLoadId] = useState("");
  const [assignments, setAssignments] = useState<BackendLoadAssignment[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const { getOptions, getDisplay, statusColor } = useStaticData();

  const driverStatusOptions = getOptions("driver_status");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [driversData, loadsData] = await Promise.all([
        fetchDrivers(session),
        fetchLoads(session),
      ]);
      setDrivers(driversData);
      setLoads(loadsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, [session]);

  const loadAssignmentsData = async () => {
    try {
      const data = await fetchLoadAssignments(session);
      setAssignments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load assignments"
      );
    }
  };

  useEffect(() => {
    void loadAssignmentsData();
  }, [session]);

  const filtered = drivers.filter((d) => {
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch =
      !search ||
      `${d.first_name} ${d.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.cdl_number.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const startAssign = (driverId: string) => {
    setAssigningDriverId(driverId);
    setSelectedLoadId("");
  };

  const submitAssignment = async () => {
    if (!assigningDriverId || !selectedLoadId) return;
    setAssignLoading(true);
    try {
      await createLoadAssignment(session, {
        load_id: selectedLoadId,
        driver_id: assigningDriverId,
      });
      setAssigningDriverId(null);
      await loadAssignmentsData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign");
    }
    setAssignLoading(false);
  };

  const unassign = async (assignmentId: string) => {
    try {
      await deleteLoadAssignment(session, assignmentId);
      await loadAssignmentsData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unassign");
    }
  };

  const getDriverAssignments = (driverId: string) =>
    assignments.filter((a) => a.driver_id === driverId);

  const getStatusLabel = (status: string) => {
    const display = getDisplay("driver_status", status);
    return display || status.replace("_", " ");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("Driver Management", "ड्राइवर प्रबंधन")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Assign and manage drivers to loads",
              "लोड को असाइन करें और प्रबंधित करें"
            )}
          </p>
        </div>
        <Button className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
          <Plus className="w-4 h-4 mr-1" />
          {t("Add Driver", "ड्राइवर जोड़ें")}
        </Button>
      </div>

      {error && (
        <Card className="border-0 bg-rose-50 dark:bg-rose-950/20">
          <CardContent className="py-3 text-sm text-rose-600">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            placeholder={t("Search drivers...", "ड्राइवर खोजें...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...driverStatusOptions.map((o) => o.key)].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? "default" : "outline"}
              className={
                filter === s
                  ? "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
                  : ""
              }
              onClick={() => setFilter(s)}
            >
              {getStatusLabel(s)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              {t("No drivers found", "कोई ड्राइवर नहीं मिला")}
            </CardContent>
          </Card>
        )}
        {filtered.map((d) => {
          const driverAssignments = getDriverAssignments(d.id);
          const colors = statusColor(d.status);
          return (
            <Card
              key={d.id}
              className="border-0 bg-card/50 backdrop-blur-sm shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">
                          {d.first_name} {d.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.cdl_number}
                        </p>
                      </div>
                      <Badge className={colors.className}>
                        {getStatusLabel(d.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          {t("Email", "ईमेल")}
                        </p>
                        <p className="font-medium text-xs">{d.email}</p>
                      </div>
                      <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          {t("Phone", "फोन")}
                        </p>
                        <p className="font-medium text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3 text-primary" /> {d.phone}
                        </p>
                      </div>
                      {d.home_city && (
                        <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            {t("Home", "घर")}
                          </p>
                          <p className="font-medium text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />{" "}
                            {d.home_city} {d.home_state || ""}
                          </p>
                        </div>
                      )}
                    </div>

                    {driverAssignments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {t("Current Assignments", "वर्तमान असाइनमेंट")}:
                        </p>
                        {driverAssignments.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between p-2 bg-muted/20 rounded-lg text-xs"
                          >
                            <span className="flex items-center gap-1">
                              <Truck className="w-3 h-3" /> {a.load_id}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-rose-500"
                              onClick={() => void unassign(a.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-8 text-xs"
                        asChild
                      >
                        <Link to={`/company/drivers/${d.id}`}>
                          {t("View Details", "विवरण देखें")}
                        </Link>
                      </Button>
                      {assigningDriverId === d.id ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedLoadId}
                            onValueChange={setSelectedLoadId}
                          >
                            <SelectTrigger className="h-8 text-xs flex-1">
                              <SelectValue
                                placeholder={t(
                                  "Select a load...",
                                  "लोड चुनें..."
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {loads.map((l) => (
                                <SelectItem
                                  key={l.id}
                                  value={l.id}
                                  className="text-xs"
                                >
                                  {l.load_number} — {l.origin_city} →{" "}
                                  {l.destination_city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => void submitAssignment()}
                            disabled={!selectedLoadId || assignLoading}
                            className="h-8 text-xs bg-linear-to-r from-emerald-500 to-teal-600"
                          >
                            {assignLoading
                              ? t("Assigning...", "असाइन हो रहा है...")
                              : t("Assign", "असाइन करें")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setAssigningDriverId(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-8 text-xs"
                          onClick={() => startAssign(d.id)}
                        >
                          {t("Assign to Load", "लोड पर असाइन करें")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
