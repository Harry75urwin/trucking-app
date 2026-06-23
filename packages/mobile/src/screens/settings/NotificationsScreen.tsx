import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No notifications</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    padding: 24,
  },
  emptyText: {
    color: '#6b7280',
  },
});
