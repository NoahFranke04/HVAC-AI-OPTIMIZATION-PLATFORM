import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export const trackEvent = async (eventType: string, metadata: any = {}) => {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, 'analytics'), {
      userId: user?.uid || 'anonymous',
      eventType,
      metadata,
      timestamp: serverTimestamp(),
      url: window.location.pathname
    });
  } catch (err) {
    console.error('Analytics error:', err);
  }
};

export const useAnalytics = () => {
  return { trackEvent };
};
