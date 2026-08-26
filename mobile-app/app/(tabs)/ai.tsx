import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuth';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AIScreen() {
  const { plan } = useAuthStore();
  const isPro = plan === 'pro' || plan === 'commercial';

  const handleManageAccount = async () => {
    // Reader App Compliance: Open external browser for any account management
    await WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_WEB_URL || 'https://your-website.com');
  };

  if (!isPro) {
    return (
      <View style={styles.lockedContainer}>
        <MaterialCommunityIcons name="lock" size={64} color="#ef4444" style={{ marginBottom: 20 }} />
        <Text style={styles.lockedTitle}>Pro Feature Locked</Text>
        <Text style={styles.lockedDesc}>
          Advanced AI diagnostics, predictive failure analysis, and real-time optimization are available for Pro members.
        </Text>
        
        {/* Reader App Compliant Button - NO mention of "Buy" or "Upgrade" */}
        <TouchableOpacity style={styles.manageButton} onPress={handleManageAccount}>
          <Text style={styles.manageButtonText}>Manage Account on Web</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Subscriptions must be managed on our website.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="robot-outline" size={32} color="#3b82f6" />
        <Text style={styles.title}>AI Diagnostics Active</Text>
      </View>
      
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Predictive Failure Warning</Text>
        <Text style={styles.insightDesc}>
          Your compressor is showing signs of degradation based on runtime cycles. Estimated failure risk: 72% within 6 months.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Optimization Opportunity</Text>
        <Text style={styles.insightDesc}>
          Shifting your cooling schedule by 2 hours could save you 18% on today's energy bill based on local grid pricing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  insightCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  insightDesc: { color: '#cbd5e1', lineHeight: 22 },
  
  lockedContainer: { flex: 1, backgroundColor: '#0f172a', padding: 20, justifyContent: 'center', alignItems: 'center' },
  lockedTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  lockedDesc: { textAlign: 'center', color: '#94a3b8', fontSize: 16, lineHeight: 24, marginBottom: 30, paddingHorizontal: 20 },
  manageButton: { backgroundColor: '#3b82f6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  manageButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hint: { color: '#64748b', fontSize: 12, textAlign: 'center' }
});
