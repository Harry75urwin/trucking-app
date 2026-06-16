import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  FileCheck,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Save,
  User,
  X,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchDriver,
  updateDriver,
  type BackendDriver,
} from "@/lib/trucker-api";

const emptyDriver: BackendDriver = {
  id: "",
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
  created_at: "",
  updated_at: "",
};

const statusColor: Record<string, string> = {
  available: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  on_load: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  off_duty: "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
};

const statusLabel: Record<string, string> = {
  available: "Available",
  on_load: "On Load",
  off_duty: "Off Duty",
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 font-semibold wrap-break-word">
        {value || "Not available"}
      </p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDocumentState(expiry?: string) {
  if (!expiry) return "Missing";
  const expiryDate = new Date(expiry);
  if (Number.isNaN(expiryDate.getTime())) return "Invalid date";

  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / 86400000);
  if (daysLeft < 0) return "Expired";
  if (daysLeft <= 30) return "Expiring soon";
  return "Valid";
}

function documentStateClass(state: string) {
  if (state === "Expired") return "bg-rose-500 text-white border-0";
  if (state === "Expiring soon") return "bg-amber-500 text-white border-0";
  if (state === "Valid") return "bg-emerald-500 text-white border-0";
  return "bg-muted text-foreground";
}

function statusClass(status: string) {
  return statusColor[status] ?? "bg-muted text-foreground";
}

function statusLabelFor(status: string, t: (en: string, hi: string) => string) {
  return statusLabel[status]
    ? t(statusLabel[status], statusLabel[status])
    : status;
}

