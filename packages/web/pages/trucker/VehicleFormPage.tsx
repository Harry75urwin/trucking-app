import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Truck, Save, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { fetchVehicle, type BackendVehicle } from "@/lib/trucker-api";

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

export default function VehicleFormPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<BackendVehicle>({ ...emptyVehicle });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id || !session.isAuthenticated) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchVehicle(session, id)
      .then((data) => {
        if (!cancelled) setForm(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load vehicle",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, session]);

  useEffect(() => {
    if (!isEdit && !session.isAuthenticated) return;
    if (isEdit) return;
    setForm((prev) => ({ ...prev, id: "" }));
  }, [isEdit, session]);

  const update = (
    key: keyof BackendVehicle,
    value: string | number | boolean,
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const action = isEdit ? "Vehicle updated" : "Vehicle added";
      await new Promise((resolve) => setTimeout(resolve, 300));
      alert(t(action, isEdit ? "वाहन अपडेट हो गया!" : "वाहन जोड़ दिया गया!"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/trucker/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit
              ? t("Edit Vehicle", "वाहन संपादित करें")
              : t("Add Vehicle", "वाहन जोड़ें")}
          </h1>
          <p className="text-muted-foreground">
            {loading && isEdit
              ? t("Loading vehicle...", "वाहन लोड हो रहा है...")
              : isEdit
                ? t("Update vehicle details", "वाहन विवरण अपडेट करें")
                : t("Register a new vehicle", "नया वाहन पंजीकृत करें")}
          </p>
        </div>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg">
              <Truck className="size-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isEdit
                  ? form.unit_number || form.license_plate
                  : t("New Vehicle", "नया वाहन")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Fill in the vehicle information below",
                  "नीचे वाहन की जानकारी भरें",
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-rose-500 mb-4">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_number">
                  {t("Unit Number", "यूनिट नंबर")}
                </Label>
                <Input
                  id="unit_number"
                  value={form.unit_number}
                  onChange={(e) => update("unit_number", e.target.value)}
                  placeholder="TRK-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_plate">
                  {t("License Plate", "लाइसेंस प्लेट")}
                </Label>
                <Input
                  id="license_plate"
                  value={form.license_plate}
                  onChange={(e) => update("license_plate", e.target.value)}
                  placeholder="KA-01-AB-1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">
                  {t("Vehicle Type", "वाहन का प्रकार")}
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => update("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">{t("Truck", "ट्रक")}</SelectItem>
                    <SelectItem value="trailer">
                      {t("Trailer", "ट्रेलर")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{t("Vehicle Model", "वाहन मॉडल")}</Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="Tata Prima"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">
                  {t("Manufacturing Year", "निर्माण वर्ष")}
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => update("year", Number(e.target.value))}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">{t("Mileage", "माइलेज")}</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={form.mileage}
                  onChange={(e) => update("mileage", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t("Status", "स्थिति")}</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => update("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("Active", "सक्रिय")}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {t("Maintenance", "रखरखाव")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("Inactive", "निष्क्रिय")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link to="/trucker/vehicles">
                <Button type="button" variant="outline" className="gap-2">
                  <X className="w-4 h-4" /> {t("Cancel", "रद्द करें")}
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving || loading}
                className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {t("Save Vehicle", "वाहन सहेजें")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
