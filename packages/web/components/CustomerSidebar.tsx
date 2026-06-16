import {
  ShoppingCart,
  Package,
  MapPin,
  DollarSign,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function CustomerSidebar() {
  const { t } = useLanguage();
  const { logout } = useAuthSession();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r-0 sidebar-modern">
      <SidebarHeader className="flex items-center gap-3 px-4 py-6">
        <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg">
          <ShoppingCart className="size-5 text-white" />
        </div>
        <span className="gradient-text font-bold text-lg">
          {t("CustomerPanel", "ग्राहकपैनल")}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Main", "मुख्य")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/dashboard">
                  <ShoppingCart className="size-4" />
                  <span>{t("Dashboard", "डैशबोर्ड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Operations", "संचालन")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/post-load">
                  <Package className="size-4" />
                  <span>{t("Post Load", "लोड पोस्ट करें")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/loads">
                  <Package className="size-4" />
                  <span>{t("My Loads", "मेरे लोड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/tracking">
                  <MapPin className="size-4" />
                  <span>{t("Tracking", "ट्रैकिंग")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/chat">
                  <MessageSquare className="size-4" />
                  <span>{t("Messages", "संदेश")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customer/payments">
                  <DollarSign className="size-4" />
                  <span>{t("Payments", "भुगतान")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="size-4" />
                <span>{t("Settings", "सेटिंग")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                logout();
                void navigate("/login");
              }}
            >
              <LogOut className="size-4" />
              <span>{t("Log out", "लॉगआउट")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
