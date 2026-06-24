import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
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
import { DriverStatusBadge } from "@/components/status-badges";
import { supabase, type Driver } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

type DriverForm = Omit<Driver, "id" | "created_at">;

const emptyForm: DriverForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  cdl_number: "",
  cdl_expiry: "",
  medical_expiry: "",
  home_city: "",
  home_state: "",
  status: "available",
};

const driverStatusLabels: Record<string, { en: string; hi: string }> = {
  available: { en: "Available", hi: "उपलब्ध" },
  on_load: { en: "On Load", hi: "लोड पर" },
  off_duty: { en: "Off Duty", hi: "ऑफ ड्यूटी" },
};

export default function Drivers() {
  const { t } = useLanguage();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setDriversError(null);
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("first_name");
      if (error) throw error;
      if (data) setDrivers(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load drivers";
      setDriversError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    void fetchDrivers();
  }, [fetchDrivers]);

  function openCreate() {
    setEditDriver(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(d: Driver) {
    setEditDriver(d);
    setForm({
      first_name: d.first_name,
      last_name: d.last_name,
      email: d.email,
      phone: d.phone,
      cdl_number: d.cdl_number,
      cdl_expiry: d.cdl_expiry,
      medical_expiry: d.medical_expiry,
      home_city: d.home_city,
      home_state: d.home_state,
      status: d.status,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editDriver) {
      await supabase.from("drivers").update(form).eq("id", editDriver.id);
    } else {
      await supabase.from("drivers").insert(form);
    }
    setSaving(false);
    setDialogOpen(false);
    void fetchDrivers();
  }

  async function handleDelete(id: string) {
    await supabase.from("drivers").delete().eq("id", id);
    void fetchDrivers();
  }

  function isExpiringSoon(date: string): boolean {
    const d = new Date(date);
    const now = new Date();
    const daysUntilExpiry =
      (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
  }

  function isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  const columns: ColumnDef<Driver>[] = [
    {
      id: "name",
      accessorKey: "first_name",
      header: t("Name", "नाम"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {row.original.first_name[0]}
            {row.original.last_name[0]}
          </div>
          <div>
            <p className="font-medium">
              {row.original.first_name} {row.original.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.cdl_number}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: t("Contact", "संपर्क"),
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{row.original.phone}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      id: "expiry",
      header: t("License/Medical", "लाइसेंस/चिकित्सा"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1">
            {isExpired(row.original.cdl_expiry) ? (
              <>
                <AlertTriangle className="size-3 text-red-600" />
                <span className="text-red-600 font-medium">
                  {t("CDL Expired", "CDL समाप्त")}
                </span>
              </>
            ) : isExpiringSoon(row.original.cdl_expiry) ? (
              <>
                <AlertTriangle className="size-3 text-yellow-600" />
                <span className="text-yellow-600">
                  {t("CDL:", "CDL:")}{" "}
                  {new Date(row.original.cdl_expiry).toLocaleDateString()}
                </span>
              </>
            ) : (
              <span>
                {new Date(row.original.cdl_expiry).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isExpired(row.original.medical_expiry) ? (
              <>
                <AlertTriangle className="size-3 text-red-600" />
                <span className="text-red-600 font-medium">
                  {t("Medical Expired", "चिकित्सा समाप्त")}
                </span>
              </>
            ) : isExpiringSoon(row.original.medical_expiry) ? (
              <>
                <AlertTriangle className="size-3 text-yellow-600" />
                <span className="text-yellow-600">
                  {t("Medical:", "चिकित्सा:")}{" "}
                  {new Date(row.original.medical_expiry).toLocaleDateString()}
                </span>
              </>
            ) : (
              <span>
                {new Date(row.original.medical_expiry).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status", "स्थिति"),
      cell: ({ row }) => <DriverStatusBadge status={row.original.status} />,
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
    data: drivers,
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

  const availableCount = drivers.filter((d) => d.status === "available").length;
  const onLoadCount = drivers.filter((d) => d.status === "on_load").length;
  const offDutyCount = drivers.filter((d) => d.status === "off_duty").length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {driversError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-red-700 dark:text-red-300">{driversError}</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => void fetchDrivers()}
          >
            <RefreshCw className="size-4 mr-1" />
            Retry
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Drivers", "ड्राइवर")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Fleet driver roster and management",
              "फ्लीट ड्राइवर रोस्टर और प्रबंधन"
            )}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Driver", "ड्राइवर जोड़ें")}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {availableCount}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Available", "उपलब्ध")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {onLoadCount}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("On Load", "लोड पर")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={`text-2xl font-bold text-gray-600`}>
              {offDutyCount}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Off Duty", "ऑफ ड्यूटी")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Driver List", "ड्राइवर सूची")}
              </CardTitle>
              <CardDescription>
                {drivers.length} {t("drivers", "ड्राइवर")}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search drivers...", "ड्राइवर खोजें...")}
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
                      {t("No drivers found.", "कोई ड्राइवर नहीं मिला।")}
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
              {editDriver
                ? t("Edit Driver", "ड्राइवर संपादित करें")
                : t("Add Driver", "ड्राइवर जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{t("First Name", "पहला नाम")}</Label>
              <Input
                value={form.first_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, first_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Last Name", "अंतिम नाम")}</Label>
              <Input
                value={form.last_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, last_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Email", "ईमेल")}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Phone", "फोन")}</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("CDL Number", "CDL नंबर")}</Label>
              <Input
                value={form.cdl_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cdl_number: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("CDL Expiry", "CDL समाप्ति")}</Label>
              <Input
                type="date"
                value={form.cdl_expiry}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cdl_expiry: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Medical Expiry", "चिकित्सा समाप्ति")}</Label>
              <Input
                type="date"
                value={form.medical_expiry}
                onChange={(e) =>
                  setForm((p) => ({ ...p, medical_expiry: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Home City", "घर का शहर")}</Label>
              <Input
                value={form.home_city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, home_city: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Home State", "घर का राज्य")}</Label>
              <Input
                maxLength={2}
                value={form.home_state}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    home_state: e.target.value.toUpperCase(),
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
                {Object.entries(driverStatusLabels).map(([key, val]) => (
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
                : editDriver
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Driver", "ड्राइवर जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
