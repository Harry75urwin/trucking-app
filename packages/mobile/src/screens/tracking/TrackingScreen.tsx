import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import type { Load } from '../../types';

export default function TrackingScreen({ route, navigation }: any) {
  const { loadId } = route.params || {};
  const { loads, refreshUserData, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) refreshUserData();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await refreshUserData();
    }
    setRefreshing(false);
  };

  const activeLoads = useMemo(() => {
    return loads.filter((l) => ['pending', 'dispatched', 'in_transit', 'problem'].includes(l.status));
  }, [loads]);

  const load = loadId ? loads.find((l) => l.id === loadId) : null;

  const progress = useMemo(() => {
    if (!load) return 0;
    switch (load.status) {
      case 'pending': return 0;
      case 'dispatched': return 20;
      case 'in_transit': return 65;
      case 'delivered': return 100;
      case 'problem': return 45;
      default: return 0;
    }
  }, [load?.status]);

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

  const waypoints = useMemo(() => {
    if (!load) return [];
    const from = `${load.origin_city}, ${load.origin_state}`;
    const to = `${load.destination_city}, ${load.destination_state}`;

    if (load.status === 'delivered') {
      return [
        { name: from, status: 'completed', time: load.pickup_date || 'Pickup' },
        { name: to, status: 'completed', time: load.delivery_date || 'Delivered' },
      ];
    }
    if (load.status === 'in_transit' || load.status === 'dispatched') {
      return [
        { name: from, status: 'completed', time: load.pickup_date || 'Pickup' },
        { name: 'In Transit', status: 'current', time: 'Now' },
        { name: to, status: 'upcoming', time: load.delivery_date || 'Expected' },
      ];
    }
    return [
      { name: from, status: 'upcoming', time: 'Pickup' },
      { name: to, status: 'upcoming', time: 'Delivery' },
    ];
  }, [load]);

  if (!loadId && !load) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Load to Track</Text>
        </View>
        <FlatList
          data={activeLoads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.loadSelectorCard}
                onPress={() => navigation.navigate('MapTab', { loadId: item.id })}
            >
              <Text style={styles.loadSelectorNumber}>{item.load_number}</Text>
              <Text style={styles.loadSelectorRoute}>
                {item.origin_city}, {item.origin_state} → {item.destination_city}, {item.destination_state}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No active loads to track</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  if (!load) {
    return (
      <SafeAreaView edges={['top']} style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((load.rate || 0) + (load.fuel_surcharge || 0) + (load.detention || 0));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Live Tracking</Text>
        <Text style={styles.subtitle}>
          {load.load_number} • {load.origin_city} → {load.destination_city}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.routeMap}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>📍</Text>
            <Text style={styles.routeLabel}>{load.origin_city} → {load.destination_city}</Text>
            <View style={styles.progressIndicator}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{progress}% Complete</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Journey Timeline</Text>
        <View style={styles.timeline}>
          {waypoints.map((wp, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: wp.status === 'completed' ? '#10b981' : wp.status === 'current' ? '#3b82f6' : '#d1d5db' }
                ]} />
                {i < waypoints.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, wp.status === 'upcoming' && styles.upcomingText]}>
                  {wp.name}
                </Text>
                <Text style={styles.timelineTime}>{wp.time}</Text>
                {wp.status === 'current' && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Load Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>From</Text>
            <Text style={styles.detailValue}>{load.origin_city}, {load.origin_state}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To</Text>
            <Text style={styles.detailValue}>{load.destination_city}, {load.destination_state}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{load.weight_lbs?.toLocaleString() || '-'} lbs</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Goods</Text>
            <Text style={styles.detailValue}>{load.commodity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor(load.status) }]}>
              <Text style={styles.statusText}>{statusLabel(load.status)}</Text>
            </View>
          </View>
        </View>
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
  scrollContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  backButton: {
    fontSize: 16,
    color: '#4f46e5',
    marginBottom: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  mapContainer: {
    padding: 16,
  },
  routeMap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  mapText: {
    fontSize: 48,
    marginBottom: 8,
  },
  routeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressIndicator: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressPercent: {
    color: '#fff',
    fontSize: 12,
  },
  timelineContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  upcomingText: {
    color: '#6b7280',
  },
  currentBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
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
  listContent: {
    padding: 16,
  },
  loadSelectorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loadSelectorNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  loadSelectorRoute: {
    fontSize: 14,
    color: '#6b7280',
  },
  empty: {
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
});