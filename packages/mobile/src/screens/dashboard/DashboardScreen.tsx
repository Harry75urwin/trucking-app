import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import type { Load } from '../../types';

export default function DashboardScreen({ navigation }: any) {
  const { user, loads, vehicles, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const activeLoads = useMemo(
    () => loads.filter((l) => ['pending', 'dispatched', 'in_transit', 'problem'].includes(l.status)),
    [loads]
  );

  const stats = useMemo(
    () => [
      { label: 'Active Loads', value: String(activeLoads.length), icon: '🚚' },
      { label: 'In Transit', value: String(loads.filter((l) => l.status === 'in_transit').length), icon: '📍' },
      { label: 'Delivered', value: String(loads.filter((l) => l.status === 'delivered').length), icon: '✅' },
      { label: 'Problem', value: String(loads.filter((l) => l.status === 'problem').length), icon: '⚠️' },
    ],
    [loads, activeLoads.length]
  );

  const statusColor = (status: Load['status']) => {
    switch (status) {
      case 'in_transit': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'dispatched': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'problem': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const statusLabel = (status: Load['status']) => {
    switch (status) {
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      case 'dispatched': return 'Dispatched';
      case 'delivered': return 'Delivered';
      case 'problem': return 'Problem';
      default: return status;
    }
  };

  const progressMap: Record<Load['status'], number> = {
    pending: 0,
    dispatched: 20,
    in_transit: 65,
    delivered: 100,
    problem: 45,
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.firstName || user?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>Welcome to your truck network dashboard</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Loads</Text>

          {activeLoads.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active loads found</Text>
            </View>
          ) : (
            activeLoads.map((load) => {
              const progress = progressMap[load.status] ?? 0;
              const price = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format((load.rate || 0) + (load.fuel_surcharge || 0) + (load.detention || 0));

              return (
                <TouchableOpacity
                  key={load.id}
                  style={styles.loadCard}
                  onPress={() => navigation.navigate('MapTab', { loadId: load.id })}
                >
                  <View style={styles.loadHeader}>
                    <View style={styles.loadTitleRow}>
                      <Text style={styles.loadNumber}>{load.load_number}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor(load.status) }]}>
                        <Text style={styles.statusText}>{statusLabel(load.status)}</Text>
                      </View>
                    </View>
                    <Text style={styles.loadRoute}>
                      {load.origin_city} → {load.destination_city}
                    </Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: statusColor(load.status) }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}%</Text>
                  </View>

                  <View style={styles.loadFooter}>
                    <Text style={styles.loadPrice}>{price}</Text>
                    <Text style={styles.loadWeight}>{load.weight_lbs?.toLocaleString() || '-'} lbs</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyText: {
    color: '#6b7280',
  },
  loadCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loadHeader: {
    marginBottom: 12,
  },
  loadTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loadNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  loadRoute: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
  },
  loadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  loadWeight: {
    fontSize: 14,
    color: '#6b7280',
  },
});
