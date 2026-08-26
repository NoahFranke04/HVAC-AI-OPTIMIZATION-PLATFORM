# 🚀 HVAC AI - Mobile App Conversion Guide

This guide provides everything you need to convert your existing HVAC AI web application into a production-ready mobile app for iOS and Android.

---

## 🧱 1. Tech Stack Selection

**Recommendation: Option A - React Native with Expo (EAS Build)**

**Why Expo?**
1. **No Mac Required for iOS Builds:** EAS (Expo Application Services) builds your iOS app in the cloud. You don't need a Mac or Xcode locally.
2. **Over-The-Air (OTA) Updates:** Fix bugs instantly without waiting for App Store review.
3. **Expo Router:** File-based routing (like Next.js/Vite) makes navigation incredibly easy.
4. **Native Code:** Expo now supports custom native code via Config Plugins, meaning you get the ease of Expo with the power of React Native CLI.

---

## ⚠️ 2. CRITICAL: The App Store "Tax" & Stripe

Before writing code, you must understand Apple and Google's rules regarding payments.

**The Rule (Apple Guideline 3.1.1):**
If your app unlocks *digital features* (like AI insights, premium charts, or digital reports), you **MUST** use Apple's In-App Purchase (IAP) system. Apple takes a 15-30% cut. You **CANNOT** use a native Stripe checkout inside the app for digital goods.

**How to handle this (3 Options):**

1. **The "Reader App" Approach (Recommended for SaaS):** 
   Users cannot upgrade inside the mobile app. The app only has a "Login" screen. Users must go to your website (the Vite app) to buy the subscription via Stripe. Once they pay, they log into the mobile app and have Pro access. (Netflix and Spotify do this).
2. **The WebBrowser Approach (Grey Area):**
   Use Expo's WebBrowser to open your existing Stripe Checkout URL. Apple often rejects this if they catch it, but it reuses your exact web backend.
3. **RevenueCat (The Native Way):**
   Use RevenueCat to handle Apple/Google IAPs in the mobile app, and keep Stripe for the web. RevenueCat webhooks update your backend.

*For this guide, we will use the **WebBrowser approach** to reuse your existing Stripe backend, but be prepared to switch to Option 1 if Apple rejects the review.*

---

## 🏗️ 3. Project Setup & Folder Structure

Run this in your terminal (outside your web app folder):
```bash
npx create-expo-app@latest hvac-ai-mobile
cd hvac-ai-mobile
npx expo install firebase @react-native-async-storage/async-storage expo-web-browser expo-constants axios zustand
```

### Folder Structure
```text
hvac-ai-mobile/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Main navigation stack
│   ├── index.tsx             # Login/Signup screen
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── dashboard.tsx     # Main dashboard
│   │   ├── analysis.tsx      # AI Analysis
│   │   └── settings.tsx      # Subscription management
├── src/
│   ├── config/
│   │   └── firebase.ts       # Firebase initialization
│   ├── store/
│   │   └── useAuth.ts        # Zustand state for user/subscription
│   ├── api/
│   │   └── backend.ts        # Axios setup for your Node.js backend
│   └── components/           # Reusable UI components
├── .env                      # Environment variables
├── app.json                  # Expo configuration
└── package.json
```

---

## 🔐 4. Environment Variables

**How to store securely:**
Mobile apps can be decompiled. **NEVER** put your `STRIPE_SECRET_KEY`, `FIREBASE_SERVICE_ACCOUNT`, or `VITE_GEMINI_API_KEY` in the mobile app. 
The mobile app should only contain public keys and your backend URL.

Create a `.env` file in the mobile project:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_public_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```
*Note: In Expo, variables must start with `EXPO_PUBLIC_` to be accessible in the app.*

---

## 📱 5. Core Implementation Snippets

### A. Firebase Auth & Persistent Login (`src/config/firebase.ts`)
```typescript
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other public config
};

const app = initializeApp(firebaseConfig);
// Use AsyncStorage for persistent login across app restarts
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
```

### B. Listening to Subscription Status (`app/_layout.tsx`)
Because your backend webhook updates Firestore when a Stripe payment succeeds, the mobile app just needs to listen to Firestore!

```typescript
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../src/config/firebase';
import { useAuthStore } from '../src/store/useAuth';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { setUser, setTier } = useAuthStore();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Listen to Firestore for real-time Stripe webhook updates!
        onSnapshot(doc(db, 'users', user.uid), (doc) => {
          if (doc.exists()) {
            setTier(doc.data().subscriptionTier || 'free');
          }
        });
      }
    });
    return unsubAuth;
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### C. Stripe Checkout via WebBrowser (`app/(tabs)/settings.tsx`)
This reuses your exact Node.js backend endpoint.

