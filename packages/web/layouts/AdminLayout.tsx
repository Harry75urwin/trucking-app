import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NotificationDrawer } from "@/components/NotificationDrawer";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-context";

export default function AdminLayout() {
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-6 header-gradient">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-lg font-semibold gradient-text">
              {t("Admin Panel", "एडमिन पैनल")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationDrawer />
            <LanguageToggle />
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
