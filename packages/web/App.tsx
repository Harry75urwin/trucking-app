import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/lib/language-context";
import {
  AuthSessionProvider,
  useAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import { SocketProvider } from "@/lib/socket-context";

// Auth & Onboarding
import LoginPage from "@/pages/auth/LoginPage";
import OnboardingPage from "@/pages/auth/OnboardingPage";

// Role-based layouts and dashboards
import TruckerLayout from "@/layouts/TruckerLayout";
import CompanyLayout from "@/layouts/CompanyLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Trucker pages
import TruckerDashboard from "@/pages/trucker/Dashboard";
import MyLoadsTrucker from "@/pages/trucker/MyLoads";
import BiddingPage from "@/pages/trucker/Bidding";
import BidDetailPage from "@/pages/trucker/BidDetail";
import TruckerTrackingPage from "@/pages/trucker/Tracking";
import MyVehicles from "@/pages/trucker/MyVehicles";
import EarningsPage from "@/pages/trucker/Earnings";
import LoadDetailsPage from "@/pages/trucker/LoadDetails";
import VehicleFormPage from "@/pages/trucker/VehicleFormPage";
import ChatPage from "@/pages/Chat";

// Company pages
import CompanyDashboard from "@/pages/company/Dashboard";
import LoadAssignmentsPage from "@/pages/company/LoadAssignments";
import PostLoadPage from "@/pages/company/PostLoad";
import MyLoadsCompany from "@/pages/company/MyLoads";
import BidsPage from "@/pages/company/Bids";
import FleetPage from "@/pages/company/Fleet";
import DriversPage from "@/pages/company/Drivers";
import DriverDetailPage from "@/pages/company/DriverDetail";
import VehicleDetailPage from "@/pages/company/VehicleDetail";
import LoadTemplatesPage from "@/pages/company/LoadTemplates";
import PublicProfilePage from "@/pages/company/PublicProfile";
import CompanyCustomersPage from "@/pages/company/Customers";
import DispatchPage from "@/pages/company/Dispatch";

// Settings pages
import SettingsPage from "@/pages/Settings";
import ProfileSettingsPage from "@/pages/settings/ProfileSettings";
import NotificationSettingsPage from "@/pages/settings/NotificationSettings";
import AppearanceSettingsPage from "@/pages/settings/AppearanceSettings";
import SecuritySettingsPage from "@/pages/settings/SecuritySettings";

// Customer pages
import CustomerDashboard from "@/pages/customer/Dashboard";
import PostLoadCustomer from "@/pages/customer/PostLoad";
import MyLoadsCustomer from "@/pages/customer/MyLoads";
import CustomerTrackingPage from "@/pages/customer/Tracking";
import PaymentsPage from "@/pages/customer/Payments";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminReports from "@/pages/admin/Reports";
import UsersManagement from "@/pages/admin/Users";
import LoadsManagement from "@/pages/admin/Loads";
import DisputesPage from "@/pages/admin/Disputes";
import OrganizationsManagement from "@/pages/admin/Organizations";
import ReportsPage from "@/pages/Reports";

function AppRoutes({
  isAuthenticated,
  userType,
  onLoginSuccess,
}: {
  isAuthenticated: boolean;
  userType: string | null;
  onLoginSuccess: (session: AuthSession) => void;
}) {
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={onLoginSuccess} />}
        />
        <Route
          path="/onboarding/:type"
          element={<OnboardingPage onComplete={onLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Shared Reports Route */}
      <Route path="/reports" element={<ReportsPage />} />

      {/* Trucker Routes */}
      {userType === "trucker" && (
        <Route element={<TruckerLayout />}>
          <Route path="/trucker/dashboard" element={<TruckerDashboard />} />
          <Route path="/trucker/loads" element={<MyLoadsTrucker />} />
          <Route path="/trucker/load/:id" element={<LoadDetailsPage />} />
          <Route path="/trucker/bidding" element={<BiddingPage />} />
          <Route path="/trucker/bidding/:id" element={<BidDetailPage />} />
          <Route path="/trucker/vehicles" element={<MyVehicles />} />
          <Route path="/trucker/vehicles/new" element={<VehicleFormPage />} />
          <Route
            path="/trucker/vehicles/:id/edit"
            element={<VehicleFormPage />}
          />
          <Route path="/trucker/earnings" element={<EarningsPage />} />
          <Route
            path="/trucker/tracking/:id"
            element={<TruckerTrackingPage />}
          />
          <Route path="/trucker/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationSettingsPage />}
          />
          <Route
            path="/settings/appearance"
            element={<AppearanceSettingsPage />}
          />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
          <Route path="*" element={<Navigate to="/trucker/dashboard" />} />
        </Route>
      )}

      {/* Company Routes */}
      {userType === "company" && (
        <Route element={<CompanyLayout />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/post-load" element={<PostLoadPage />} />
          <Route path="/company/loads" element={<MyLoadsCompany />} />
          <Route path="/company/bids" element={<BidsPage />} />
          <Route path="/company/fleet" element={<FleetPage />} />
          <Route path="/company/fleet/:id" element={<VehicleDetailPage />} />
          <Route path="/company/drivers" element={<DriversPage />} />
          <Route path="/company/drivers/:id" element={<DriverDetailPage />} />
          <Route path="/company/templates" element={<LoadTemplatesPage />} />
          <Route path="/company/customers" element={<CompanyCustomersPage />} />
          <Route path="/company/dispatch" element={<DispatchPage />} />
          <Route
            path="/company/load-assignments"
            element={<LoadAssignmentsPage />}
          />
          <Route path="/company/profile" element={<PublicProfilePage />} />
          <Route path="/company/reports" element={<ReportsPage />} />
          <Route path="/company/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationSettingsPage />}
          />
          <Route
            path="/settings/appearance"
            element={<AppearanceSettingsPage />}
          />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
          <Route path="*" element={<Navigate to="/company/dashboard" />} />
        </Route>
      )}

      {/* Customer Routes */}
      {userType === "customer" && (
        <Route element={<CustomerLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/post-load" element={<PostLoadCustomer />} />
          <Route path="/customer/loads" element={<MyLoadsCustomer />} />
          <Route path="/customer/tracking" element={<CustomerTrackingPage />} />
          <Route path="/customer/chat" element={<ChatPage />} />
          <Route path="/customer/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationSettingsPage />}
          />
          <Route
            path="/settings/appearance"
            element={<AppearanceSettingsPage />}
          />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
          <Route path="*" element={<Navigate to="/customer/dashboard" />} />
        </Route>
      )}

      {/* Admin Routes */}
      {userType === "admin" && (
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route
            path="/admin/organizations"
            element={<OrganizationsManagement />}
          />
          <Route path="/admin/loads" element={<LoadsManagement />} />
          <Route path="/admin/disputes" element={<DisputesPage />} />
          <Route path="/admin/chat" element={<ChatPage />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationSettingsPage />}
          />
          <Route
            path="/settings/appearance"
            element={<AppearanceSettingsPage />}
          />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function AppRouterContent() {
  const { session, login } = useAuthSession();

  return (
    <SocketProvider token={session.accessToken}>
      <BrowserRouter>
        <AppRoutes
          isAuthenticated={session.isAuthenticated}
          userType={session.userType}
          onLoginSuccess={(nextSession) => login(nextSession)}
        />
      </BrowserRouter>
    </SocketProvider>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthSessionProvider>
        <AppRouterContent />
      </AuthSessionProvider>
    </LanguageProvider>
  );
}

export default App;
