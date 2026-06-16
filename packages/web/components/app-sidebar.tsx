import {
  Truck,
  LayoutDashboard,
  Package,
  Users,
  Zap,
  TrendingUp,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useLanguage();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4 py-6">
        <div className="flex items-center gap-2 font-semibold">
          <Truck className="size-5 text-primary" />
          <span>FleetOps</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Main", "मुख्य")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <LayoutDashboard className="size-4" />
                  <span>{t("Dashboard", "डैशबोर्ड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dispatch">
                  <Zap className="size-4" />
                  <span>{t("Dispatch Board", "डिस्पैच बोर्ड")}</span>
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
                <Link to="/loads">
                  <Package className="size-4" />
                  <span>{t("Loads", "लोड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/drivers">
                  <Users className="size-4" />
                  <span>{t("Drivers", "चालक")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/fleet">
                  <Truck className="size-4" />
                  <span>{t("Fleet", "बेड़ा")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/customers">
                  <Building2 className="size-4" />
                  <span>{t("Customers", "ग्राहक")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("Analytics", "विश्लेषण")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/reports">
                  <TrendingUp className="size-4" />
                  <span>{t("Reports", "रिपोर्ट")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
