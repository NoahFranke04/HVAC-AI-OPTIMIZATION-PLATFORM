import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../src/config/firebase';
import { useAuthStore } from '../../src/store/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AccountScreen() {
  const { user, plan } = useAuthStore();

  const handleManageAccount = async () => {
    // Reader App Compliance: Open external browser for any account management
    // This points to your Vite app where they can use Stripe Billing Portal
    await WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_WEB_URL || 'https://your-website.com');
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={40} color="#94a3b8" />
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.uid}>ID: {user?.uid.substring(0, 8)}...</Text>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planLabel}>Current Plan</Text>
          <View style={[styles.statusDot, { backgroundColor: plan === 'free' ? '#64748b' : '#22c55e' }]} />
        </View>
        <Text style={styles.planValue}>{plan.toUpperCase()}</Text>
        <Text style={styles.planDesc}>
          {plan === 'free' ? 'Basic monitoring features' : 'Full access to AI and analytics'}
        </Text>
      </View>

      <View style={styles.actions}>
        {/* Reader App Compliant Button */}
        <TouchableOpacity style={styles.manageButton} onPress={handleManageAccount}>
          <MaterialCommunityIcons name="open-in-new" size={20} color="#fff" />
          <Text style={styles.manageButtonText}>Manage Account on Web</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  profileSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  email: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  uid: { fontSize: 12, color: '#64748b' },
  
  planCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 15, marginBottom: 40, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planLabel: { fontSize: 14, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  planValue: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  planDesc: { color: '#cbd5e1', fontSize: 14 },

  actions: { gap: 15 },
  manageButton: { backgroundColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, gap: 10 },
  manageButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  logoutButton: { backgroundColor: '#1e293b', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, gap: 10, borderWidth: 1, borderColor: '#ef4444' },
  logoutButtonText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' }
});