import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Wrench,
  AlertTriangle,
  RefreshCw,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleStatusBadge } from "@/components/status-badges";
import { supabase, type Vehicle } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

type VehicleForm = Omit<Vehicle, "id" | "created_at">;

const emptyForm: VehicleForm = {
  unit_number: "",
  type: "truck",
  year: new Date().getFullYear(),
  make: "",
  model: "",
  license_plate: "",
  mileage: 0,
  next_service_miles: 0,
  status: "active",
};

const vehicleStatusLabels: Record<string, { en: string; hi: string }> = {
  active: { en: "Active", hi: "सक्रिय" },
  maintenance: { en: "Maintenance", hi: "रखरखाव" },
  out_of_service: { en: "Out of Service", hi: "सेवा से बाहर" },
};

export default function Fleet() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [fleetError, setFleetError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setFleetError(null);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("unit_number");
      if (error) throw error;
      if (data) setVehicles(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load vehicles";
      setFleetError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    void fetchVehicles();
  }, [fetchVehicles]);

  function openCreate() {
    setEditVehicle(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditVehicle(v);
    setForm({
      unit_number: v.unit_number,
      type: v.type,
      year: v.year,
      make: v.make,
      model: v.model,
      license_plate: v.license_plate,
      mileage: v.mileage,
      next_service_miles: v.next_service_miles,
      status: v.status,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editVehicle) {
        await supabase.from("vehicles").update(form).eq("id", editVehicle.id);
      } else {
        await supabase.from("vehicles").insert(form);
      }
      setDialogOpen(false);
      void fetchVehicles();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save vehicle";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from("vehicles").delete().eq("id", id);
      void fetchVehicles();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete vehicle";
      toast.error(message);
    }
  }

  function isMaintenanceDue(vehicle: Vehicle): boolean {
    return vehicle.next_service_miles - vehicle.mileage <= 5000;
  }

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "unit_number",
      header: t("Unit #", "यूनिट #"),
      cell: ({ row }) => (
        <span className="font-mono font-medium">
          {row.original.unit_number}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: t("Type", "प्रकार"),
      cell: ({ row }) => (
        <Badge>
          {row.original.type === "truck"
            ? t("Truck", "ट्रक")
            : t("Trailer", "ट्रेलर")}
        </Badge>
      ),
    },
    {
      id: "vehicle",
      header: t("Vehicle", "वाहन"),
      cell: ({ row }) => (
        <span>
          {row.original.year} {row.original.make} {row.original.model}
        </span>
      ),
    },
    {
      accessorKey: "license_plate",
      header: t("Plate", "प्लेट"),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.license_plate}</span>
      ),
    },
    {
      id: "maintenance",
      header: t("Mileage / Service", "माइलेज / सर्विस"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {row.original.mileage.toLocaleString()} mi
          </span>
          {isMaintenanceDue(row.original) && (
            <Wrench className="size-4 text-yellow-600" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status", "स्थिति"),
      cell: ({ row }) => <VehicleStatusBadge status={row.original.status} />,
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
              onClick={() => void handleDelete(row.original.id)}
            >
              <Trash2 className="size-4" /> {t("Delete", "हटाएं")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: vehicles,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const activeTrucks = vehicles.filter(
    (v) => v.status === "active" && v.type === "truck"
  ).length;
  const activeTrailers = vehicles.filter(
    (v) => v.status === "active" && v.type === "trailer"
  ).length;
  const maintenanceDue = vehicles.filter(isMaintenanceDue).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {fleetError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-red-700 dark:text-red-300">{fleetError}</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => void fetchVehicles()}
          >
            <RefreshCw className="size-4 mr-1" />
            Retry
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Fleet", "फ्लीट")}
          </h1>
          <p className="text-muted-foreground">
            {t("Truck and trailer inventory", "ट्रक और ट्रेलर इन्वेंट्री")}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Vehicle", "वाहन जोड़ें")}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeTrucks}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Active Trucks", "सक्रिय ट्रक")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activeTrailers}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Active Trailers", "सक्रिय ट्रेलर")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {maintenanceDue}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Maintenance Due", "रखरखाव बाकी")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Vehicle List", "वाहन सूची")}
              </CardTitle>
              <CardDescription>
                {vehicles.length} {t("vehicles", "वाहन")}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search vehicles...", "वाहन खोजें...")}
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
        </CardHeader>
        <CardContent className="pt-0">
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
                              header.getContext()
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
                            cell.getContext()
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
                      {t("No vehicles found.", "कोई वाहन नहीं मिला।")}
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
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editVehicle
                ? t("Edit Vehicle", "वाहन संपादित करें")
                : t("Add Vehicle", "वाहन जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{t("Unit #", "यूनिट #")}</Label>
              <Input
                value={form.unit_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, unit_number: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Type", "प्रकार")}</Label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="truck">{t("Truck", "ट्रक")}</option>
                <option value="trailer">{t("Trailer", "ट्रेलर")}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("Year", "वर्ष")}</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    year: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Make", "ब्रांड")}</Label>
              <Input
                value={form.make}
                onChange={(e) =>
                  setForm((p) => ({ ...p, make: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Model", "मॉडल")}</Label>
              <Input
                value={form.model}
                onChange={(e) =>
                  setForm((p) => ({ ...p, model: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("License Plate", "लाइसेंस प्लेट")}</Label>
              <Input
                value={form.license_plate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, license_plate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Mileage", "माइलेज")}</Label>
              <Input
                type="number"
                value={form.mileage}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    mileage: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Next Service (miles)", "अगली सर्विस (मील)")}</Label>
              <Input
                type="number"
                value={form.next_service_miles}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    next_service_miles: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Status", "स्थिति")}</Label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                {Object.entries(vehicleStatusLabels).map(([key, val]) => (
                  <option key={key} value={key}>
                    {t(val.en, val.hi)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("Cancel", "रद्द करें")}
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving
                ? t("Saving...", "सहेज रहे हैं...")
                : editVehicle
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Vehicle", "वाहन जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
