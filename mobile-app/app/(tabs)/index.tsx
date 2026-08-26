import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../src/store/useAuth';

export default function DashboardScreen() {
  const { user, plan } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Status</Text>
        <Text style={styles.cardValue}>Online & Monitoring</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Plan</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>{plan.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>• HVAC ran for 4h 20m today</Text>
        <Text style={styles.activityText}>• Peak usage detected at 4:00 PM</Text>
        <Text style={styles.activityText}>• Filter status: Good (80% life remaining)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { marginBottom: 30 },
  greeting: { fontSize: 16, color: '#94a3b8' },
  email: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 15, marginBottom: 20 },
  cardTitle: { fontSize: 14, color: '#94a3b8', marginBottom: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  cardValue: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  planBadge: { backgroundColor: '#3b82f6', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  planText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  activityText: { color: '#cbd5e1', fontSize: 14, marginBottom: 8 }
});
