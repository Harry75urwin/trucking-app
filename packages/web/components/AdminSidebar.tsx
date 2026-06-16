import {
  Shield,
  Users,
  Package,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  MessageSquare,
  Building2,
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

export function AdminSidebar() {
  const { t } = useLanguage();
  const { logout } = useAuthSession();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r-0 sidebar-modern">
      <SidebarHeader className="flex items-center gap-3 px-4 py-6">
        <div className="p-2 rounded-xl bg-linear-to-br from-rose-500 to-pink-600 shadow-lg">
          <Shield className="size-5 text-white" />
        </div>
        <span className="gradient-text font-bold text-lg">
          {t("AdminPanel", "एडमिनपैनल")}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("Administration", "प्रशासन")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/dashboard">
                  <Shield className="size-4" />
                  <span>{t("Dashboard", "डैशबोर्ड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/users">
                  <Users className="size-4" />
                  <span>{t("Users", "उपयोगकर्ता")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/organizations">
                  <Building2 className="size-4" />
                  <span>{t("Organizations", "संगठन")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/loads">
                  <Package className="size-4" />
                  <span>{t("Loads", "लोड प्रबंधन")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/disputes">
                  <AlertTriangle className="size-4" />
                  <span>{t("Disputes", "विवाद")}</span>
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
                <Link to="/admin/analytics">
                  <BarChart3 className="size-4" />
                  <span>{t("Analytics", "विश्लेषण")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/reports">
                  <FileText className="size-4" />
                  <span>{t("Reports", "रिपोर्ट")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/chat">
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
