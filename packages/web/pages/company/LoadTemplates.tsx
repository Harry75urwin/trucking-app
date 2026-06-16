import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Plus, Copy, Trash2, Star, Save } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  fetchLoadTemplates,
  createLoadTemplate,
  deleteLoadTemplate,
  type BackendLoadTemplate,
} from "@/lib/trucker-api";

export default function LoadTemplatesPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const [templates, setTemplates] = useState<BackendLoadTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    origin_city: "",
    origin_state: "",
    destination_city: "",
    destination_state: "",
    pickup_date: "",
    delivery_date: "",
    commodity: "",
    weight_lbs: "",
    miles: "",
    rate: "",
    fuel_surcharge: "",
    detention: "",
    notes: "",
  });

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const orgId = session.user?.organizationId;
      const data = await fetchLoadTemplates(
        session,
        orgId ? String(orgId) : undefined,
      );
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session.user) loadTemplates();
  }, [session]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session.user?.organizationId;
    if (!orgId) {
      alert(t("No organization linked", "कोई संगठन संबद्ध नहीं है"));
      return;
    }
    try {
      await createLoadTemplate(session, {
        ...form,
        organization_id: String(orgId),
        weight_lbs: Number(form.weight_lbs),
        miles: Number(form.miles),
        rate: Number(form.rate),
        fuel_surcharge: Number(form.fuel_surcharge),
        detention: Number(form.detention),
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: "",
      } as any);
      setShowForm(false);
      setForm({
        name: "",
        origin_city: "",
        origin_state: "",
        destination_city: "",
        destination_state: "",
        pickup_date: "",
        delivery_date: "",
        commodity: "",
        weight_lbs: "",
        miles: "",
        rate: "",
        fuel_surcharge: "",
        detention: "",
        notes: "",
      });
      await loadTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create template");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("Delete this template?", "यह टेम्पलेट हटाएं?"))) return;
    try {
      await deleteLoadTemplate(session, id);
      await loadTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.origin_city.toLowerCase().includes(search.toLowerCase()) ||
      t.destination_city.toLowerCase().includes(search.toLowerCase()) ||
      t.commodity.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("Load Templates", "लोड टेम्पलेट")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Save and reuse frequent load configurations",
              "बार-बार उपयोग किए जाने वाले लोड कॉन्फ़िगरेशन को सहेजें और पुनः उपयोग करें",
            )}
          </p>
        </div>
        <Button
          className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-1" />
          {showForm
            ? t("Cancel", "रद्द करें")
            : t("New Template", "नया टेम्पलेट")}
        </Button>
      </div>

      {error && (
        <Card className="border-0 bg-rose-50 dark:bg-rose-950/20">
          <CardContent className="py-3 text-sm text-rose-600">
            {error}
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("Create Load Template", "लोड टेम्पलेट बनाएं")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">
                    {t("Template Name", "टेम्पलेट नाम")}
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t(
                      "e.g. Mumbai-Delhi Electronics",
                      "उदा. मुंबई-दिल्ली इलेक्ट्रॉनिक्स",
                    )}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Origin City", "उत्पत्ति शहर")}
                  </label>
                  <Input
                    value={form.origin_city}
                    onChange={(e) =>
                      setForm({ ...form, origin_city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Origin State", "उत्पत्ति राज्य")}
                  </label>
                  <Input
                    value={form.origin_state}
                    onChange={(e) =>
                      setForm({ ...form, origin_state: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Destination City", "गंतव्य शहर")}
                  </label>
                  <Input
                    value={form.destination_city}
                    onChange={(e) =>
                      setForm({ ...form, destination_city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Destination State", "गंतव्य राज्य")}
                  </label>
                  <Input
                    value={form.destination_state}
                    onChange={(e) =>
                      setForm({ ...form, destination_state: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Pickup Date", "पिकअप तारीख")}
                  </label>
                  <Input
                    type="date"
                    value={form.pickup_date}
                    onChange={(e) =>
                      setForm({ ...form, pickup_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Delivery Date", "डिलीवरी तारीख")}
                  </label>
                  <Input
                    type="date"
                    value={form.delivery_date}
                    onChange={(e) =>
                      setForm({ ...form, delivery_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Commodity", "माल")}
                  </label>
                  <Input
                    value={form.commodity}
                    onChange={(e) =>
                      setForm({ ...form, commodity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Weight (lbs)", "वजन (लब)")}
                  </label>
                  <Input
                    type="number"
                    value={form.weight_lbs}
                    onChange={(e) =>
                      setForm({ ...form, weight_lbs: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Miles", "मील")}
                  </label>
                  <Input
                    type="number"
                    value={form.miles}
                    onChange={(e) =>
                      setForm({ ...form, miles: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Rate (₹)", "रेट (₹)")}
                  </label>
                  <Input
                    type="number"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Fuel Surcharge (₹)", "फ्यूल सर्चार्ज (₹)")}
                  </label>
                  <Input
                    type="number"
                    value={form.fuel_surcharge}
                    onChange={(e) =>
                      setForm({ ...form, fuel_surcharge: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Detention (₹)", "डिटेनशन (₹)")}
                  </label>
                  <Input
                    type="number"
                    value={form.detention}
                    onChange={(e) =>
                      setForm({ ...form, detention: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">
                    {t("Notes", "नोट")}
                  </label>
                  <Input
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  {t("Cancel", "रद्द करें")}
                </Button>
                <Button
                  type="submit"
                  className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {t("Save Template", "टेम्पलेट सहेजें")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
          placeholder={t("Search templates...", "टेम्पलेट खोजें...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("Loading templates...", "टेम्पलेट लोड हो रहे हैं...")}
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("No templates found", "कोई टेम्पलेट नहीं मिला")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tmpl) => (
            <Card
              key={tmpl.id}
              className="border-0 bg-card/50 backdrop-blur-sm shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{tmpl.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tmpl.origin_city} → {tmpl.destination_city} ·{" "}
                        {tmpl.miles} mi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {tmpl.usage_count}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {t("Commodity", "माल")}
                    </p>
                    <p className="font-medium text-xs">{tmpl.commodity}</p>
                  </div>
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {t("Weight", "वजन")}
                    </p>
                    <p className="font-medium text-xs">
                      {tmpl.weight_lbs.toLocaleString()} lbs
                    </p>
                  </div>
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {t("Rate", "रेट")}
                    </p>
                    <p className="font-medium text-xs">
                      ₹{tmpl.rate.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {t("Total", "कुल")}
                    </p>
                    <p className="font-medium text-xs">
                      ₹
                      {(
                        tmpl.rate +
                        tmpl.fuel_surcharge +
                        tmpl.detention
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {tmpl.pickup_date
                      ? `${t("Pickup", "पिकअप")}: ${tmpl.pickup_date}`
                      : ""}
                    {tmpl.delivery_date
                      ? ` · ${t("Delivery", "डिलीवरी")}: ${tmpl.delivery_date}`
                      : ""}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => {
                        const orgId = session.user?.organizationId;
                        if (!orgId) return;
                        createLoadTemplate(session, {
                          ...tmpl,
                          usage_count: tmpl.usage_count + 1,
                          organization_id: String(orgId),
                        } as any);
                        loadTemplates();
                      }}
                    >
                      <Copy className="w-3 h-3" /> {t("Use", "उपयोग")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-rose-500"
                      onClick={() => handleDelete(tmpl.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
