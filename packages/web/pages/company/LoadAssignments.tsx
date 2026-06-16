import { useEffect, useMemo, useState, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchLoadAssignments,
  createLoadAssignment,
  updateLoadAssignment,
  deleteLoadAssignment,
  fetchLoads,
  fetchDrivers,
  fetchVehicles,
  type BackendLoadAssignment,
  type BackendLoad,
  type BackendDriver,
  type BackendVehicle,
} from "@/lib/trucker-api";

const emptyForm = {
  load_id: "",
  driver_id: "",
  truck_id: "",
  trailer_id: "",
};

export default function LoadAssignmentsPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [assignments, setAssignments] = useState<BackendLoadAssignment[]>([]);
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [drivers, setDrivers] = useState<BackendDriver[]>([]);
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAssignment, setEditAssignment] =
    useState<BackendLoadAssignment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsData, loadsData, driversData, vehiclesData] =
        await Promise.all([
          fetchLoadAssignments(session),
          fetchLoads(session),
          fetchDrivers(session),
          fetchVehicles(session),
        ]);
      setAssignments(assignmentsData);
      setLoads(loadsData);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to load assignments", "असाइनमेंट लोड करने में विफल"),
      );
    }
    setLoading(false);
  }, [session, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const vehicleById = useMemo(() => {
    const map = new Map<string, BackendVehicle>();
    for (const v of vehicles) map.set(v.id, v);
    return map;
  }, [vehicles]);

  const driverById = useMemo(() => {
    const map = new Map<string, BackendDriver>();
    for (const d of drivers) map.set(d.id, d);
    return map;
  }, [drivers]);

  const loadById = useMemo(() => {
    const map = new Map<string, BackendLoad>();
    for (const l of loads) map.set(l.id, l);
    return map;
  }, [loads]);

  function openCreate() {
    setEditAssignment(null);
    setForm({ ...emptyForm });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(a: BackendLoadAssignment) {
    setEditAssignment(a);
    setForm({
      load_id: a.load_id,
      driver_id: a.driver_id ?? "",
      truck_id: a.truck_id ?? "",
      trailer_id: a.trailer_id ?? "",
    });
    setErrors({});
    setDialogOpen(true);
  }

  function updateSelect(name: string, value: string) {
    setErrors((p) => {
      const next = { ...p };
      delete next[name];
      return next;
    });
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.load_id) {
      errs.load_id = t("Load is required", "लोड आवश्यक है");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!validate()) {
        setSaving(false);
        return;
      }
      const payload = {
        load_id: form.load_id,
        driver_id: form.driver_id || undefined,
        truck_id: form.truck_id || undefined,
        trailer_id: form.trailer_id || undefined,
      };
      if (editAssignment) {
        await updateLoadAssignment(session, editAssignment.id, payload);
        setSuccess(t("Assignment updated", "असाइनमेंट अपडेट हुआ"));
      } else {
        await createLoadAssignment(session, payload);
        setSuccess(t("Assignment created", "असाइनमेंट बनाया गया"));
      }
      setDialogOpen(false);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to save assignment", "असाइनमेंट सहेजने में विफल"),
      );
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("Delete this assignment?", "इस असाइनमेंट को हटाएं?")))
      return;
    try {
      await deleteLoadAssignment(session, id);
      setSuccess(t("Assignment deleted", "असाइनमेंट हटाया गया"));
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to delete assignment", "असाइनमेंट हटाने में विफल"),
      );
    }
  }

  const trucksAndTrailers = useMemo(() => {
    const options: { id: string; label: string; type: "truck" | "trailer" }[] =
      [];
    for (const v of vehicles) {
      if (v.type === "truck" || v.type === "trailer") {
        options.push({
          id: v.id,
          label: `${v.unit_number} — ${v.year} ${v.make} ${v.model}`,
          type: v.type === "truck" ? "truck" : "trailer",
        });
      }
    }
    return options;
  }, [vehicles]);

  const trucks = useMemo(
    () => trucksAndTrailers.filter((v) => v.type === "truck"),
    [trucksAndTrailers],
  );
  const trailers = useMemo(
    () => trucksAndTrailers.filter((v) => v.type === "trailer"),
    [trucksAndTrailers],
  );

  const assignmentLabel = (a: BackendLoadAssignment) => {
    const load = loadById.get(a.load_id);
    const driver = a.driver_id ? driverById.get(a.driver_id) : null;
    const truck = a.truck_id ? vehicleById.get(a.truck_id) : null;
    const trailer = a.trailer_id ? vehicleById.get(a.trailer_id) : null;
    return {
      loadNumber: load?.load_number || a.load_id,
      route: load ? `${load.origin_city} → ${load.destination_city}` : "",
      driver: driver
        ? `${driver.first_name} ${driver.last_name}`
        : t("Unassigned", "अनअसाइन्ड"),
      truck: truck ? `${truck.unit_number}` : t("Unassigned", "अनअसाइन्ड"),
      trailer: trailer
        ? `${trailer.unit_number}`
        : t("Unassigned", "अनअसाइन्ड"),
    };
  };

  const columns = useMemo<ColumnDef<BackendLoadAssignment>[]>(
    () => [
      {
        header: t("Load", "लोड"),
        cell: ({ row }) => {
          const info = assignmentLabel(row.original);
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <span className="text-xs font-semibold">
                  {info.loadNumber?.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium">{info.loadNumber}</p>
                {info.route && (
                  <p className="text-xs text-muted-foreground">{info.route}</p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "driver_id",
        header: t("Driver", "ड्राइवर"),
        cell: ({ row }) => {
          const info = assignmentLabel(row.original);
          return <span className="text-sm">{info.driver}</span>;
        },
      },
      {
        accessorKey: "truck_id",
        header: t("Truck", "ट्रक"),
        cell: ({ row }) => {
          const info = assignmentLabel(row.original);
          return <span className="text-sm">{info.truck}</span>;
        },
      },
      {
        accessorKey: "trailer_id",
        header: t("Trailer", "ट्रेलर"),
        cell: ({ row }) => {
          const info = assignmentLabel(row.original);
          return <span className="text-sm">{info.trailer}</span>;
        },
      },
      {
        accessorKey: "updated_at",
        header: t("Updated", "अपडेट"),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.updated_at
              ? new Date(row.original.updated_at).toLocaleString()
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Plus className="size-4 rotate-45" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions", "कार्रवाई")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEdit(row.original)}>
                <Pencil className="size-4 mr-2" /> {t("Edit", "संपादित करें")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="size-4 mr-2" /> {t("Delete", "हटाएं")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t, loadById, driverById, vehicleById, assignmentLabel],
  );

  const filtered = useMemo(
    () =>
      assignments.filter((a) => {
        const info = assignmentLabel(a);
        const term = globalFilter.toLowerCase();
        return (
          !term ||
          info.loadNumber.toLowerCase().includes(term) ||
          info.route.toLowerCase().includes(term) ||
          info.driver.toLowerCase().includes(term) ||
          info.truck.toLowerCase().includes(term) ||
          info.trailer.toLowerCase().includes(term)
        );
      }),
    [assignments, globalFilter, assignmentLabel],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Load Assignments", "लोड असाइनमेंट")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Assign drivers and vehicles to loads",
              "लोड को ड्राइवर और वाहनों में असाइन करें",
            )}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-1" />{" "}
          {t("New Assignment", "नया असाइनमेंट")}
        </Button>
      </div>

      {error && (
        <Card className="border-0 bg-rose-50 dark:bg-rose-950/20">
          <CardContent className="py-3 text-sm text-rose-600">
            {error}
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-0 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="py-3 text-sm text-emerald-600">
            {success}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Assignments", "असाइनमेंट")}
              </CardTitle>
              <CardDescription>
                {assignments.length} {t("assignments", "असाइनमेंट")}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search assignments...", "असाइनमेंट खोजें...")}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              {t("Loading assignments...", "असाइनमेंट लोड हो रहे हैं...")}
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {t(
                            "No assignments found.",
                            "कोई असाइनमेंट नहीं मिला।",
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {t("Previous", "पिछला")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {t("Next", "अगला")}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editAssignment
                ? t("Edit Assignment", "असाइनमेंट संपादित करें")
                : t("New Assignment", "नया असाइनमेंट")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>
                {t("Load", "लोड")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.load_id}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, load_id: v }));
                  setErrors((p) => {
                    const next = { ...p };
                    delete next.load_id;
                    return next;
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a load...", "लोड चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {loads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.load_number} — {l.origin_city} → {l.destination_city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.load_id && (
                <p className="text-xs text-destructive">{errors.load_id}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{t("Driver", "ड्राइवर")}</Label>
              <Select
                value={form.driver_id}
                onValueChange={(v) => updateSelect("driver_id", v)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a driver...", "ड्राइवर चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("None", "कोई नहीं")}</SelectItem>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.first_name} {d.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Truck", "ट्रक")}</Label>
              <Select
                value={form.truck_id}
                onValueChange={(v) => updateSelect("truck_id", v)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a truck...", "ट्रक चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("None", "कोई नहीं")}</SelectItem>
                  {trucks.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Trailer", "ट्रेलर")}</Label>
              <Select
                value={form.trailer_id}
                onValueChange={(v) => updateSelect("trailer_id", v)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a trailer...", "ट्रेलर चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("None", "कोई नहीं")}</SelectItem>
                  {trailers.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("Cancel", "रद्द करें")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? t("Saving...", "सहेज रहे हैं...")
                : editAssignment
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Create Assignment", "असाइनमेंट बनाएं")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
