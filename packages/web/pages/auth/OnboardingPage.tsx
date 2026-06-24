import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import {
  signupWithBackend,
  type BackendSignupPayload,
} from "@/lib/backend-api";
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
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    email: "",
    homeCity: "",
    homeState: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyPostalCode: "",
    companyWebsite: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerState: "",
    customerPostalCode: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminAddress: "",
    adminCity: "",
    adminState: "",
    adminPostalCode: "",
  });
  const { t } = useLanguage();

  const validateStep = (): string => {
    if (step === 1) {
      if (type === "trucker") {
        if (!formData.fullName.trim())
          return t("Full Name is required", "पूरा नाम आवश्यक है");
        if (!formData.phone.trim())
          return t("Phone is required", "फोन आवश्यक है");
        if (!formData.email.trim())
          return t("Email is required", "ईमेल आवश्यक है");
      } else if (type === "company") {
        if (!formData.companyName.trim())
          return t("Company Name is required", "कंपनी का नाम आवश्यक है");
        if (!formData.companyEmail.trim())
          return t("Company Email is required", "कंपनी ईमेल आवश्यक है");
        if (!formData.companyPhone.trim())
          return t("Company Phone is required", "कंपनी फोन आवश्यक है");
      } else if (type === "customer") {
        if (!formData.customerName.trim())
          return t("Customer Name is required", "ग्राहक का नाम आवश्यक है");
        if (!formData.customerEmail.trim())
          return t("Customer Email is required", "ग्राहक ईमेल आवश्यक है");
        if (!formData.customerPhone.trim())
          return t("Customer Phone is required", "ग्राहक फोन आवश्यक है");
      } else if (type === "admin") {
        if (!formData.adminName.trim())
          return t("Admin Name is required", "एडमिन नाम आवश्यक है");
        if (!formData.adminEmail.trim())
          return t("Admin Email is required", "एडमिन ईमेल आवश्यक है");
        if (!formData.adminPhone.trim())
          return t("Admin Phone is required", "एडमिन फोन आवश्यक है");
      }
    } else if (step === 2) {
      if (type === "company") {
        if (!formData.companyAddress.trim())
          return t("Company Address is required", "कंपनी पता आवश्यक है");
        if (!formData.companyCity.trim())
          return t("City is required", "शहर आवश्यक है");
        if (!formData.companyState.trim())
          return t("State is required", "राज्य आवश्यक है");
        if (!formData.companyPostalCode.trim())
          return t("Postal Code is required", "पिन कोड आवश्यक है");
      } else if (type === "customer") {
        if (!formData.customerAddress.trim())
          return t("Address is required", "पता आवश्यक है");
        if (!formData.customerCity.trim())
          return t("City is required", "शहर आवश्यक है");
        if (!formData.customerState.trim())
          return t("State is required", "राज्य आवश्यक है");
        if (!formData.customerPostalCode.trim())
          return t("Postal Code is required", "पिन कोड आवश्यक है");
      } else if (type === "admin") {
        if (!formData.adminAddress.trim())
          return t("Address is required", "पता आवश्यक है");
        if (!formData.adminCity.trim())
          return t("City is required", "शहर आवश्यक है");
        if (!formData.adminState.trim())
          return t("State is required", "राज्य आवश्यक है");
        if (!formData.adminPostalCode.trim())
          return t("Postal Code is required", "पिन कोड आवश्यक है");
      }
    }
    return "";
  };

  const handleNext = () => {
    if (step < 3) {
      const validationError = validateStep();
      if (validationError) {
        setError(validationError);
        return;
      }
      setError("");
      setStep(step + 1);
    } else {
      void handleRegister();
    }
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
      if (!formData.password.trim()) {
        throw new Error(t("Password is required", "पासवर्ड आवश्यक है"));
      }

      const role = resolveBackendRole(type);
      const isCompany = role === "dispatcher";
      const isCustomer = role === "customer";
      const isAdmin = role === "admin";

      const signupPayload: BackendSignupPayload = {
        firstName:
          isCompany && formData.companyName
            ? formData.companyName.split(" ")[0] || "User"
            : isCustomer && formData.customerName
              ? formData.customerName.split(" ")[0] || "User"
              : isAdmin && formData.adminName
                ? formData.adminName.split(" ")[0] || "User"
                : formData.fullName?.split(" ")[0] || "User",
        lastName:
          isCompany && formData.companyName
            ? formData.companyName.split(" ").slice(1).join(" ") || "User"
            : isCustomer && formData.customerName
              ? formData.customerName.split(" ").slice(1).join(" ") || "User"
              : isAdmin && formData.adminName
                ? formData.adminName.split(" ").slice(1).join(" ") || "User"
                : formData.fullName?.split(" ").slice(1).join(" ") || "User",
        email: isCompany
          ? formData.companyEmail
          : isCustomer
            ? formData.customerEmail
            : isAdmin
              ? formData.adminEmail
              : formData.email,
        password: formData.password,
        phoneNumber: isCompany
          ? formData.companyPhone
          : isCustomer
            ? formData.customerPhone
            : isAdmin
              ? formData.adminPhone
              : formData.phone,
        role,
      };

      if (isCompany) {
        signupPayload.organizationName = formData.companyName;
        signupPayload.organizationEmail = formData.companyEmail;
        signupPayload.organizationPhoneNumber = formData.companyPhone;
        signupPayload.organizationWebsite = formData.companyWebsite;
        signupPayload.organizationAddress = formData.companyAddress;
        signupPayload.organizationCity = formData.companyCity;
        signupPayload.organizationState = formData.companyState;
        signupPayload.organizationPostalCode = formData.companyPostalCode;
      }

      if (isCustomer) {
        signupPayload.organizationName = formData.customerName;
        signupPayload.organizationEmail = formData.customerEmail;
        signupPayload.organizationPhoneNumber = formData.customerPhone;
        signupPayload.organizationAddress = formData.customerAddress;
        signupPayload.organizationCity = formData.customerCity;
        signupPayload.organizationState = formData.customerState;
        signupPayload.organizationPostalCode = formData.customerPostalCode;
      }

      const session = await signupWithBackend(signupPayload);
      onComplete(session);
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : t("Registration failed", "पंजीकरण विफल")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        { num: 3, label: t("Security", "सुरक्षा") },
      ],
    },
    company: {
      title: t("Company Registration", "कंपनी पंजीकरण"),
      steps: [
        { num: 1, label: t("Company Info", "कंपनी जानकारी") },
        { num: 2, label: t("Address", "पता") },
        { num: 3, label: t("Security", "सुरक्षा") },
      ],
    },
    customer: {
      title: t("Customer Registration", "ग्राहक पंजीकरण"),
      steps: [
        { num: 1, label: t("Personal Info", "व्यक्तिगत जानकारी") },
        { num: 2, label: t("Address", "पता") },
        { num: 3, label: t("Security", "सुरक्षा") },
      ],
    },
    admin: {
      title: t("Admin Registration", "एडमिन पंजीकरण"),
      steps: [
        { num: 1, label: t("Admin Info", "एडमिन जानकारी") },
        { num: 2, label: t("Address", "पता") },
        { num: 3, label: t("Security", "सुरक्षा") },
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
            {step === 1 && type === "trucker" && (
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
                    <Label>{t("Home City", "होम सहर")}</Label>
                    <Input
                      name="homeCity"
                      value={formData.homeCity}
                      onChange={handleInputChange}
                      placeholder={t("Mumbai", "मुंबई")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Home State", "होम राज्य")}</Label>
                    <Input
                      name="homeState"
                      value={formData.homeState}
                      onChange={handleInputChange}
                      placeholder={t("Maharashtra", "महाराष्ट्र")}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && type === "company" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Company Name", "कंपनी का नाम")}</Label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={t(
                      "Fast Cargo Logistics",
                      "फास्ट कार्गो लॉजिस्टिक्स"
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Company Email", "कंपनी ईमेल")}</Label>
                    <Input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="ops@fastcargo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Company Phone", "कंपनी फोन")}</Label>
                    <Input
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Company Website", "कंपनी वेबसाइट")}</Label>
                  <Input
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://fastcargo.com"
                  />
                </div>
              </div>
            )}

            {step === 1 && type === "customer" && (
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
              </div>
            )}

            {step === 1 && type === "admin" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Admin Name", "एडमिन नाम")}</Label>
                    <Input
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      placeholder={t("Admin User", "एडमिन यूजर")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Phone", "फोन")}</Label>
                    <Input
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Email", "ईमेल")}</Label>
                  <Input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            )}

            {step === 2 && type === "trucker" && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    {t("Upload your documents", "अपने दस्तावेज़ अपलोड करें")}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all">
                    <p className="text-muted-foreground">
                      {t("CDL License", "सीडीएल लाइसेंस")}
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all">
                    <p className="text-muted-foreground">
                      {t("Insurance", "बीमा")}
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all">
                    <p className="text-muted-foreground">
                      {t("Medical Certificate", "चिकित्सा सर्टिफिकेट")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && type === "company" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Company Address", "कंपनी पता")}</Label>
                  <Input
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    placeholder={t("42 Business Road", "42 बिज़नेस रोड")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("City", "शहर")}</Label>
                    <Input
                      name="companyCity"
                      value={formData.companyCity}
                      onChange={handleInputChange}
                      placeholder={t("Bengaluru", "बेंगलुरु")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("State", "राज्य")}</Label>
                    <Input
                      name="companyState"
                      value={formData.companyState}
                      onChange={handleInputChange}
                      placeholder={t("Karnataka", "कर्नाटक")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Postal Code", "पिन कोड")}</Label>
                  <Input
                    name="companyPostalCode"
                    value={formData.companyPostalCode}
                    onChange={handleInputChange}
                    placeholder="560001"
                  />
                </div>
              </div>
            )}

            {step === 2 && type === "customer" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Business Name", "व्यावसायिक नाम")}</Label>
                  <Input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder={t("ABC Corp", "एबीसी कार्पोरेशन")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("Business Email", "व्यावसायिक ईमेल")}</Label>
                  <Input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="contact@abccorp.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("Business Phone", "व्यावसायिक फोन")}</Label>
                  <Input
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("Address", "पता")}</Label>
                  <Input
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    placeholder={t("123 Main Street", "123 मेन स्ट्रीट")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("City", "शहर")}</Label>
                    <Input
                      name="customerCity"
                      value={formData.customerCity}
                      onChange={handleInputChange}
                      placeholder={t("Mumbai", "मुंबई")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("State", "राज्य")}</Label>
                    <Input
                      name="customerState"
                      value={formData.customerState}
                      onChange={handleInputChange}
                      placeholder={t("Maharashtra", "महाराष्ट्र")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Postal Code", "पिन कोड")}</Label>
                  <Input
                    name="customerPostalCode"
                    value={formData.customerPostalCode}
                    onChange={handleInputChange}
                    placeholder="400001"
                  />
                </div>
              </div>
            )}

            {step === 2 && type === "admin" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Address", "पता")}</Label>
                  <Input
                    name="adminAddress"
                    value={formData.adminAddress}
                    onChange={handleInputChange}
                    placeholder={t("123 Admin Street", "123 एडमिन स्ट्रीट")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("City", "शहर")}</Label>
                    <Input
                      name="adminCity"
                      value={formData.adminCity}
                      onChange={handleInputChange}
                      placeholder={t("Mumbai", "मुंबई")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("State", "राज्य")}</Label>
                    <Input
                      name="adminState"
                      value={formData.adminState}
                      onChange={handleInputChange}
                      placeholder={t("Maharashtra", "महाराष्ट्र")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("Postal Code", "पिन कोड")}</Label>
                  <Input
                    name="adminPostalCode"
                    value={formData.adminPostalCode}
                    onChange={handleInputChange}
                    placeholder="400001"
                  />
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
                {type === "trucker" && (
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      {t(
                        "Bank account details (optional)",
                        "बैंक खाता विवरण (वैकल्पिक)"
                      )}
                    </p>
                  </div>
                )}
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
