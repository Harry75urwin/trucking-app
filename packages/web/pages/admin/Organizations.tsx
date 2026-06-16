import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Building2,
  Phone,
  Globe,
  MapPin,
  User,
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type BackendOrganization,
} from "@/lib/trucker-api";

const emptyForm = {
  name: "",
  email: "",
  phoneNumber: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  description: "",
  logoUrl: "",
  primaryColor: "",
  ownerUserId: "",
  isActive: true,
};

export default function OrganizationsManagement() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [organizations, setOrganizations] = useState<BackendOrganization[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<BackendOrganization | null>(null);
  const [viewOrg, setViewOrg] = useState<BackendOrganization | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrganizations(session);
      setOrganizations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to load organizations", "संगठन लोड करने में विफल")
      );
    }
    setLoading(false);
  }, [session, t]);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  function openCreate() {
    setEditOrg(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(org: BackendOrganization) {
    setEditOrg(org);
    setForm({
      name: org.name,
      email: org.email,
      phoneNumber: org.phoneNumber ?? "",
      website: org.website ?? "",
      address: org.address ?? "",
      city: org.city ?? "",
      state: org.state ?? "",
      country: org.country ?? "",
      postalCode: org.postalCode ?? "",
      description: org.description ?? "",
      logoUrl: org.logoUrl ?? "",
      primaryColor: org.primaryColor ?? "",
      ownerUserId: org.ownerUserId?.toString() ?? "",
      isActive: org.isActive ?? true,
    });
    setDialogOpen(true);
  }

  function openDetail(org: BackendOrganization) {
    setViewOrg(org);
    setDetailOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber || undefined,
        website: form.website || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        postalCode: form.postalCode || undefined,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
        primaryColor: form.primaryColor || undefined,
        ownerUserId: form.ownerUserId ? Number(form.ownerUserId) : undefined,
        isActive: form.isActive,
      };
      if (editOrg) {
        await updateOrganization(session, editOrg.id, payload);
        setSuccess(
          t(
            "Organization updated successfully",
            "संगठन सफलतापूर्वक अपडेट किया गया"
          )
        );
      } else {
        await createOrganization(session, payload);
        setSuccess(
          t("Organization created successfully", "संगठन सफलतापूर्वक बनाया गया")
        );
      }
      setDialogOpen(false);
      await loadOrganizations();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to save organization", "संगठन सहेजने में विफल")
      );
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm(t("Delete this organization?", "इस संगठन को हटाएं?"))) return;
    try {
      await deleteOrganization(session, id);
      setSuccess(
        t("Organization deleted successfully", "संगठन सफलतापूर्वक हटाया गया")
      );
      await loadOrganizations();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to delete organization", "संगठन हटाने में विफल")
      );
    }
  }

  const filteredOrgs = organizations.filter((org) => {
    if (statusFilter === "active") return org.isActive === true;
    if (statusFilter === "inactive")
      return org.isActive === false || org.isActive === undefined;
    return true;
  });

  const columns: ColumnDef<BackendOrganization>[] = [
    {
      accessorKey: "name",
      header: t("Organization", "संगठन"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Building2 className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: t("Contact", "संपर्क"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          {row.original.phoneNumber && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" /> {row.original.phoneNumber}
            </span>
          )}
          {row.original.website && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="size-3" /> {row.original.website}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: t("Location", "स्थान"),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {[row.original.city, row.original.state, row.original.country]
            .filter(Boolean)
            .join(", ")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("Status", "स्थिति"),
      cell: ({ row }) => {
        const isActive = row.original.isActive !== false;
        return (
          <Badge
            variant="outline"
            className={
              isActive
                ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                : "border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-400"
            }
          >
            {isActive ? t("Active", "सक्रिय") : t("Inactive", "निष्क्रिय")}
          </Badge>
        );
      },
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
            <DropdownMenuItem onClick={() => openDetail(row.original)}>
              <Building2 className="size-4" />{" "}
              {t("View Details", "विवरण देखें")}
            </DropdownMenuItem>
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
    data: filteredOrgs,
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
            {t("Organizations", "संगठन")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Manage all organizations on the platform",
              "प्लेटफॉर्म पर सभी संगठनों का प्रबंधन करें"
            )}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> {t("Add Organization", "संगठन जोड़ें")}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {t("Organization List", "संगठन सूची")}
              </CardTitle>
              <CardDescription>
                {filteredOrgs.length} {t("organizations", "संगठन")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("Status", "स्थिति")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("All Statuses", "सभी स्थिति")}
                  </SelectItem>
                  <SelectItem value="active">
                    {t("Active", "सक्रिय")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("Inactive", "निष्क्रिय")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("Search organizations...", "संगठन खोजें...")}
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
              {t("Loading organizations...", "संगठन लोड हो रहे हैं...")}
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
                          {t("No organizations found.", "कोई संगठन नहीं मिला।")}
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
              {editOrg
                ? t("Edit Organization", "संगठन संपादित करें")
                : t("Add Organization", "संगठन जोड़ें")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Organization Name", "संगठन का नाम")}</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
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
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Website", "वेबसाइट")}</Label>
              <Input
                value={form.website}
                onChange={(e) =>
                  setForm((p) => ({ ...p, website: e.target.value }))
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
                <Label>{t("Country", "देश")}</Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, country: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>ZIP</Label>
              <Input
                value={form.postalCode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, postalCode: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("Owner User ID", "मालिक उपयोगकर्ता आईडी")}</Label>
              <Input
                type="number"
                value={form.ownerUserId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ownerUserId: e.target.value }))
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Description", "विवरण")}</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>{t("Status", "स्थिति")}</Label>
              <Select
                value={form.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, isActive: value === "active" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {t("Active", "सक्रिय")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("Inactive", "निष्क्रिय")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("Cancel", "रद्द करें")}
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving
                ? t("Saving...", "सहेज रहे हैं...")
                : editOrg
                  ? t("Save Changes", "परिवर्तन सहेजें")
                  : t("Add Organization", "संगठन जोड़ें")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("Organization Details", "संगठन विवरण")}
            </DialogTitle>
          </DialogHeader>
          {viewOrg && (
            <div className="grid gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Building2 className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{viewOrg.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewOrg.email}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge
                    variant="outline"
                    className={
                      viewOrg.isActive !== false
                        ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                        : "border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-400"
                    }
                  >
                    {viewOrg.isActive !== false
                      ? t("Active", "सक्रिय")
                      : t("Inactive", "निष्क्रिय")}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Phone", "फोन")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="size-3" /> {viewOrg.phoneNumber || "—"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Website", "वेबसाइट")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <Globe className="size-3" /> {viewOrg.website || "—"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Location", "स्थान")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="size-3" />{" "}
                    {[viewOrg.city, viewOrg.state, viewOrg.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Owner User ID", "मालिक उपयोगकर्ता आईडी")}
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="size-3" /> {viewOrg.ownerUserId ?? "—"}
                  </p>
                </div>
              </div>
              {viewOrg.description && (
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("Description", "विवरण")}
                  </p>
                  <p className="text-sm">{viewOrg.description}</p>
                </div>
              )}
              {viewOrg.address && (
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("Address", "पता")}
                  </p>
                  <p className="text-sm">{viewOrg.address}</p>
                </div>
              )}
              {viewOrg.logoUrl && (
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t("Logo", "लोगो")}
                  </p>
                  <img
                    src={viewOrg.logoUrl}
                    alt={viewOrg.name}
                    className="h-24 rounded-lg border object-contain bg-white"
                  />
                  <p className="text-xs break-all text-muted-foreground">
                    {viewOrg.logoUrl}
                  </p>
                </div>
              )}
              {viewOrg.primaryColor && (
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("Primary Color", "प्राथमिक रंग")}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-6 rounded border"
                      style={{
                        backgroundColor: viewOrg.primaryColor,
                      }}
                    />
                    <p className="text-sm font-mono">{viewOrg.primaryColor}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              {t("Close", "बंद करें")}
            </Button>
            {viewOrg && (
              <Button
                onClick={() => {
                  setDetailOpen(false);
                  openEdit(viewOrg);
                }}
              >
                <Pencil className="size-4 mr-2" /> {t("Edit", "संपादित करें")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
