import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../src/config/firebase';
import { useAuthStore } from '../src/store/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { setUser, setPlan, setInitialized, isInitialized, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitialized(true);

      if (firebaseUser) {
        // Real-time listener for Stripe Webhook updates!
        // When the backend updates Firestore, this triggers instantly.
        const unsubDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setPlan(docSnap.data().subscriptionTier || 'free');
          }
        });
        return () => unsubDoc();
      } else {
        setPlan('free');
      }
    });

    return () => unsubAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(tabs)';
    
    if (!user && inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [user, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}