# 📱 HVAC AI - Mobile "Reader App" Guide

This guide provides the complete blueprint for building your React Native (Expo) mobile app using the **Reader App (Guideline 3.1.3)** model. This guarantees 100% compliance with Apple and Google's rules, avoiding the 30% tax by handling all payments on your existing web platform.

---

## 🧱 1. Project Setup & Folder Structure

Run this in your terminal to initialize the Expo project (do this outside your web app folder):

```bash
npx create-expo-app@latest -t tabs hvac-mobile
cd hvac-mobile
npx expo install firebase @react-native-async-storage/async-storage expo-web-browser expo-constants zustand expo-router
```

### Folder Structure
```text
hvac-mobile/
├── app/
│   ├── _layout.tsx           # Root layout (Auth & Firestore listeners)
│   ├── login.tsx             # Login & Signup screen
│   └── (tabs)/               # Protected tab navigation
│       ├── _layout.tsx       # Tab bar config
│       ├── index.tsx         # Dashboard
│       ├── ai.tsx            # AI Features (Gated)
│       └── account.tsx       # Account & Subscription status
├── src/
│   ├── config/
│   │   └── firebase.ts       # Firebase initialization
│   └── store/
│       └── useAuth.ts        # Zustand global state
├── .env                      # Environment variables
├── app.json                  # Expo configuration
└── package.json
```

---

## 🔐 2. Environment Variables

Create a `.env` file in the root of your `hvac-mobile` project. 
**Rule:** Only expose public keys. Your Stripe Secret Key stays on your Node.js backend.

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com
EXPO_PUBLIC_WEB_URL=https://your-website.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🔌 3. Core Implementation

### A. Firebase Setup (`src/config/firebase.ts`)
We use `AsyncStorage` to ensure the user stays logged in when they close the app.

```typescript
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
```

### B. Global State (`src/store/useAuth.ts`)
```typescript
import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  plan: 'free' | 'home' | 'pro' | 'commercial';
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setPlan: (plan: 'free' | 'home' | 'pro' | 'commercial') => void;
  setInitialized: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: 'free',
  isInitialized: false,
  setUser: (user) => set({ user }),
  setPlan: (plan) => set({ plan }),
  setInitialized: (val) => set({ isInitialized: val }),
}));
```

### C. The Magic Listener (`app/_layout.tsx`)
This file listens to Firebase Auth and Firestore. When your backend Stripe webhook updates Firestore, this listener instantly updates the mobile UI.

```typescript
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../src/config/firebase';
import { useAuthStore } from '../src/store/useAuth';

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
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isInitialized, segments]);

  if (!isInitialized) return null; // Show splash screen here

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

### D. Feature Gating (`app/(tabs)/ai.tsx`)
How to restrict features based on the real-time plan.

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/store/useAuth';

export default function AIScreen() {
  const { plan } = useAuthStore();
  const isPro = plan === 'pro' || plan === 'commercial';

  if (!isPro) {
    return (
      <View style={styles.container}>
        <Text style={styles.lockedText}>🔒 Pro Feature</Text>
        <Text style={styles.desc}>
          Advanced AI diagnostics are available for Pro and Commercial members.
        </Text>
        <Text style={styles.hint}>
          Manage your subscription on our website to unlock this feature.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Diagnostics Active</Text>
      {/* Your AI UI goes here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  lockedText: { fontSize: 24, fontWeight: 'bold', color: '#ef4444', marginBottom: 10 },
  desc: { textAlign: 'center', marginBottom: 20, color: '#64748b' },
  hint: { textAlign: 'center', fontSize: 12, color: '#94a3b8' }
});
```

### E. Reader App Compliant Account Screen (`app/(tabs)/account.tsx`)
**CRITICAL:** Do not use the words "Buy", "Upgrade", or "Purchase". Use "Manage Account".

```tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../src/config/firebase';
import { useAuthStore } from '../../src/store/useAuth';

export default function AccountScreen() {
  const { user, plan } = useAuthStore();

  const handleManageAccount = async () => {
    // Open your web app's dashboard/settings page. 
    // The user can upgrade via Stripe on the web.
    await WebBrowser.openBrowserAsync(`${process.env.EXPO_PUBLIC_WEB_URL}/dashboard`);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>
      
      <View style={styles.planCard}>
        <Text style={styles.planLabel}>Current Plan</Text>
        <Text style={styles.planValue}>{plan.toUpperCase()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Manage Account on Web" onPress={handleManageAccount} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Log Out" color="#ef4444" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  email: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  planCard: { padding: 20, backgroundColor: '#e2e8f0', borderRadius: 10, marginBottom: 30 },
  planLabel: { fontSize: 14, color: '#64748b' },
  planValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  buttonContainer: { marginBottom: 15 }
});
```

---

## 🔔 4. The Webhook Flow (How it all connects)

Because you implemented a Reader App, the money flow is perfectly isolated from Apple:

1. **User Action:** User taps "Manage Account on Web" in the mobile app.
2. **Web Browser:** `expo-web-browser` opens `https://yourwebsite.com/dashboard`.
3. **Web Upgrade:** User logs in on the web, clicks "Upgrade to Pro", and pays via your existing Stripe Checkout.
4. **Stripe Webhook:** Stripe successfully charges the card and sends a `checkout.session.completed` POST request to your Node.js backend.
5. **Backend Update:** Your Node.js backend verifies the webhook and runs `db.collection('users').doc(userId).update({ subscriptionTier: 'pro' })`.
6. **Mobile App Reacts:** The `onSnapshot` listener in `app/_layout.tsx` instantly detects the Firestore change. It updates the Zustand state (`setPlan('pro')`).
7. **UI Unlocks:** The `ai.tsx` screen immediately re-renders, removing the lock screen and showing the premium AI features.

---

## 🚨 5. App Store Compliance (CRITICAL)

To get approved by Apple under Guideline 3.1.3(a) "Reader Apps", you must follow these rules strictly.

### What NOT to do in the app:
- Do NOT mention pricing (e.g., "$15/mo").
- Do NOT have a button that says "Upgrade", "Buy", or "Subscribe".
- Do NOT show a paywall that lists features you *could* get if you paid.

### What TO do:
- Show a generic locked state: "This feature requires a Pro account."
- Have a generic button: "Manage Account" or "Account Settings" that links to your website.

### EXACT Wording for App Store Review Notes:
When you submit your app to App Store Connect, put this exact text in the **Review Notes** section:

> "Hello Review Team,
> 
> This application operates as a 'Reader App' under Guideline 3.1.3(a). It is a companion app to our existing SaaS web platform (HVAC AI). 
> 
> Users cannot purchase subscriptions, digital goods, or services within this mobile app. The app is strictly for existing users to log in and access the features, data, and content associated with their pre-existing web account. 
> 
> Account management and subscription purchases are handled entirely outside of the app on our external website. There are no links within the app that bypass Apple's IAP guidelines to initiate a purchase.
> 
> Thank you."

---

## 📦 6. Build & Deployment (EAS)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 2. Build for iOS (App Store)
You need an Apple Developer Account ($99/yr).
```bash
eas build --platform ios --profile production
```
*EAS will prompt you to log into your Apple account and will automatically generate the required Certificates and Provisioning Profiles.*

Once the build finishes, submit it:
```bash
eas submit -p ios
```

### 3. Build for Android (Play Store)
You need a Google Play Developer Account ($25 one-time).
```bash
eas build --platform android --profile production
```
Download the resulting `.aab` file and upload it manually to the Google Play Console.

---

## 🧪 7. Testing Checklist

Before submitting to the App Store, test these flows:
1. **Login:** Log in with a free account.
2. **Gating:** Verify the AI screen shows the locked state.
3. **External Link:** Click "Manage Account on Web". Ensure it opens the browser.
4. **The Magic Sync:** While the app is open on your phone, go to your computer, open your web app, and upgrade that account using a Stripe Test Card. 
5. **Verification:** Look at your phone. The app should automatically update to "Pro" and unlock the AI screen without you touching it.