export default function DriverDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [driver, setDriver] = useState<BackendDriver | null>(null);
  const [form, setForm] = useState<BackendDriver | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDriver(session, id)
      .then((data) => {
        if (!cancelled) {
          setDriver(data);
          setForm(data);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load driver"
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, session]);

  const updateField = (key: keyof BackendDriver, value: string) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const saveDriver = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !form) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateDriver(session, id, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        cdl_number: form.cdl_number,
        cdl_expiry: form.cdl_expiry,
        medical_expiry: form.medical_expiry,
        home_city: form.home_city,
        home_state: form.home_state,
        status: form.status,
      });

      setDriver(updated);
      setForm(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save driver");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="p-6">
        <Card className="border-0 bg-card/50">
          <CardContent className="py-6 text-muted-foreground">
            {t("Driver not found", "ड्राइवर नहीं मिला")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Link to="/company/drivers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {driver
                ? t("Driver Profile", "ड्राइवर प्रोफ़ाइल")
                : t("Driver Details", "ड्राइवर विवरण")}
            </h1>
            <p className="text-muted-foreground">
              {loading
                ? t("Loading driver...", "ड्राइवर लोड हो रहा है...")
                : driver
                  ? `${driver.first_name} ${driver.last_name} · ${driver.cdl_number}`
                  : t("Driver profile details", "ड्राइवर प्रोफ़ाइल विवरण")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button
                type="submit"
                form="driver-detail-form"
                disabled={saving || loading}
                className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{" "}
                {t("Save Driver", "ड्राइवर सहेजें")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setForm(driver);
                }}
                className="gap-2"
              >
                <X className="w-4 h-4" /> {t("Cancel", "रद्द करें")}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setEditing(true)}
              className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
            >
              {t("Edit Profile", "प्रोफ़ाइल संपादित करें")}
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <Card className="border-0 bg-card/50">
          <CardContent className="py-6 text-center text-muted-foreground">
            {t("Loading driver...", "ड्राइवर लोड हो रहा है...")}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-0 bg-rose-50 dark:bg-rose-950/20">
          <CardContent className="py-3 text-sm text-rose-600">
            {error}
          </CardContent>
        </Card>
      )}

      {driver && form && (
        <form
          id="driver-detail-form"
          className="space-y-6"
          onSubmit={(e) => void saveDriver(e)}
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="space-y-6 xl:col-span-2">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg">
                      <User className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>
                        {t("Profile Information", "प्रोफ़ाइल जानकारी")}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "Personal details and home base",
                          "व्यक्तिगत विवरण और होम बेस"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editing ? (
                      <>
                        <Field label={t("First Name", "नाम")}>
                          <Input
                            value={form.first_name}
                            onChange={(event) =>
                              updateField("first_name", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Last Name", "उपनाम")}>
                          <Input
                            value={form.last_name}
                            onChange={(event) =>
                              updateField("last_name", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Email", "ईमेल")}>
                          <Input
                            value={form.email}
                            onChange={(event) =>
                              updateField("email", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Phone", "फोन")}>
                          <Input
                            value={form.phone}
                            onChange={(event) =>
                              updateField("phone", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Home City", "शहर")}>
                          <Input
                            value={form.home_city}
                            onChange={(event) =>
                              updateField("home_city", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Home State", "राज्य")}>
                          <Input
                            value={form.home_state}
                            onChange={(event) =>
                              updateField("home_state", event.target.value)
                            }
                          />
                        </Field>
                      </>
                    ) : (
                      <>
                        <DetailItem
                          label={t("First Name", "नाम")}
                          value={driver.first_name}
                          icon={<User className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Last Name", "उपनाम")}
                          value={driver.last_name}
                          icon={<User className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Email", "ईमेल")}
                          value={driver.email}
                          icon={<Mail className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Phone", "फोन")}
                          value={driver.phone}
                          icon={<Phone className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Home City", "शहर")}
                          value={driver.home_city ?? ""}
                          icon={<MapPin className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Home State", "राज्य")}
                          value={driver.home_state ?? ""}
                          icon={<MapPin className="w-4 h-4" />}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
                      <ClipboardCheck className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>
                        {t("Driver Status", "ड्राइवर स्थिति")}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "Availability and profile timestamps",
                          "उपलब्धता और प्रोफ़ाइल समय-चिह्न"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                      <div className="text-xs text-muted-foreground">
                        {t("Status", "स्थिति")}
                      </div>
                      {editing ? (
                        <Select
                          value={form.status}
                          onValueChange={(value) =>
                            updateField("status", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">
                              {t("Available", "उपलब्ध")}
                            </SelectItem>
                            <SelectItem value="on_load">
                              {t("On Load", "लोड पर")}
                            </SelectItem>
                            <SelectItem value="off_duty">
                              {t("Off Duty", "ऑफ ड्यूटी")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`mt-2 ${statusClass(driver.status)}`}>
                          {statusLabelFor(driver.status, t)}
                        </Badge>
                      )}
                    </div>
                    <DetailItem
                      label={t("Created", "बनाया गया")}
                      value={formatDate(driver.created_at)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <DetailItem
                      label={t("Updated", "अपडेट किया गया")}
                      value={formatDate(driver.updated_at)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg">
                      <FileCheck className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>
                        {t("Document Management", "दस्तावेज़ प्रबंधन")}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "CDL and medical document status",
                          "सीडीएल और मेडिकल दस्तावेज़ स्थिति"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {editing ? (
                      <>
                        <Field label={t("CDL Number", "सीडीएल नंबर")}>
                          <Input
                            value={form.cdl_number}
                            onChange={(event) =>
                              updateField("cdl_number", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("CDL Expiry", "सीडीएल समाप्ति")}>
                          <Input
                            type="date"
                            value={form.cdl_expiry ?? ""}
                            onChange={(event) =>
                              updateField("cdl_expiry", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Medical Expiry", "मेडिकल समाप्ति")}>
                          <Input
                            type="date"
                            value={form.medical_expiry ?? ""}
                            onChange={(event) =>
                              updateField("medical_expiry", event.target.value)
                            }
                          />
                        </Field>
                      </>
                    ) : (
                      <>
                        <DetailItem
                          label={t("CDL Number", "सीडीएल नंबर")}
                          value={driver.cdl_number}
                          icon={<FileCheck className="w-4 h-4" />}
                        />
                        <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {t("CDL Expiry", "सीडीएल समाप्ति")}
                            </span>
                            <Badge
                              className={documentStateClass(
                                getDocumentState(driver.cdl_expiry)
                              )}
                            >
                              {getDocumentState(driver.cdl_expiry)}
                            </Badge>
                          </div>
                          <p className="mt-2 font-semibold">
                            {formatDate(driver.cdl_expiry)}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {t("Medical Expiry", "मेडिकल समाप्ति")}
                            </span>
                            <Badge
                              className={documentStateClass(
                                getDocumentState(driver.medical_expiry)
                              )}
                            >
                              {getDocumentState(driver.medical_expiry)}
                            </Badge>
                          </div>
                          <p className="mt-2 font-semibold">
                            {formatDate(driver.medical_expiry)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>
                    {t("Document Review", "दस्तावेज़ समीक्षा")}
                  </CardTitle>
                  <CardDescription>
                    {t("Quick compliance check", "त्वरित अनुपालन जांच")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      {t("CDL", "सीडीएल")}
                    </span>
                    <div className="flex items-center gap-2">
                      {getDocumentState(driver.cdl_expiry) === "Valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <Badge
                        className={documentStateClass(
                          getDocumentState(driver.cdl_expiry)
                        )}
                      >
                        {getDocumentState(driver.cdl_expiry)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {t("Medical", "मेडिकल")}
                    </span>
                    <div className="flex items-center gap-2">
                      {getDocumentState(driver.medical_expiry) === "Valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <Badge
                        className={documentStateClass(
                          getDocumentState(driver.medical_expiry)
                        )}
                      >
                        {getDocumentState(driver.medical_expiry)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
