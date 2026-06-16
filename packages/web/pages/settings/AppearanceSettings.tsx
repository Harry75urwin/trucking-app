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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MoonStar, Save } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AppearanceSettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void navigate("/settings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("Appearance", "दिखावट")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Control theme and display preferences",
              "थीम और प्रदर्शन प्राथमिकताएं नियंत्रित करें"
            )}
          </p>
        </div>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
              <MoonStar className="h-4 w-4 text-white" />
            </div>
            <CardTitle>{t("Appearance", "दिखावट")}</CardTitle>
          </div>
          <CardDescription>
            {t("Customize how the app looks", "एप के स्वरूप को अनुकूलित करें")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t("Theme", "थीम")}</Label>
            <RadioGroup defaultValue="system" className="gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex-1 cursor-pointer">
                  {t("Light", "लाइट")}
                </Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex-1 cursor-pointer">
                  {t("Dark", "डार्क")}
                </Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex-1 cursor-pointer">
                  {t("System", "सिस्टम")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{t("Accent Color", "एक्सेंट रंग")}</Label>
            <RadioGroup defaultValue="indigo" className="gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="indigo" id="indigo" />
                <Label htmlFor="indigo" className="flex-1 cursor-pointer">
                  {t("Indigo", "इंडिगो")}
                </Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="emerald" id="emerald" />
                <Label htmlFor="emerald" className="flex-1 cursor-pointer">
                  {t("Emerald", "एमरल्ड")}
                </Label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <RadioGroupItem value="rose" id="rose" />
                <Label htmlFor="rose" className="flex-1 cursor-pointer">
                  {t("Rose", "गुलाबी")}
                </Label>
              </div>
            </RadioGroup>
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
