import {
  Building2,
  Package,
  TrendingUp,
  Truck,
  Settings,
  LogOut,
  FileText,
  User,
  MessageSquare,
  Users,
  ClipboardList,
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

export function CompanySidebar() {
  const { t } = useLanguage();
  const { logout } = useAuthSession();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r-0 sidebar-modern">
      <SidebarHeader className="flex items-center gap-3 px-4 py-6">
        <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg">
          <Building2 className="size-5 text-white" />
        </div>
        <span className="gradient-text font-bold text-lg">
          {t("CompanyPanel", "कंपनीपैनल")}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Main", "मुख्य")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/dashboard">
                  <Building2 className="size-4" />
                  <span>{t("Dashboard", "डैशबोर्ड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/profile">
                  <User className="size-4" />
                  <span>{t("Public Profile", "सार्वजनिक प्रोफाइल")}</span>
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
                <Link to="/company/post-load">
                  <Package className="size-4" />
                  <span>{t("Post Load", "लोड पोस्ट करें")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/loads">
                  <Package className="size-4" />
                  <span>{t("My Loads", "मेरे लोड")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/bids">
                  <TrendingUp className="size-4" />
                  <span>{t("Bids", "बोलियां")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/fleet">
                  <Truck className="size-4" />
                  <span>{t("Fleet", "बेड़ा")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/dispatch">
                  <Truck className="size-4" />
                  <span>{t("Dispatch", "डिस्पैच")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/load-assignments">
                  <ClipboardList className="size-4" />
                  <span>{t("Load Assignments", "लोड असाइनमेंट")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/customers">
                  <Users className="size-4" />
                  <span>{t("Customers", "ग्राहक")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/reports">
                  <FileText className="size-4" />
                  <span>{t("Reports", "रिपोर्ट")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/company/chat">
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
