import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessModel, type AccessModel } from '../../lib/rbac';
import type { MoreStackParamList } from '../../navigation/AppNavigator';

type MoreItem = {
  title: string;
  subtitle: string;
  icon: string;
  screen: keyof MoreStackParamList;
  model: AccessModel;
};

const MORE_ITEMS: MoreItem[] = [
  {
    title: 'Profile',
    subtitle: 'View account details and sign out',
    icon: '👤',
    screen: 'ProfileScreen',
    model: 'profile',
  },
  {
    title: 'Activity',
    subtitle: 'Recent load, tracking, and message updates',
    icon: '🕘',
    screen: 'ActivityScreen',
    model: 'activity',
  },
  {
    title: 'Settings',
    subtitle: 'Notifications, security, and appearance preferences',
    icon: '⚙️',
    screen: 'SettingsScreen',
    model: 'settings',
  },
];

export default function MoreScreen({ navigation }: any) {
  const { user } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const visibleItems = MORE_ITEMS.filter((item) => canAccessModel(user?.role, item.model));

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
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Account tools and app preferences.</Text>
      </View>

      {visibleItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No account tools are available for your role.</Text>
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
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
});
