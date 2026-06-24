import React, { useMemo } from "react";
import { NavigationContainer, useNavigation, CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { canAccessAnyModel, canAccessModel, type AccessModel, type UserRole } from "../lib/rbac";

import AccessDeniedScreen from "../components/AccessDeniedScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import LoadsScreen from "../screens/loads/LoadsScreen";
import LoadDetailScreen from "../screens/loads/LoadDetailScreen";
import MessagingScreen from "../screens/messaging/MessagingScreen";
import ChatScreen from "../screens/messaging/ChatScreen";
import TrackingScreen from "../screens/tracking/TrackingScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import FleetScreen from "../screens/fleet/FleetScreen";
import DriversScreen from "../screens/drivers/DriversScreen";
import CustomersScreen from "../screens/customers/CustomersScreen";
import ActivityScreen from "../screens/activity/ActivityScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import NotificationsScreen from "../screens/settings/NotificationsScreen";
import SecurityScreen from "../screens/settings/SecurityScreen";
import AppearanceScreen from "../screens/settings/AppearanceScreen";
import OperationsScreen from "../screens/operations/OperationsScreen";
import MoreScreen from "../screens/more/MoreScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  ChatScreen: { conversationId: string };
  LoadDetailScreen: { loadId: string };
};

export type OperationsStackParamList = {
  OperationsScreen: undefined;
  FleetScreen: undefined;
  DriversScreen: undefined;
  CustomersScreen: undefined;
};

export type MoreStackParamList = {
  MoreScreen: undefined;
  ActivityScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
};

export type SettingsStackParamList = {
  SettingsScreen: undefined;
  NotificationsScreen: undefined;
  SecurityScreen: undefined;
  AppearanceScreen: undefined;
};

export type TabParamList = {
  OverviewTab: undefined;
  JobsTab: undefined;
  OperationsTab: undefined;
  MapTab: { loadId?: string };
  MessagesTab: undefined;
  MoreTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const OperationsStackNav = createNativeStackNavigator<OperationsStackParamList>();
const MoreStackNav = createNativeStackNavigator<MoreStackParamList>();
const SettingsStackNav = createNativeStackNavigator<SettingsStackParamList>();

type BottomTabItem = {
  name: keyof TabParamList;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
  model?: AccessModel;
  models?: AccessModel[];
};

const BOTTOM_TAB_ITEMS: BottomTabItem[] = [
  {
    name: "OverviewTab",
    title: "Overview",
    icon: "🏠",
    component: DashboardScreen,
    model: "dashboard",
  },
  {
    name: "JobsTab",
    title: "Jobs",
    icon: "📦",
    component: LoadsScreen,
    model: "loads",
  },
  {
    name: "OperationsTab",
    title: "Operations",
    icon: "🏢",
    component: OperationsNavigator,
    models: ["fleet", "drivers", "customers"],
  },
  {
    name: "MapTab",
    title: "Map",
    icon: "📍",
    component: TrackingScreen,
    model: "tracking",
  },
  {
    name: "MessagesTab",
    title: "Messages",
    icon: "💬",
    component: MessagingScreen,
    model: "messaging",
  },
  {
    name: "MoreTab",
    title: "More",
    icon: "👤",
    component: MoreNavigator,
    models: ["profile", "settings", "activity"],
  },
];

function RoleGuard({ model, children }: { model: AccessModel; children: React.ReactNode }) {
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!canAccessModel(user?.role, model)) {
    return (
      <AccessDeniedScreen
        model={model}
        role={user?.role}
        onDismiss={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Main" }] }));
          }
        }}
      />
    );
  }

  return <>{children}</>;
}

