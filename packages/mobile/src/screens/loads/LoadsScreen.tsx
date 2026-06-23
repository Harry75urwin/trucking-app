import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import type { Load } from '../../types';

export default function LoadsScreen({ navigation }: any) {
  const { loads, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const activeLoads = useMemo(
    () => loads.filter((l) => ['pending', 'dispatched', 'in_transit', 'problem'].includes(l.status)),
    [loads]
  );

  const historyLoads = useMemo(
    () => loads.filter((l) => l.status === 'delivered'),
    [loads]
  );

  const displayedLoads = activeTab === 'active' ? activeLoads : historyLoads;

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

  const renderLoad = ({ item }: { item: Load }) => {
    const price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((item.rate || 0) + (item.fuel_surcharge || 0) + (item.detention || 0));

    return (
      <TouchableOpacity
        style={styles.loadCard}
        onPress={() => navigation.navigate('LoadDetailScreen', { loadId: item.id })}
      >
        <View style={styles.loadHeader}>
          <Text style={styles.loadNumber}>{item.load_number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
            <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.loadRoute}>
          {item.origin_city}, {item.origin_state} → {item.destination_city}, {item.destination_state}
        </Text>
        <View style={styles.loadFooter}>
          <Text style={styles.loadPrice}>{price}</Text>
          <Text style={styles.loadWeight}>{item.weight_lbs?.toLocaleString() || '-'} lbs</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeLoads.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({historyLoads.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedLoads}
        keyExtractor={(item) => item.id}
        renderItem={renderLoad}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No loads found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 12,
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
});
