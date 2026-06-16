import { useEffect, useRef, useState, type ReactNode } from "react";
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
  ClipboardCheck,
  FileText,
  Gauge,
  Loader2,
  Save,
  Truck,
  Wrench,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchVehicle,
  updateVehicle,
  uploadFileToR2,
  type BackendVehicle,
} from "@/lib/trucker-api";

const emptyVehicle: BackendVehicle = {
  id: "",
  unit_number: "",
  type: "truck",
  year: new Date().getFullYear(),
  make: "",
  model: "",
  license_plate: "",
  mileage: 0,
  next_service_miles: 0,
  imageUrls: [],
  status: "active",
  created_at: "",
  updated_at: "",
};

const statusColor: Record<string, string> = {
  active: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  idle: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  maintenance:
    "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
  inactive: "bg-muted text-foreground",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  idle: "Idle",
  maintenance: "Maintenance",
  inactive: "Inactive",
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

function formatNumber(value?: number) {
  if (value === undefined || value === null) return "Not available";
  return Number(value).toLocaleString("en-IN");
}

function statusClass(status: string) {
  return statusColor[status] ?? "bg-muted text-foreground";
}

function statusLabelFor(status: string, t: (en: string, hi: string) => string) {
  return statusLabel[status]
    ? t(statusLabel[status], statusLabel[status])
    : status;
}

function getMaintenanceState(vehicle: BackendVehicle) {
  if (vehicle.status === "maintenance") return "Maintenance";
  const milesUntilService = vehicle.next_service_miles - vehicle.mileage;
  if (milesUntilService <= 0) return "Service due";
  if (milesUntilService <= 1000) return "Service soon";
  return "On schedule";
}

function maintenanceStateClass(state: string) {
  if (state === "Maintenance" || state === "Service due")
    return "bg-amber-500 text-white border-0";
  if (state === "Service soon") return "bg-blue-500 text-white border-0";
  return "bg-emerald-500 text-white border-0";
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [vehicle, setVehicle] = useState<BackendVehicle | null>(null);
  const [form, setForm] = useState<BackendVehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchVehicle(session, id)
      .then((data) => {
        if (!cancelled) {
          setVehicle(data);
          setForm(data);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load vehicle"
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, session]);

  const updateField = (key: keyof BackendVehicle, value: string | number) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const uploadVehicleImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;
    setUploadingImages(true);
    setError(null);
    try {
      const imageUrl = await uploadFileToR2(session, file, "vehicle");
      setForm((current) =>
        current
          ? { ...current, imageUrls: [...(current.imageUrls ?? []), imageUrl] }
          : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeVehicleImage = (imageUrl: string) => {
    setForm((current) =>
      current
        ? {
            ...current,
            imageUrls: (current.imageUrls ?? []).filter(
              (url) => url !== imageUrl
            ),
          }
        : current
    );
  };

  const saveVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !form) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateVehicle(session, id, {
        unit_number: form.unit_number,
        type: form.type,
        year: form.year,
        make: form.make,
        model: form.model,
        license_plate: form.license_plate,
        mileage: form.mileage,
        next_service_miles: form.next_service_miles,
        imageUrls: form.imageUrls ?? [],
        status: form.status,
      });

      setVehicle(updated);
      setForm(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="p-6">
        <Card className="border-0 bg-card/50">
          <CardContent className="py-6 text-muted-foreground">
            {t("Vehicle not found", "वाहन नहीं मिला")}
          </CardContent>
        </Card>
      </div>
    );
  }

  const maintenanceState = vehicle
    ? getMaintenanceState(vehicle)
    : "Not available";
  const milesUntilService = vehicle
    ? vehicle.next_service_miles - vehicle.mileage
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Link to="/company/fleet">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {vehicle
                ? t("Vehicle Profile", "वाहन प्रोफ़ाइल")
                : t("Vehicle Details", "वाहन विवरण")}
            </h1>
            <p className="text-muted-foreground">
              {loading
                ? t("Loading vehicle...", "वाहन लोड हो रहा है...")
                : vehicle
                  ? `${vehicle.unit_number} · ${vehicle.license_plate}`
                  : t("Vehicle profile details", "वाहन प्रोफ़ाइल विवरण")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button
                type="submit"
                form="vehicle-detail-form"
                disabled={saving || loading}
                className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{" "}
                {t("Save Vehicle", "वाहन सहेजें")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setForm(vehicle);
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
            {t("Loading vehicle...", "वाहन लोड हो रहा है...")}
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

      {vehicle && form && (
        <form
          id="vehicle-detail-form"
          className="space-y-6"
          onSubmit={(e) => void saveVehicle(e)}
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="space-y-6 xl:col-span-2">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg">
                      <Wrench className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>
                        {t("Maintenance History", "रखरखाव इतिहास")}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "Service status and mileage tracking",
                          "सेवा स्थिति और माइलेज ट्रैकिंग"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {editing ? (
                      <>
                        <Field label={t("Status", "स्थिति")}>
                          <Select
                            value={form.status}
                            onValueChange={(value) =>
                              updateField("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                {t("Active", "सक्रिय")}
                              </SelectItem>
                              <SelectItem value="idle">
                                {t("Idle", "खाली")}
                              </SelectItem>
                              <SelectItem value="maintenance">
                                {t("Maintenance", "रखरखाव")}
                              </SelectItem>
                              <SelectItem value="inactive">
                                {t("Inactive", "निष्क्रिय")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label={t("Mileage", "माइलेज")}>
                          <Input
                            type="number"
                            min="0"
                            value={form.mileage}
                            onChange={(event) =>
                              updateField("mileage", Number(event.target.value))
                            }
                          />
                        </Field>
                        <Field
                          label={t("Next Service Miles", "अगली सेवा माइल")}
                        >
                          <Input
                            type="number"
                            min="0"
                            value={form.next_service_miles}
                            onChange={(event) =>
                              updateField(
                                "next_service_miles",
                                Number(event.target.value)
                              )
                            }
                          />
                        </Field>
                      </>
                    ) : (
                      <>
                        <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                          <div className="text-xs text-muted-foreground">
                            {t("Status", "स्थिति")}
                          </div>
                          <Badge
                            className={`mt-2 ${statusClass(vehicle.status)}`}
                          >
                            {statusLabelFor(vehicle.status, t)}
                          </Badge>
                        </div>
                        <DetailItem
                          label={t("Mileage", "माइलेज")}
                          value={formatNumber(vehicle.mileage)}
                          icon={<Gauge className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Next Service Miles", "अगली सेवा माइल")}
                          value={formatNumber(vehicle.next_service_miles)}
                          icon={<Gauge className="w-4 h-4" />}
                        />
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {t("Maintenance Status", "रखरखाव स्थिति")}
                        </span>
                        <Badge
                          className={maintenanceStateClass(maintenanceState)}
                        >
                          {maintenanceState}
                        </Badge>
                      </div>
                      <p className="mt-2 font-semibold">
                        {milesUntilService >= 0
                          ? t(
                              `${formatNumber(milesUntilService)} miles until service`,
                              `${formatNumber(milesUntilService)} माइल सेवा तक बाकी`
                            )
                          : t(
                              `${formatNumber(Math.abs(milesUntilService))} miles overdue`,
                              `${formatNumber(Math.abs(milesUntilService))} माइल विलंबित`
                            )}
                      </p>
                    </div>
                    <DetailItem
                      label={t("Updated", "अपडेट किया गया")}
                      value={formatDate(vehicle.updated_at)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
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
                        {t("Maintenance Summary", "रखरखाव सारांश")}
                      </CardTitle>
                      <CardDescription>
                        {t("Recent service indicators", "हाल की सेवा संकेतक")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      {t("Service Status", "सेवा स्थिति")}
                    </span>
                    <Badge className={maintenanceStateClass(maintenanceState)}>
                      {maintenanceState}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      {t("Current Mileage", "वर्तमान माइलेज")}
                    </span>
                    <span className="font-medium">
                      {formatNumber(vehicle.mileage)} mi
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {t("Next Service Due", "अगली सेवा देय")}
                    </span>
                    <span className="font-medium">
                      {formatNumber(vehicle.next_service_miles)} mi
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{t("Vehicle Photos", "वाहन फोटो")}</CardTitle>
                      <CardDescription>
                        {t(
                          "Upload truck images stored in Cloudflare R2",
                          "Cloudflare R2 में ट्रक छवियां अपलोड करें"
                        )}
                      </CardDescription>
                    </div>
                    {editing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImages || saving}
                      >
                        {uploadingImages
                          ? t("Uploading...", "अपलोड हो रहा है...")
                          : t("Upload Image", "छवि अपलोड करें")}
                      </Button>
                    )}
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void uploadVehicleImage(e)}
                  />
                </CardHeader>
                <CardContent>
                  {form.imageUrls && form.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {form.imageUrls.map((imageUrl) => (
                        <div key={imageUrl} className="relative group">
                          <img
                            src={imageUrl}
                            alt="vehicle"
                            className="h-32 w-full rounded-lg object-cover border bg-muted"
                          />
                          {editing && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-7 w-7 p-0"
                              onClick={() => removeVehicleImage(imageUrl)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "No vehicle images uploaded yet.",
                        "अभी तक वाहन छवियां अपलोड नहीं की गईं।"
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg">
                      <FileText className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>
                        {t("Registration Information", "पंजीकरण जानकारी")}
                      </CardTitle>
                      <CardDescription>
                        {t(
                          "Vehicle identity and registration details",
                          "वाहन पहचान और पंजीकरण विवरण"
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {editing ? (
                      <>
                        <Field label={t("Unit Number", "यूनिट नंबर")}>
                          <Input
                            value={form.unit_number}
                            onChange={(event) =>
                              updateField("unit_number", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("License Plate", "लाइसेंस प्लेट")}>
                          <Input
                            value={form.license_plate}
                            onChange={(event) =>
                              updateField("license_plate", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Vehicle Type", "वाहन का प्रकार")}>
                          <Select
                            value={form.type}
                            onValueChange={(value) =>
                              updateField("type", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="truck">
                                {t("Truck", "ट्रक")}
                              </SelectItem>
                              <SelectItem value="trailer">
                                {t("Trailer", "ट्रेलर")}
                              </SelectItem>
                              <SelectItem value="van">
                                {t("Van", "वैन")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label={t("Year", "वर्ष")}>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            value={form.year}
                            onChange={(event) =>
                              updateField("year", Number(event.target.value))
                            }
                          />
                        </Field>
                        <Field label={t("Make", "निर्माता")}>
                          <Input
                            value={form.make}
                            onChange={(event) =>
                              updateField("make", event.target.value)
                            }
                          />
                        </Field>
                        <Field label={t("Model", "मॉडल")}>
                          <Input
                            value={form.model}
                            onChange={(event) =>
                              updateField("model", event.target.value)
                            }
                          />
                        </Field>
                      </>
                    ) : (
                      <>
                        <DetailItem
                          label={t("Unit Number", "यूनिट नंबर")}
                          value={vehicle.unit_number}
                          icon={<Truck className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("License Plate", "लाइसेंस प्लेट")}
                          value={vehicle.license_plate}
                          icon={<FileText className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Vehicle Type", "वाहन का प्रकार")}
                          value={vehicle.type}
                          icon={<Truck className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Year", "वर्ष")}
                          value={vehicle.year}
                          icon={<Calendar className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Make", "निर्माता")}
                          value={vehicle.make}
                          icon={<Truck className="w-4 h-4" />}
                        />
                        <DetailItem
                          label={t("Model", "मॉडल")}
                          value={vehicle.model}
                          icon={<Truck className="w-4 h-4" />}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>
                    {t("Registration Review", "पंजीकरण समीक्षा")}
                  </CardTitle>
                  <CardDescription>
                    {t("Quick vehicle summary", "त्वरित वाहन सारांश")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      {t("Vehicle", "वाहन")}
                    </span>
                    <span className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      {t("Plate", "प्लेट")}
                    </span>
                    <span className="font-medium">{vehicle.license_plate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {t("Status", "स्थिति")}
                    </span>
                    <div className="flex items-center gap-2">
                      {vehicle.status === "active" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      <Badge className={statusClass(vehicle.status)}>
                        {statusLabelFor(vehicle.status, t)}
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
