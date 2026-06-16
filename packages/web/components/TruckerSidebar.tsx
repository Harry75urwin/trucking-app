import {
  Truck,
  Package,
  DollarSign,
  Settings,
  LogOut,
  TrendingUp,
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

export function TruckerSidebar() {
  const { t } = useLanguage();
  const { logout } = useAuthSession();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r-0 sidebar-modern">
      <SidebarHeader className="flex items-center gap-3 px-4 py-6">
        <div className="flex items-center gap-3 font-bold">
          <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Truck className="size-5 text-white" />
          </div>
          <span className="gradient-text text-lg">
            {t("TruckNetwork", "ट्रकनेटवर्क")}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Main", "मुख्य")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/trucker/dashboard">
                  <Truck className="size-4" />
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
                <Link to="/trucker/loads">
                  <Package className="size-4" />
                  <span>{t("My Loads", "मेरे लोड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/trucker/bidding">
                  <TrendingUp className="size-4" />
                  <span>{t("Bidding", "नीलामी")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/trucker/vehicles">
                  <Truck className="size-4" />
                  <span>{t("My Vehicles", "मेरे वाहन")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/trucker/earnings">
                  <DollarSign className="size-4" />
                  <span>{t("Earnings", "कमाई")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/trucker/chat">
                  <MessageSquare className="size-4" />
                  <span>{t("Messages", "संदेश")}</span>
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
                navigate("/login");
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
