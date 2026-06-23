import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

type ActivityItem = {
  id: string;
  type: 'load_status' | 'tracking' | 'message';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
};

export default function ActivityScreen({ navigation }: any) {
  const { loads, trackingEvents, conversations, refreshUserData } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const activityItems = useMemo(() => {
    const items: ActivityItem[] = [];

    loads.forEach((load) => {
      items.push({
        id: `load-${load.id}`,
        type: 'load_status',
        title: `Load ${load.load_number} status updated`,
        description: `Status changed to ${load.status.replace('_', ' ')}`,
        timestamp: load.updated_at,
        icon: '📦',
      });
    });

    trackingEvents.forEach((event) => {
      const load = loads.find((l) => l.id === event.loadId);
      items.push({
        id: `tracking-${event.id}`,
        type: 'tracking',
        title: `Location update for Load ${load?.load_number || event.loadId}`,
        description: event.locationName || 'Vehicle position updated',
        timestamp: event.recordedAt,
        icon: '📍',
      });
    });

    conversations.forEach((conv) => {
      items.push({
        id: `message-${conv.id}`,
        type: 'message',
        title: 'New message',
        description: `Load ${conv.loadId || conv.id}`,
        timestamp: conv.lastMessageAt || conv.createdAt,
        icon: '💬',
      });
    });

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [loads, trackingEvents, conversations]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>{item.icon}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Activity</Text>
        </View>
      </SafeAreaView>
      <FlatList
        data={activityItems}
        keyExtractor={(item) => item.id}
        renderItem={renderActivity}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: safeAreaInsets.bottom + 16,
          },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent activity</Text>
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
  header: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
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
