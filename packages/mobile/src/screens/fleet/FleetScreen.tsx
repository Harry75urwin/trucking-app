import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import type { Vehicle } from '../../types';

export default function FleetScreen({ navigation }: any) {
  const { vehicles, refreshUserData } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to refresh fleet data';
      Alert.alert('Error', message);
    }
    setRefreshing(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'in_service': return '#f59e0b';
      case 'out_of_service': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.unit}>{item.unit_number}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.detail}>
        {item.year} {item.make} {item.model} • {item.type}
      </Text>
      <Text style={styles.detail}>Plate: {item.license_plate}</Text>
      <Text style={styles.detail}>Mileage: {item.mileage.toLocaleString()} mi</Text>
      <View style={styles.footer}>
        <Text style={styles.nextService}>
          Next service at {item.next_service_miles.toLocaleString()} mi
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#f9fafb' }}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Fleet</Text>
        </View>
      </SafeAreaView>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderVehicle}
        contentContainerStyle={[styles.list, { paddingBottom: safeAreaInsets.bottom + 16 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No vehicles found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  headerBar: {
    paddingHorizontal: 16,
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
  detail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  nextService: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
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
