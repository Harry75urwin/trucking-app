import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Package,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { createLoad, uploadFileToR2 } from "@/lib/trucker-api";

type Step = 1 | 2 | 3;

export default function PostLoad() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState<{
    from: string;
    to: string;
    pickupDate: string;
    weight: string;
    goodsType: string;
    notes: string;
    budget: string;
    assignTo: "auction" | "fleet";
  }>({
    from: "",
    to: "",
    pickupDate: "",
    weight: "",
    goodsType: "",
    notes: "",
    budget: "",
    assignTo: "auction",
  });

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.from.trim()) errs.from = t("Required", "आवश्यक");
      if (!form.to.trim()) errs.to = t("Required", "आवश्यक");
      if (!form.pickupDate) errs.pickupDate = t("Required", "आवश्यक");
    } else if (step === 2) {
      if (!form.weight) errs.weight = t("Required", "आवश्यक");
      if (!form.goodsType.trim()) errs.goodsType = t("Required", "आवश्यक");
    } else if (step === 3) {
      if (!form.budget) errs.budget = t("Required", "आवश्यक");
      if (!form.notes.trim()) errs.notes = t("Required", "आवश्यक");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const next = () => validate() && step < 3 && setStep((s) => (s + 1) as Step);
  const prev = () => step > 1 && setStep((s) => (s - 1) as Step);
  const submit = async () => {
    const user = session.user;
    if (!validate() || !session.isAuthenticated || !user) return;
    setLoading(true);
    try {
      await createLoad(session, {
        load_number: `LD-${Date.now()}`,
        customer_id: String(user.organizationId ?? user.id),
        origin_city: form.from,
        origin_state: "",
        destination_city: form.to,
        destination_state: "",
        pickup_date: form.pickupDate || undefined,
        delivery_date: undefined,
        commodity: form.goodsType,
        weight_lbs: Number(form.weight) * 2204.62,
        miles: 0,
        rate: Number(form.budget),
        fuel_surcharge: 0,
        detention: 0,
        total_revenue: Number(form.budget),
        notes: form.notes || undefined,
        imageUrls,
        status: "pending",
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadFileToR2(session, file, "load");
      setImageUrls((prev) => [...prev, imageUrl]);
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (imageUrl: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== imageUrl));
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full text-center border-0 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-10 pb-10 space-y-5">
            <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">
              {t("Load Posted!", "लोड पोस्ट हो गया!")}
            </h2>
            <p className="text-muted-foreground">
              {t(
                "Truckers will start bidding soon. You`ll be notified.",
                "ट्रकर जल्द ही बोली लगाना शुरू करेंगे। आपको सूचित किया जाएगा।"
              )}
            </p>
            <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 text-left">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {form.from || "—"} → {form.to || "—"}
                  </p>
                  <p>
                    {t("Weight", "वजन")}:{" "}
                    {form.weight ? `${form.weight}T` : "—"} &nbsp;·&nbsp;{" "}
                    {t("Budget", "बजट")}: ₹{form.budget || "—"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md"
              onClick={() => setSubmitted(false)}
            >
              {t("Post Another", "और पोस्ट करें")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stepTitle =
    step === 1
      ? t("Route Details", "मार्ग विवरण")
      : step === 2
        ? t("Load Details", "लोड विवरण")
        : t("Budget", "बजट");
  const stepSub =
    step === 1
      ? "Where should we pick up and deliver?"
      : step === 2
        ? "What are you shipping?"
        : "What`s your maximum budget?";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Post a Load", "लोड पोस्ट करें")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Fill in details to get truckers to bid",
            "ट्रकरों से बोली पाने के लिए विवरण भरें"
          )}
        </p>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 flex-1 rounded-full transition-colors duration-500 ${s <= step ? "bg-linear-to-r from-indigo-500 to-purple-500" : "bg-muted"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>
              {t("Route", "मार्ग")}
            </span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>
              {t("Load", "लोड")}
            </span>
            <span className={step >= 3 ? "text-primary font-medium" : ""}>
              {t("Budget", "बजट")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${step === 1 ? "bg-linear-to-br from-indigo-500 to-purple-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              1
            </span>
            {stepTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground pl-9">{stepSub}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("Pickup Location", "पिकअप स्थान")}
                  </Label>
                  <Input
                    name="from"
                    value={form.from}
                    onChange={handleField}
                    placeholder={t("Mumbai, Maharashtra", "मुंबई, महाराष्ट्र")}
                    className={errors.from ? "border-destructive" : ""}
                  />
                  {errors.from && (
                    <p className="text-xs text-destructive">{errors.from}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("Delivery Location", "डिलीवरी स्थान")}
                  </Label>
                  <Input
                    name="to"
                    value={form.to}
                    onChange={handleField}
                    placeholder={t("Delhi, Delhi", "दिल्ली, नई दिल्ली")}
                    className={errors.to ? "border-destructive" : ""}
                  />
                  {errors.to && (
                    <p className="text-xs text-destructive">{errors.to}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Pickup Date", "पिकअप तारीख")}
                </Label>
                <Input
                  name="pickupDate"
                  type="date"
                  value={form.pickupDate}
                  onChange={handleField}
                  className={errors.pickupDate ? "border-destructive" : ""}
                />
                {errors.pickupDate && (
                  <p className="text-xs text-destructive">
                    {errors.pickupDate}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("Weight (tons)", "वजन (टन)")}
                  </Label>
                  <Input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleField}
                    placeholder="25"
                    className={errors.weight ? "border-destructive" : ""}
                  />
                  {errors.weight && (
                    <p className="text-xs text-destructive">{errors.weight}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("Goods Type", "माल का प्रकार")}
                  </Label>
                  <Input
                    name="goodsType"
                    value={form.goodsType}
                    onChange={handleField}
                    placeholder={t(
                      "Electronics, Textiles...",
                      "इलेक्ट्रॉनिक्स, कपड़ा..."
                    )}
                    className={errors.goodsType ? "border-destructive" : ""}
                  />
                  {errors.goodsType && (
                    <p className="text-xs text-destructive">
                      {errors.goodsType}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Additional Notes", "अतिरिक्त नोट")}
                </Label>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleField}
                  rows={3}
                  placeholder={t(
                    "Special handling requirements...",
                    "विशेष हैंडलिंग आवश्यकताएं..."
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Load Images", "लोड छवियां")}
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => void uploadImage(e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t("Upload Images", "छवियां अपलोड करें")}
                  </Button>
                </div>
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imageUrls.map((imageUrl) => (
                      <div key={imageUrl} className="relative">
                        <img
                          src={imageUrl}
                          alt="load"
                          className="h-20 w-full rounded-lg object-cover border bg-muted"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(imageUrl)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Max Budget (₹)", "अधिकतम बजट (₹)")}
                </Label>
                <Input
                  name="budget"
                  type="number"
                  value={form.budget}
                  onChange={handleField}
                  placeholder="40000"
                  className={errors.budget ? "border-destructive" : ""}
                />
                {errors.budget && (
                  <p className="text-xs text-destructive">{errors.budget}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t(
                    "Truckers will bid below this amount",
                    "ट्रकर इस राशि से कम में बोली लगाएंगे"
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prev}
          className={step === 1 ? "invisible" : ""}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("Back", "पीछे")}
        </Button>
        {step < 3 ? (
          <Button
            onClick={next}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
          >
            {t("Next", "आगे")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => void submit()}
            disabled={loading}
            className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
          >
            {t("Post Load for Bidding", "बोली के लिए लोड पोस्ट करें")}
          </Button>
        )}
      </div>
    </div>
  );
}
