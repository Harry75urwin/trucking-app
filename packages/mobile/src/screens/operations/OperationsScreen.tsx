import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessModel, type AccessModel } from '../../lib/rbac';
import type { OperationsStackParamList } from '../../navigation/AppNavigator';

type OperationsItem = {
  title: string;
  subtitle: string;
  icon: string;
  screen: keyof OperationsStackParamList;
  model: AccessModel;
};

const OPERATIONS_ITEMS: OperationsItem[] = [
  {
    title: 'Fleet',
    subtitle: 'Vehicles, maintenance, and service status',
    icon: '🚚',
    screen: 'FleetScreen',
    model: 'fleet',
  },
  {
    title: 'Drivers',
    subtitle: 'Driver roster, availability, and credentials',
    icon: '👷',
    screen: 'DriversScreen',
    model: 'drivers',
  },
  {
    title: 'Customers',
    subtitle: 'Customer accounts and shipping contacts',
    icon: '🏢',
    screen: 'CustomersScreen',
    model: 'customers',
  },
];

export default function OperationsScreen({ navigation }: any) {
  const { user } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const visibleItems = OPERATIONS_ITEMS.filter((item) => canAccessModel(user?.role, item.model));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: safeAreaInsets.top + 16,
          paddingBottom: safeAreaInsets.bottom + 16,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Operations</Text>
        <Text style={styles.subtitle}>Manage the people, vehicles, and customers in your network.</Text>
      </View>

      {visibleItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No operations available</Text>
          <Text style={styles.emptyText}>Your role does not have access to any operations screens.</Text>
        </View>
      ) : (
        visibleItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6b7280',
  },
  chevron: {
    fontSize: 24,
    color: '#9ca3af',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
});
