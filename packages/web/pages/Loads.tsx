import { useEffect, useState, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoadStatusBadge } from "@/components/status-badges";
import { supabase, type Load } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";

type LoadForm = Omit<
  Load,
  "id" | "created_at" | "updated_at" | "total_revenue"
>;

const emptyForm: LoadForm = {
  load_number: "",
  customer_id: "",
  origin_city: "",
  origin_state: "",
  destination_city: "",
  destination_state: "",
  pickup_date: "",
  delivery_date: "",
  commodity: "",
  weight_lbs: 0,
  miles: 0,
  rate: 0,
  fuel_surcharge: 0,
  detention: 0,
  notes: "",
  status: "pending",
};

const statusOptions: Record<string, { en: string; hi: string }> = {
  pending: { en: "Pending", hi: "लंबित" },
  dispatched: { en: "Dispatched", hi: "भेजा गया" },
  in_transit: { en: "In Transit", hi: "यातायात में" },
  delivered: { en: "Delivered", hi: "डिलीवर किया गया" },
  cancelled: { en: "Cancelled", hi: "रद्द किया गया" },
  problem: { en: "Problem", hi: "समस्या" },
};

export default function Loads() {
  const { t } = useLanguage();
  const [loads, setLoads] = useState<Load[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLoad, setEditLoad] = useState<Load | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLoads = useCallback(async () => {
    const { data } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLoads(data);
  }, []);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  function openCreate() {
    setEditLoad(null);
    setForm({
      ...emptyForm,
      load_number: `LD-${Date.now().toString().slice(-6)}`,
    });
    setDialogOpen(true);
  }

  function openEdit(l: Load) {
    setEditLoad(l);
    setForm({
      load_number: l.load_number,
      customer_id: l.customer_id,
      origin_city: l.origin_city,
      origin_state: l.origin_state,
      destination_city: l.destination_city,
      destination_state: l.destination_state,
      pickup_date: l.pickup_date,
      delivery_date: l.delivery_date,
      commodity: l.commodity,
      weight_lbs: l.weight_lbs,
      miles: l.miles,
      rate: l.rate,
      fuel_surcharge: l.fuel_surcharge,
      detention: l.detention,
      notes: l.notes,
      status: l.status,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editLoad) {
      await supabase.from("loads").update(form).eq("id", editLoad.id);
    } else {
      await supabase.from("loads").insert(form);
    }
    setSaving(false);
    setDialogOpen(false);
    fetchLoads();
  }

  async function handleDelete(id: string) {
    await supabase.from("loads").delete().eq("id", id);
    fetchLoads();
  }

  const columns: ColumnDef<Load>[] = [
    {
      accessorKey: "load_number",
      header: t("Load #", "लोड #"),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.original.load_number}
        </span>
      ),
    },
    {
      accessorKey: "origin_state",
      header: t("Route", "मार्ग"),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.origin_city}, {row.original.origin_state} →{" "}
          {row.original.destination_city}, {row.original.destination_state}
        </span>
      ),
    },
    {
      accessorKey: "pickup_date",
      header: t("Pickup Date", "पिकअप तारीख"),
      cell: ({ row }) => (
        <span>
          {row.original.pickup_date
            ? new Date(row.original.pickup_date).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status", "स्थिति"),
      cell: ({ row }) => <LoadStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "total_revenue",
      header: t("Revenue", "राजस्व"),
      cell: ({ row }) => (
        <span className="font-medium">
          $
          {row.original.total_revenue?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
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
    data: loads,
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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Loads", "लोड")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Shipment management and tracking",
              "शिप्मेंट प्रबंधन और ट्रैकिंग",
            )}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Load", "लोड जोड़ें")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Load List", "लोड सूची")}
              </CardTitle>
              <CardDescription>
                {loads.length} {t("loads", "लोड")}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search loads...", "लोड खोजें...")}
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
                      {t("No loads found.", "कोई लोड नहीं मिला।")}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editLoad
                ? t("Edit Load", "लोड संपादित करें")
                : t("Add Load", "लोड जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1.5">
              <Label>{t("Load #", "लोड #")}</Label>
              <Input
                value={form.load_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, load_number: e.target.value }))
                }
                disabled={!!editLoad}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Customer ID", "ग्राहक ID")}</Label>
              <Input
                value={form.customer_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customer_id: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Origin City", "उत्पत्ति शहर")}</Label>
              <Input
                value={form.origin_city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, origin_city: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Origin State", "उत्पत्ति राज्य")}</Label>
              <Input
                maxLength={2}
                value={form.origin_state}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    origin_state: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Destination City", "गंतव्य शहर")}</Label>
              <Input
                value={form.destination_city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, destination_city: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Destination State", "गंतव्य राज्य")}</Label>
              <Input
                maxLength={2}
                value={form.destination_state}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    destination_state: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Pickup Date", "पिकअप तारीख")}</Label>
              <Input
                type="date"
                value={form.pickup_date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pickup_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Delivery Date", "डिलीवरी तारीख")}</Label>
              <Input
                type="date"
                value={form.delivery_date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, delivery_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Commodity", "कमोडिटी")}</Label>
              <Input
                value={form.commodity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, commodity: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Weight (lbs)", "वजन (लिबर)")}</Label>
              <Input
                type="number"
                value={form.weight_lbs}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    weight_lbs: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Miles", "मील")}</Label>
              <Input
                type="number"
                value={form.miles}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    miles: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Rate", "दर")}</Label>
              <Input
                type="number"
                value={form.rate}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    rate: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Fuel Surcharge", "ईंधन जारी")}</Label>
              <Input
                type="number"
                value={form.fuel_surcharge}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    fuel_surcharge: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Detention", "पाबंदी")}</Label>
              <Input
                type="number"
                value={form.detention}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    detention: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Status", "स्थिति")}</Label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as any }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                {Object.entries(statusOptions).map(([key, val]) => (
                  <option key={key} value={key}>
                    {t(val.en, val.hi)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
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
                : editLoad
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Load", "लोड जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
