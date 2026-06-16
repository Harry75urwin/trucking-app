import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Save } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function NotificationSettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {t("Notifications", "सूचनाएं")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Choose what alerts you receive",
              "चुनें कि आपको कौन-सी सूचनाएं मिलें",
            )}
          </p>
        </div>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <CardTitle>{t("Notifications", "सूचनाएं")}</CardTitle>
          </div>
          <CardDescription>
            {t(
              "Manage how you receive notifications",
              "सूचनाएं कैसे प्राप्त करें, यह प्रबंधित करें",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div>
              <p className="font-medium">
                {t("Push Notifications", "पुश सूचनाएं")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Receive push alerts in-app",
                  "इन-ऐप पुश अलर्ट प्राप्त करें",
                )}
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div>
              <p className="font-medium">
                {t("Email Notifications", "ईमेल सूचनाएं")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Receive updates via email",
                  "ईमेल के माध्यम से अपडेट प्राप्त करें",
                )}
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div>
              <p className="font-medium">
                {t("SMS Notifications", "एसएमएस सूचनाएं")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("Receive SMS alerts", "एसएमएस अलर्ट प्राप्त करें")}
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4" />{" "}
              {t("Save Preferences", "प्राथमिकताएं सहेजें")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
