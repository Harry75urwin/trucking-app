import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import type { Load } from '../../types';

export default function LoadDetailScreen({ route, navigation }: any) {
  const { loadId } = route.params || {};
  const { loads, refreshUserData, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      refreshUserData().catch((e) => {
        const message = e instanceof Error ? e.message : 'Failed to load load details';
        Alert.alert('Error', message);
      });
    }
  }, [loadId, token]);

  const load = loads.find((l) => l.id === loadId);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to refresh load details';
      Alert.alert('Error', message);
    }
    setRefreshing(false);
  };

  if (!load) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format((load.rate || 0) + (load.fuel_surcharge || 0) + (load.detention || 0));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.number}>{load.load_number}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor(load.status) }]}>
            <Text style={styles.badgeText}>{statusLabel(load.status)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{load.origin_city}, {load.origin_state}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{load.destination_city}, {load.destination_state}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Commodity</Text>
              <Text style={styles.value}>{load.commodity}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{load.weight_lbs?.toLocaleString() || '-'} lbs</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Miles</Text>
              <Text style={styles.value}>{load.miles?.toLocaleString() || '-'}</Text>
            </View>
            {load.pickup_date && (
              <View style={styles.row}>
                <Text style={styles.label}>Pickup</Text>
                <Text style={styles.value}>{new Date(load.pickup_date).toLocaleDateString()}</Text>
              </View>
            )}
            {load.delivery_date && (
              <View style={styles.row}>
                <Text style={styles.label}>Delivery</Text>
                <Text style={styles.value}>{new Date(load.delivery_date).toLocaleDateString()}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Rate</Text>
              <Text style={styles.value}>${load.rate?.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fuel Surcharge</Text>
              <Text style={styles.value}>${load.fuel_surcharge?.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Detention</Text>
              <Text style={styles.value}>${load.detention?.toLocaleString() || 0}</Text>
            </View>
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{price}</Text>
            </View>
          </View>
        </View>

        {load.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notes}>{load.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function statusColor(status: Load['status']) {
  switch (status) {
    case 'in_transit': return '#3b82f6';
    case 'pending': return '#f59e0b';
    case 'dispatched': return '#8b5cf6';
    case 'delivered': return '#10b981';
    case 'problem': return '#ef4444';
    default: return '#6b7280';
  }
}

function statusLabel(status: Load['status']) {
  switch (status) {
    case 'in_transit': return 'In Transit';
    case 'pending': return 'Pending';
    case 'dispatched': return 'Dispatched';
    case 'delivered': return 'Delivered';
    case 'problem': return 'Problem';
    default: return status;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  number: {
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4f46e5',
  },
  notes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
