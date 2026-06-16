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
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShieldCheck, Save } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function SecuritySettingsPage() {
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
          <h1 className="text-3xl font-bold">{t("Security", "सुरक्षा")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Manage passwords and sign-in protection",
              "पासवर्ड और साइन-इन सुरक्षा प्रबंधित करें"
            )}
          </p>
        </div>
      </div>

      <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-pink-600">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <CardTitle>{t("Security", "सुरक्षा")}</CardTitle>
          </div>
          <CardDescription>
            {t(
              "Control authentication and access tools",
              "प्रमाणीकरण और एक्सेस टूल्स नियंत्रित करें"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert(t("Security updated", "सुरक्षा अपडेट हो गई"));
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                {t("Current Password", "वर्तमान पासवर्ड")}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder={t(
                  "Enter current password",
                  "वर्तमान पासवर्ड दर्ज करें"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                {t("New Password", "नया पासवर्ड")}
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder={t("Enter new password", "नया पासवर्ड दर्ज करें")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("Confirm New Password", "नया पासवर्ड पुष्टि करें")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t(
                  "Confirm new password",
                  "नया पासवर्ड पुष्टि करें"
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="gap-2 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                <Save className="w-4 h-4" />{" "}
                {t("Update Password", "पासवर्ड अपडेट करें")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