```typescript
import { View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../src/store/useAuth';
import axios from 'axios';

export default function Settings() {
  const { user, tier } = useAuthStore();

  const handleUpgrade = async (selectedTier: string) => {
    try {
      // 1. Call your existing Node.js backend
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/create-checkout-session`, {
        userId: user.uid,
        email: user.email,
        tier: selectedTier
      });

      // 2. Open Stripe Checkout securely in an in-app browser
      await WebBrowser.openBrowserAsync(response.data.url);
      
      // 3. When the user closes the browser, the Firestore listener (in _layout.tsx) 
      // will automatically update the UI if the webhook succeeded!
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <View>
      <Text>Current Plan: {tier}</Text>
      {tier === 'free' && (
        <Button title="Upgrade to Pro ($15/mo)" onPress={() => handleUpgrade('pro')} />
      )}
    </View>
  );
}
```

---

## 🔔 6. Webhook & Data Flow (The Big Picture)

1. **User taps "Upgrade"** in the mobile app.
2. Mobile app calls `POST /api/create-checkout-session` on your Node.js backend.
3. Backend creates a Stripe URL and returns it.
4. Mobile app opens the URL in a secure WebBrowser. User pays via Apple Pay/Credit Card.
5. Stripe sends a `checkout.session.completed` webhook to your Node.js backend.
6. Backend verifies the webhook and updates the user's `subscriptionTier` in Firebase Firestore.
7. The mobile app's `onSnapshot` listener detects the Firestore change instantly.
8. The mobile app UI updates to "Pro" automatically.

---

## 🌍 7. Backend Deployment

### Option A: Cloud Deployment (Recommended: Render or Railway)
1. Push your Node.js backend to GitHub.
2. Create an account on [Render.com](https://render.com).
3. Click "New Web Service", connect your repo.
4. Add your Environment Variables (`STRIPE_SECRET_KEY`, etc.).
5. Render automatically provisions an HTTPS domain (e.g., `hvac-api.onrender.com`).
6. Update your Stripe Webhook URL in the Stripe Dashboard to point to this new domain.

### Option B: Hosting on your own PC (Local Server)
If you want to run the Node.js server on your home PC:
1. **Port Forwarding:** Log into your home router (usually `192.168.1.1`). Forward port `3000` to your PC's local IP address.
2. **Domain Setup:** Use a Dynamic DNS service like No-IP or DuckDNS to get a domain (e.g., `myhvac.duckdns.org`) that points to your home's public IP.
3. **SSL (HTTPS):** Stripe Webhooks and Mobile Apps **REQUIRE** HTTPS. 
   - Install Nginx on your PC.
   - Use Certbot (Let's Encrypt) to generate a free SSL certificate for your domain.
   - Configure Nginx to reverse-proxy traffic from port 443 (HTTPS) to your Node.js app on port 3000.
4. **Security:** Ensure your PC firewall only allows ports 80 and 443. Keep Node.js updated.

---

## 📦 8. Build & Deployment (EAS)

Expo Application Services (EAS) builds the app in the cloud.

### 1. Setup
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 2. Android (Google Play Store)
1. Create a Google Play Developer account ($25 one-time).
2. Run `eas build --platform android --profile production`
3. EAS will generate an `.aab` (Android App Bundle) file.
4. Upload this file to the Google Play Console.

### 3. iOS (Apple App Store)
1. Create an Apple Developer account ($99/year).
2. Run `eas build --platform ios --profile production`
3. EAS will ask you to log into your Apple account. It will automatically generate your Certificates and Provisioning Profiles!
4. Once built, run `eas submit -p ios` to send it directly to App Store Connect.

---

## 🚨 9. App Store Requirements for Approval

Apple is incredibly strict. To get approved, you MUST have:
1. **Privacy Policy URL:** Hosted on your website.
2. **Terms of Service (EULA):** Standard Apple EULA is fine.
3. **Subscription Disclosure:** On the screen where the user buys the subscription, you MUST clearly state:
   - Title of publication or service
   - Length of subscription
   - Price
   - That payment will be charged to their account
   - That it auto-renews unless canceled 24 hours before the end of the period.
4. **Delete Account Feature:** Apple requires a button inside the app to completely delete the user's account and data.
5. **Restore Purchases:** If using Apple IAP, you must have a "Restore Purchases" button. (If using the WebBrowser Stripe workaround, you don't need this, but you might get rejected for bypassing IAP).

---

## 🧪 10. Testing

1. **Real Devices:** Download the "Expo Go" app on your iPhone/Android. Run `npx expo start` and scan the QR code to test instantly.
2. **Stripe Test Mode:** Use Stripe's test credit cards (e.g., `4242 4242 4242 4242`) in your mobile WebBrowser checkout.
3. **Debugging:** Use `console.log` which will appear in your terminal running `npx expo start`.

---

## 💰 11. Monetization Flow Summary

1. **User** opens mobile app and taps "Upgrade".
2. App opens **Stripe Checkout** (WebBrowser).
3. User pays. Money goes to your **Stripe Account**.
4. Stripe sends Webhook to your **Node.js Backend**.
5. Backend updates **Firebase**.
6. App sees Firebase update and unlocks premium UI.
7. Stripe pays out to your **Bank Account** on a rolling basis (usually 2-day rolling).
8. Unpaid users are blocked by UI conditional rendering (`if (tier === 'free') return <Paywall />`) AND backend security rules (Firestore rules prevent reading premium data).
