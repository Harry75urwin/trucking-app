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
  Building2,
  Phone,
  Mail,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { supabase, type Customer } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  notes: "",
};

export default function Customers() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setCustomersError(null);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");
      if (error) throw error;
      if (data) setCustomers(data);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load customers";
      setCustomersError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  function openCreate() {
    setEditCustomer(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(c: Customer) {
    setEditCustomer(c);
    setForm({
      name: c.name,
      contact_name: c.contact_name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      city: c.city,
      state: c.state,
      zip: c.zip,
      notes: c.notes,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editCustomer) {
        await supabase.from("customers").update(form).eq("id", editCustomer.id);
      } else {
        await supabase.from("customers").insert(form);
      }
      setDialogOpen(false);
      void fetchCustomers();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to save customer";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from("customers").delete().eq("id", id);
      void fetchCustomers();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete customer";
      toast.error(message);
    }
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: t("Company", "कंपनी"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Building2 className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.contact_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: t("Contact", "संपर्क"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          {row.original.phone && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" /> {row.original.phone}
            </span>
          )}
          {row.original.email && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="size-3" /> {row.original.email}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "location",
      header: t("Location", "स्थान"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {[row.original.city, row.original.state, row.original.zip]
            .filter(Boolean)
            .join(", ")}
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
    data: customers,
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
      {customersError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-900 dark:bg-red-950/30">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-red-700 dark:text-red-300">
            {customersError}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => void fetchCustomers()}
          >
            <RefreshCw className="size-4 mr-1" />
            Retry
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Customers", "ग्राहक")}
          </h1>
          <p className="text-muted-foreground">
            {t("Shippers and freight brokers", "शिपर और फ्रेट ब्रोकर")}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Customer", "ग्राहक जोड़ें")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Customer List", "ग्राहक सूची")}
              </CardTitle>
              <CardDescription>
                {customers.length} {t("customers", "ग्राहक")}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search customers...", "ग्राहक खोजें...")}
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
                      {t("No customers found.", "कोई ग्राहक नहीं मिला।")}
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
              {editCustomer
                ? t("Edit Customer", "ग्राहक संपादित करें")
                : t("Add Customer", "ग्राहक जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Company Name", "कंपनी का नाम")}</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Contact Name", "संपर्क नाम")}</Label>
              <Input
                value={form.contact_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact_name: e.target.value }))
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
              <Label>{t("Address", "पता")}</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("City", "शहर")}</Label>
              <Input
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>{t("State", "राज्य")}</Label>
                <Input
                  value={form.state}
                  maxLength={2}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      state: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>ZIP</Label>
                <Input
                  value={form.zip}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, zip: e.target.value }))
                  }
                />
              </div>
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
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving
                ? t("Saving...", "सहेज रहे हैं...")
                : editCustomer
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Customer", "ग्राहक जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
