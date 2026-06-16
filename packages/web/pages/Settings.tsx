import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, MoonStar, ShieldCheck, UserCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuthSession();

  const sections = [
    {
      icon: UserCircle2,
      title: t("Profile", "प्रोफ़ाइल"),
      description: t(
        "Update your account identity and contact details",
        "अपनी खाता पहचान और संपर्क विवरण अपडेट करें"
      ),
      to: "/settings/profile",
    },
    {
      icon: Bell,
      title: t("Notifications", "सूचनाएं"),
      description: t(
        "Choose what alerts you receive",
        "चुनें कि आपको कौन-सी सूचनाएं मिलें"
      ),
      to: "/settings/notifications",
    },
    {
      icon: MoonStar,
      title: t("Appearance", "दिखावट"),
      description: t(
        "Control theme and display preferences",
        "थीम और प्रदर्शन प्राथमिकताएं नियंत्रित करें"
      ),
      to: "/settings/appearance",
    },
    {
      icon: ShieldCheck,
      title: t("Security", "सुरक्षा"),
      description: t(
        "Manage passwords and sign-in protection",
        "पासवर्ड और साइन-इन सुरक्षा प्रबंधित करें"
      ),
      to: "/settings/security",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Settings", "सेटिंग्स")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Manage your account, language, and preferences",
            "अपना खाता, भाषा और प्राथमिकताएं प्रबंधित करें"
          )}
        </p>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("Language", "भाषा")}</CardTitle>
          <CardDescription>
            {t(
              "Switch between English and Hindi across the app",
              "ऐप में अंग्रेजी और हिंदी के बीच स्विच करें"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              {t("Current selection", "वर्तमान चयन")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("English / Hindi", "अंग्रेजी / हिंदी")}
            </p>
          </div>
          <LanguageToggle />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Card
              key={`${section.title}-${idx}`}
              className="border-0 bg-linear-to-br from-muted/20 to-transparent dark:from-slate-800/30 hover:from-muted/40 transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full hover:bg-muted"
                  asChild
                >
                  <Link to={section.to}>{t("Manage", "प्रबंधित करें")}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-pink-600 shadow-md">
              <Lock className="h-4 w-4 text-white" />
            </div>
            {t("Session", "सत्र")}
          </CardTitle>
          <CardDescription>
            {t(
              "Review security and sign-out options",
              "सुरक्षा और साइन-आउट विकल्प देखें"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t(
              "Your last sign-in was recently verified.",
              "आपका पिछला साइन-इन हाल ही में सत्यापित हुआ था।"
            )}
          </p>
          <Button
            className="bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md"
            onClick={() => {
              logout();
              void navigate("/login");
            }}
          >
            {t("Sign Out", "साइन आउट")}
          </Button>
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        {t(
          "Language preference is stored locally in your browser.",
          "भाषा प्राथमिकता आपके ब्राउज़र में स्थानीय रूप से संग्रहीत है।"
        )}
      </p>
    </div>
  );
}
