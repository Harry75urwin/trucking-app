import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { signupWithBackend } from "@/lib/backend-api";
import type { AuthSession } from "@/lib/auth-session";
import { useLanguage } from "@/lib/language-context";

interface OnboardingPageProps {
  onComplete: (session: AuthSession) => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { type } = useParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
  });
  const { t } = useLanguage();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      void handleRegister();
    }
  };

  const splitName = (fullName: string) => {
    const trimmedName = fullName.trim().replace(/\s+/g, " ");
    const [firstName, ...rest] = trimmedName.split(" ");
    return {
      firstName: firstName || "User",
      lastName: rest.join(" ") || "User",
    };
  };

  const resolveBackendRole = (frontendType: string | undefined) => {
    switch (frontendType) {
      case "trucker":
        return "driver";
      case "company":
        return "dispatcher";
      case "customer":
        return "customer";
      case "admin":
        return "admin";
      default:
        return "driver";
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error(t("Passwords do not match", "पासवर्ड मेल नहीं खाते"));
      }

      const { firstName, lastName } = splitName(formData.fullName);
      const session = await signupWithBackend({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        role: resolveBackendRole(type),
      });
      onComplete(session);
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : t("Registration failed", "पंजीकरण विफल"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roleContent = {
    trucker: {
      title: t("Trucker Registration", "ट्रकर पंजीकरण"),
      steps: [
        { num: 1, label: t("Personal Info", "व्यक्तिगत जानकारी") },
        { num: 2, label: t("Documents", "दस्तावेज़") },
        { num: 3, label: t("Bank Details", "बैंक विवरण") },
      ],
    },
    company: {
      title: t("Company Registration", "कंपनी पंजीकरण"),
      steps: [
        { num: 1, label: t("Company Info", "कंपनी जानकारी") },
        { num: 2, label: t("Verification", "प्रमाणीकरण") },
        { num: 3, label: t("Bank Details", "बैंक विवरण") },
      ],
    },
    customer: {
      title: t("Customer Registration", "ग्राहक पंजीकरण"),
      steps: [
        { num: 1, label: t("Personal Info", "व्यक्तिगत जानकारी") },
        { num: 2, label: t("Business Info", "व्यावसायिक जानकारी") },
        { num: 3, label: t("Address", "पता") },
      ],
    },
  };

  const content =
    roleContent[type as keyof typeof roleContent] || roleContent.trucker;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 glass-card">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">
              {content.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step indicator */}
            <div className="flex justify-between mb-8">
              {content.steps.map((s) => (
                <div
                  key={s.num}
                  className={`flex flex-col items-center gap-2 flex-1 ${s.num !== content.steps.length ? "pb-4" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s.num
                        ? "bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className="text-xs text-center text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step content */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Full Name", "पूरा नाम")}</Label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t("John Doe", "जॉन डो")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Phone", "फोन")}</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Email", "ईमेल")}</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("City", "शहर")}</Label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={t("Mumbai", "मुंबई")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("State", "राज्य")}</Label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder={t("Maharashtra", "महाराष्ट्र")}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    {t("Upload your documents", "अपने दस्तावेज़ अपलोड करें")}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all">
                    <p className="text-muted-foreground">
                      {t("License", "लाइसेंस")}
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all">
                    <p className="text-muted-foreground">
                      {t("Insurance", "बीमा")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Password", "पासवर्ड")}</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("Confirm Password", "पासवर्ड की पुष्टि करें")}
                  </Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  {t("Previous", "पिछला")}
                </Button>
              )}
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleNext}
                className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              >
                {isLoading
                  ? "..."
                  : step === 3
                    ? t("Register", "रजिस्टर करें")
                    : t("Next", "अगला")}
              </Button>
            </div>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