function SettingsStack() {
  return (
    <SettingsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStackNav.Screen
        name="SettingsScreen"
        component={() => (
          <RoleGuard model="settings">
            <SettingsScreen />
          </RoleGuard>
        )}
        options={{ title: "Settings" }}
      />
      <SettingsStackNav.Screen
        name="NotificationsScreen"
        component={() => (
          <RoleGuard model="settings">
            <NotificationsScreen />
          </RoleGuard>
        )}
        options={{ title: "Notifications" }}
      />
      <SettingsStackNav.Screen
        name="SecurityScreen"
        component={() => (
          <RoleGuard model="settings">
            <SecurityScreen />
          </RoleGuard>
        )}
        options={{ title: "Security" }}
      />
      <SettingsStackNav.Screen
        name="AppearanceScreen"
        component={() => (
          <RoleGuard model="settings">
            <AppearanceScreen />
          </RoleGuard>
        )}
        options={{ title: "Appearance" }}
      />
    </SettingsStackNav.Navigator>
  );
}

function OperationsNavigator() {
  return (
    <OperationsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <OperationsStackNav.Screen
        name="OperationsScreen"
        component={OperationsScreen}
        options={{ title: "Operations" }}
      />
      <OperationsStackNav.Screen
        name="FleetScreen"
        component={() => (
          <RoleGuard model="fleet">
            <FleetScreen />
          </RoleGuard>
        )}
        options={{ title: "Fleet" }}
      />
      <OperationsStackNav.Screen
        name="DriversScreen"
        component={() => (
          <RoleGuard model="drivers">
            <DriversScreen />
          </RoleGuard>
        )}
        options={{ title: "Drivers" }}
      />
      <OperationsStackNav.Screen
        name="CustomersScreen"
        component={() => (
          <RoleGuard model="customers">
            <CustomersScreen />
          </RoleGuard>
        )}
        options={{ title: "Customers" }}
      />
    </OperationsStackNav.Navigator>
  );
}

function MoreNavigator() {
  return (
    <MoreStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MoreStackNav.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{ title: "More" }}
      />
      <MoreStackNav.Screen
        name="ProfileScreen"
        component={() => (
          <RoleGuard model="profile">
            <ProfileScreen />
          </RoleGuard>
        )}
        options={{ title: "Profile" }}
      />
      <MoreStackNav.Screen
        name="ActivityScreen"
        component={() => (
          <RoleGuard model="activity">
            <ActivityScreen />
          </RoleGuard>
        )}
        options={{ title: "Activity" }}
      />
      <MoreStackNav.Screen
        name="SettingsScreen"
        component={SettingsStack}
        options={{ title: "Settings" }}
      />
    </MoreStackNav.Navigator>
  );
}

function GuardedChatScreen(props: any) {
  return (
    <RoleGuard model="messaging">
      <ChatScreen {...props} />
    </RoleGuard>
  );
}

function GuardedLoadDetailScreen(props: any) {
  return (
    <RoleGuard model="loads">
      <LoadDetailScreen {...props} />
    </RoleGuard>
  );
}

function getVisibleTabItems(role: UserRole | undefined) {
  return BOTTOM_TAB_ITEMS.filter((item) => {
    if (item.model) return canAccessModel(role, item.model);
    if (item.models) return canAccessAnyModel(role, item.models);
    return true;
  });
}

function TabNavigator() {
  const { user } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const visibleTabs = useMemo(() => getVisibleTabItems(user?.role), [user?.role]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 62 + safeAreaInsets.bottom,
            paddingBottom: safeAreaInsets.bottom + 12,
          },
        ],
        tabBarHideOnKeyboard: true,
      }}
    >
      {visibleTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => <TabIcon icon={tab.icon} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={[styles.tabBarIconCircle, focused && styles.tabBarIconCircleActive]}>
      <Text style={[styles.tabBarIconText, focused && styles.tabBarIconTextActive]}>{icon}</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { token, user } = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!token || !user ? (
            <>
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: "Create account" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Main"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChatScreen"
                component={GuardedChatScreen}
                options={{ title: "Chat" }}
              />
              <Stack.Screen
                name="LoadDetailScreen"
                component={GuardedLoadDetailScreen}
                options={{ title: "Load Details" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderTopWidth: 0,
    backgroundColor: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabBarIcon: {
    height: 28,
  },
  tabBarIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  tabBarIconCircleActive: {
    backgroundColor: "#4f46e5",
  },
  tabBarIconText: {
    fontSize: 18,
    color: "#9ca3af",
  },
  tabBarIconTextActive: {
    color: "#fff",
  },
});
