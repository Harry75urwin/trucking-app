import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function DriversScreen({ navigation }: any) {
  const { drivers, refreshUserData } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to refresh drivers';
      Alert.alert('Error', message);
    }
    setRefreshing(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'on_trip': return '#3b82f6';
      case 'off_duty': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderDriver = ({ item }: { item: typeof drivers[0] }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.detail}>{item.phone}</Text>
      <Text style={styles.detail}>{item.cdl_number}</Text>
      <Text style={styles.detail}>Home: {item.home_city}, {item.home_state}</Text>
      <View style={styles.footer}>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#f9fafb' }}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Drivers</Text>
        </View>
      </SafeAreaView>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={renderDriver}
        contentContainerStyle={[styles.list, { paddingBottom: safeAreaInsets.bottom + 16 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No drivers found</Text>
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
  name: {
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
  email: {
    fontSize: 13,
    color: '#4f46e5',
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
