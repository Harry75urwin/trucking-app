import { Bell, CheckCheck, Clock3, Package, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const notifications = [
  {
    icon: Package,
    tone: "text-blue-600",
    en: "New load assigned",
    hi: "नया लोड असाइन हुआ",
    meta: "2m ago",
  },
  {
    icon: Clock3,
    tone: "text-orange-600",
    en: "Pickup is due soon",
    hi: "पिकअप जल्द होने वाला है",
    meta: "15m ago",
  },
  {
    icon: AlertCircle,
    tone: "text-red-600",
    en: "Action required on a load",
    hi: "एक लोड पर कार्रवाई आवश्यक है",
    meta: "1h ago",
  },
];

export function NotificationDrawer() {
  const { t } = useLanguage();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("Open notifications", "सूचनाएं खोलें")}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4 pt-2">
        <DrawerHeader className="px-0">
          <DrawerTitle>{t("Notifications", "सूचनाएं")}</DrawerTitle>
          <DrawerDescription>
            {t(
              "Recent updates across your account",
              "आपके खाते के हालिया अपडेट",
            )}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.en}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Icon className={`mt-0.5 h-4 w-4 ${notification.tone}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t(notification.en, notification.hi)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.meta}
                  </p>
                </div>
                <CheckCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
