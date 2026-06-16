import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Truck,
  Calendar,
  Phone,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  fetchDispatches,
  createDispatch,
  updateDispatch,
  deleteDispatch,
  fetchLoads,
  fetchDrivers,
  fetchVehicles,
  type BackendDispatch,
  type BackendLoad,
  type BackendDriver,
  type BackendVehicle,
} from "@/lib/trucker-api";

const emptyForm = {
  loadId: "",
  driverId: "",
  vehicleId: "",
  scheduledAt: "",
  dispatchedAt: "",
  status: "planned",
  notes: "",
};

const statusColor: Record<string, string> = {
  planned: "bg-linear-to-r from-slate-500 to-gray-600 text-white border-0",
  dispatched: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  in_progress:
    "bg-linear-to-r from-purple-500 to-indigo-600 text-white border-0",
  completed: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  cancelled: "bg-linear-to-r from-rose-500 to-red-600 text-white border-0",
};

const statusLabel: Record<string, string> = {
  planned: "Planned",
  dispatched: "Dispatched",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function DispatchPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [dispatches, setDispatches] = useState<BackendDispatch[]>([]);
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [drivers, setDrivers] = useState<BackendDriver[]>([]);
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDispatch, setEditDispatch] = useState<BackendDispatch | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dispatchesData, loadsData, driversData, vehiclesData] =
        await Promise.all([
          fetchDispatches(session),
          fetchLoads(session),
          fetchDrivers(session),
          fetchVehicles(session),
        ]);
      setDispatches(dispatchesData);
      setLoads(loadsData);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to load dispatches", "डिस्पैच लोड करने में विफल"),
      );
    }
    setLoading(false);
  }, [session, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openCreate() {
    setEditDispatch(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(d: BackendDispatch) {
    setEditDispatch(d);
    setForm({
      loadId: d.loadId,
      driverId: d.driverId,
      vehicleId: d.vehicleId,
      scheduledAt: d.scheduledAt ?? "",
      dispatchedAt: d.dispatchedAt ?? "",
      status: d.status ?? "planned",
      notes: d.notes ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (editDispatch) {
        await updateDispatch(session, editDispatch.id, form);
        setSuccess(
          t(
            "Dispatch updated successfully",
            "डिस्पैच सफलतापूर्वक अपडेट किया गया",
          ),
        );
      } else {
        await createDispatch(session, {
          ...form,
          dispatchedAt: form.dispatchedAt || undefined,
        });
        setSuccess(
          t("Dispatch created successfully", "डिस्पैच सफलतापूर्वक बनाया गया"),
        );
      }
      setDialogOpen(false);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to save dispatch", "डिस्पैच सहेजने में विफल"),
      );
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("Delete this dispatch?", "इस डिस्पैच को हटाएं?"))) return;
    try {
      await deleteDispatch(session, id);
      setSuccess(
        t("Dispatch deleted successfully", "डिस्पैच सफलतापूर्वक हटाया गया"),
      );
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to delete dispatch", "डिस्पैच हटाने में विफल"),
      );
    }
  }

  const filtered = dispatches.filter((d) => {
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesDate =
      !dateFilter || (d.scheduledAt && d.scheduledAt.startsWith(dateFilter));
    const matchesSearch =
      !globalFilter ||
      d.loadId.toLowerCase().includes(globalFilter.toLowerCase()) ||
      d.driverId.toLowerCase().includes(globalFilter.toLowerCase()) ||
      d.vehicleId.toLowerCase().includes(globalFilter.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  const columns: ColumnDef<BackendDispatch>[] = [
    {
      accessorKey: "loadId",
      header: t("Load", "लोड"),
      cell: ({ row }) => {
        const load = loads.find((l) => l.id === row.original.loadId);
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <Truck className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                {load?.load_number || row.original.loadId}
              </p>
              <p className="text-xs text-muted-foreground">
                {load ? `${load.origin_city} → ${load.destination_city}` : ""}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "driver",
      header: t("Driver", "ड्राइवर"),
      cell: ({ row }) => {
        const driver = drivers.find((d) => d.id === row.original.driverId);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">
              {driver
                ? `${driver.first_name} ${driver.last_name}`
                : row.original.driverId}
            </span>
            {driver?.phone && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="size-3" /> {driver.phone}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "vehicle",
      header: t("Vehicle", "वाहन"),
      cell: ({ row }) => {
        const vehicle = vehicles.find((v) => v.id === row.original.vehicleId);
        return (
          <span className="text-sm">
            {vehicle
              ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
              : row.original.vehicleId}
          </span>
        );
      },
    },
    {
      id: "scheduled",
      header: t("Scheduled", "निर्धारित"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.scheduledAt
            ? new Date(row.original.scheduledAt).toLocaleString()
            : "-"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("Status", "स्थिति"),
      cell: ({ row }) => (
        <Badge className={statusColor[row.original.status || "planned"]}>
          {statusLabel[row.original.status || "planned"]}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(row.original)}>
              <Pencil className="size-4" /> {t("Edit", "संपादित करें")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="size-4" /> {t("Delete", "हटाएं")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
            {t("Dispatch Management", "डिस्पैच प्रबंधन")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Assign drivers to vehicles and manage dispatch schedules",
              "ड्राइवर को वाहनों पर असाइन करें और डिस्पैच शेड्यूल प्रबंधित करें",
            )}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Dispatch", "डिस्पैच जोड़ें")}
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
                {t("Dispatch Board", "डिस्पैच बोर्ड")}
              </CardTitle>
              <CardDescription>
                {dispatches.length} {t("dispatches", "डिस्पैच")}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue
                    placeholder={t(
                      "Filter by status...",
                      "स्थिति के अनुसार फ़िल्टर करें...",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("All Statuses", "सभी स्थितियाँ")}
                  </SelectItem>
                  <SelectItem value="planned">
                    {t("Planned", "योजित")}
                  </SelectItem>
                  <SelectItem value="dispatched">
                    {t("Dispatched", "भेजा गया")}
                  </SelectItem>
                  <SelectItem value="in_progress">
                    {t("In Progress", "प्रगति पर")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("Completed", "पूरा हुआ")}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t("Cancelled", "रद्द")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 w-full sm:w-44"
                />
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("Search dispatches...", "डिस्पैच खोजें...")}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setGlobalFilter("")}
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              {t("Loading dispatches...", "डिस्पैच लोड हो रहे हैं...")}
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
                          {t("No dispatches found.", "कोई डिस्पैच नहीं मिला।")}
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
              {editDispatch
                ? t("Edit Dispatch", "डिस्पैच संपादित करें")
                : t("Add Dispatch", "डिस्पैच जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{t("Load", "लोड")}</Label>
              <Select
                value={form.loadId}
                onValueChange={(v) => setForm((p) => ({ ...p, loadId: v }))}
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
            </div>
            <div className="space-y-1.5">
              <Label>{t("Driver", "ड्राइवर")}</Label>
              <Select
                value={form.driverId}
                onValueChange={(v) => setForm((p) => ({ ...p, driverId: v }))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a driver...", "ड्राइवर चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.first_name} {d.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Vehicle", "वाहन")}</Label>
              <Select
                value={form.vehicleId}
                onValueChange={(v) => setForm((p) => ({ ...p, vehicleId: v }))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select a vehicle...", "वाहन चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.unit_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Status", "स्थिति")}</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("Select status...", "स्थिति चुनें...")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">
                    {t("Planned", "योजित")}
                  </SelectItem>
                  <SelectItem value="dispatched">
                    {t("Dispatched", "भेजा गया")}
                  </SelectItem>
                  <SelectItem value="in_progress">
                    {t("In Progress", "प्रगति पर")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("Completed", "पूरा हुआ")}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t("Cancelled", "रद्द")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Scheduled At", "निर्धारित किया गया")}</Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scheduledAt: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Notes", "नोट्स")}</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("Cancel", "रद्द करें")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? t("Saving...", "सहेज रहे हैं...")
                : editDispatch
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Dispatch", "डिस्पैच जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
