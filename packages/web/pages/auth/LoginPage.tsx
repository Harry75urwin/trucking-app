import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, Building2, ShoppingCart, Shield } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language-context";
import { loginWithBackend } from "@/lib/backend-api";
import type { AuthSession } from "@/lib/auth-session";

interface LoginPageProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<string>("trucker");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const userTypes = [
    {
      id: "trucker",
      name: t("Trucker", "ट्रकर (Trucker)"),
      icon: Truck,
      description: t(
        "Individual truck owner or driver",
        "व्यक्तिगत ट्रक मालिक या चालक"
      ),
    },
    {
      id: "company",
      name: t("Company", "कंपनी (Company)"),
      icon: Building2,
      description: t("Large fleet company", "बड़ी फ्लीट कंपनी"),
    },
    {
      id: "customer",
      name: t("Customer", "ग्राहक (Customer)"),
      icon: ShoppingCart,
      description: t("Shipper/Consignment provider", "शिपर/कंसाइनमेंट प्रदाता"),
    },
    {
      id: "admin",
      name: t("Admin", "एडमिन (Admin)"),
      icon: Shield,
      description: t("Platform administrator", "प्लेटफॉर्म प्रशासक"),
    },
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const session = await loginWithBackend({
        phoneNumber: phone,
        password,
      });
      onLoginSuccess(session);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : t("Login failed", "लॉगिन विफल")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
      {/* Language Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-10">
        <div className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/30 dark:border-slate-700/30">
          <LanguageToggle />
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">
              {t("Truck Network", "ट्रक नेटवर्क")}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t("Smart Transportation Platform", "स्मार्ट परिवहन प्लेटफॉर्म")}
          </p>
        </div>

        <Card className="shadow-xl border-0 glass-card">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl gradient-text">
              {t("Welcome Back", "वापस स्वागत है")}
            </CardTitle>
            <CardDescription className="text-base">
              {t(
                "Select your role and sign in to your account",
                "अपनी भूमिका चुनें और अपने खाते में साइन इन करें"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                void handleLogin();
              }}
            >
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("Who are you?", "आप कौन हैं?")}
                </Label>
                <RadioGroup value={userType} onValueChange={setUserType}>
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    const gradients: Record<string, string> = {
                      trucker: "from-blue-500 to-indigo-600",
                      company: "from-purple-500 to-violet-600",
                      customer: "from-emerald-500 to-teal-600",
                      admin: "from-rose-500 to-pink-600",
                    };
                    return (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2 mb-3"
                      >
                        <RadioGroupItem value={type.id} id={type.id} />
                        <Label
                          htmlFor={type.id}
                          className="flex-1 cursor-pointer flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div
                            className={`p-2 rounded-lg bg-linear-to-br ${gradients[type.id] || "from-gray-500 to-gray-600"}`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {type.description}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t("Phone Number", "फोन नंबर")}</Label>
                <Input
                  id="phone"
                  placeholder={t("+91 98765 43210", "+91 98765 43210")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "पासवर्ड")}</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !phone || !password}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                size="lg"
              >
                {isLoading
                  ? t("Signing in...", "साइन इन हो रहे हैं...")
                  : t("Login", "लॉगिन करें")}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-muted-foreground">
                {t("Don't have an account?", "खाता नहीं है?")}{" "}
                <a
                  href={`/onboarding/${userType}`}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 font-medium"
                >
                  {t("Register", "रजिस्टर करें")}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-900">
          <CardContent className="pt-6">
            <p className="text-sm text-indigo-900 dark:text-indigo-200">
              💡{" "}
              {t(
                "Use any credentials for demo",
                "डेमो के लिए किसी भी क्रेडेंशियल का उपयोग करें"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
