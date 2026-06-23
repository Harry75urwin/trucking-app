import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomersScreen({ navigation }: any) {
  const { customers, refreshUserData } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const renderCustomer = ({ item }: { item: typeof customers[0] }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.contact}>{item.contact_name}</Text>
      <Text style={styles.detail}>{item.email} • {item.phone}</Text>
      <Text style={styles.address} numberOfLines={2}>
        {item.address}, {item.city}, {item.state} {item.zip}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#f9fafb' }}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Customers</Text>
        </View>
      </SafeAreaView>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomer}
        contentContainerStyle={[styles.list, { paddingBottom: safeAreaInsets.bottom + 16 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No customers found</Text>
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
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
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
  contact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
