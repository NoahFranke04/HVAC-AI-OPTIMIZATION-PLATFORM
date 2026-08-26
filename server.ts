import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Initialize Firebase Admin
let db: admin.firestore.Firestore | null = null;
function getDb(): admin.firestore.Firestore {
  if (!db) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
      }
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found. Webhook database updates will be skipped.');
    }
  }
  return db || admin.firestore(); // Fallback if already initialized elsewhere
}

// Initialize Stripe
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return stripeClient;
}

// Authentication Middleware
const verifyAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

async function startServer() {
  const app = express();
  // Cloud Run injects PORT. The sandbox injects DEFAULT_APP_PORT=3000.
  const PORT = process.env.DEFAULT_APP_PORT 
    ? parseInt(process.env.DEFAULT_APP_PORT, 10)
    : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

  // Webhook endpoint needs raw body
  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      res.status(400).send('Webhook secret or signature missing');
      return;
    }

    let event;
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    const eventId = event.id;
    const firestoreDb = getDb();
    
    if (firestoreDb) {
      const eventRef = firestoreDb.collection('stripe_events').doc(eventId);
      const eventDoc = await eventRef.get();
      
      if (eventDoc.exists) {
        console.log(`Webhook event ${eventId} already processed, skipping.`);
        res.json({ received: true });
        return;
      }
      
      await eventRef.set({ processedAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        console.log('Checkout completed for user:', userId);
        
        if (userId) {
            try {
                const firestoreDb = getDb();
                if (firestoreDb) {
                    // Determine tier from price ID or metadata
                    // For simplicity, we'll assume the tier is passed in metadata or we can infer it
                    // In a real app, you'd map price IDs to tiers
                    const tier = session.metadata?.tier || 'pro'; // Default to pro if not set
                    
                    await firestoreDb.collection('users').doc(userId).set({
                        subscriptionTier: tier,
                        stripeCustomerId: session.customer,
                        subscriptionStatus: 'active'
                    }, { merge: true });
                    console.log(`Successfully updated user ${userId} to tier ${tier}`);
                }
            } catch (error) {
                console.error('Error updating user in Firestore:', error);
            }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        
        try {
            const firestoreDb = getDb();
            if (firestoreDb) {
                const usersRef = firestoreDb.collection('users');
                const snapshot = await usersRef.where('stripeCustomerId', '==', subscription.customer).get();
                
                if (!snapshot.empty) {
                    const userId = snapshot.docs[0].id;
                    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
                    const tier = isActive ? (subscription.metadata?.tier || 'pro') : 'free';
                    
                    await usersRef.doc(userId).set({
                        subscriptionTier: tier,
                        subscriptionStatus: subscription.status
                    }, { merge: true });
                    console.log(`Successfully updated user ${userId} to tier ${tier}`);
                }
            }
        } catch (error) {
            console.error('Error updating user in Firestore:', error);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);
        
        try {
            const firestoreDb = getDb();
            if (firestoreDb) {
                // Find user by stripeCustomerId
                const usersRef = firestoreDb.collection('users');
                const snapshot = await usersRef.where('stripeCustomerId', '==', subscription.customer).get();
                
                if (!snapshot.empty) {
                    const userId = snapshot.docs[0].id;
                    await usersRef.doc(userId).set({
                        subscriptionTier: 'free',
                        subscriptionStatus: 'canceled'
                    }, { merge: true });
                    console.log(`Successfully downgraded user ${userId} to free tier`);
                }
            }
        } catch (error) {
            console.error('Error downgrading user in Firestore:', error);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Middleware for parsing JSON for other routes
  app.use(express.json());
  app.use(cors());

  // Rate limiting for API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', apiLimiter);

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Create Checkout Session
  app.post('/api/create-checkout-session', verifyAuth, async (req, res) => {
    try {
      const { tier, email, stripeCustomerId } = req.body;
      const userId = (req as any).user.uid;
      const stripe = getStripe();

      // Determine price based on tier (these should be real Stripe Price IDs)
      // For testing, we'll just use a generic price or require the user to set them in env
      const priceId = tier === 'home' 
        ? process.env.STRIPE_PRICE_ID_HOME 
        : tier === 'pro' 
          ? process.env.STRIPE_PRICE_ID_PRO 
          : process.env.STRIPE_PRICE_ID_COMMERCIAL;

      if (!priceId) {
        return res.status(400).json({ error: `Price ID for tier ${tier} not configured.` });
      }

      const sessionConfig: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/dashboard`,
        client_reference_id: userId,
        metadata: {
            tier: tier
        }
      };

      if (stripeCustomerId) {
        sessionConfig.customer = stripeCustomerId;
      } else {
        sessionConfig.customer_email = email;
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create Portal Session
  app.post('/api/create-portal-session', verifyAuth, async (req, res) => {
    try {
      const { customerId } = req.body;
      const stripe = getStripe();

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Data Plate Scanner
  app.post('/api/scan-data-plate', verifyAuth, async (req, res) => {
    try {
      const { imageUrl } = req.body;
      const userId = (req as any).user.uid;
      
      if (!imageUrl) {
        res.status(400).json({ error: "Missing imageUrl" });
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      const prompt = `
        You are an expert HVAC technician. Read this AC unit data plate sticker.
        Extract the info and return STRICTLY a JSON object. 
        If you cannot find a value, use null.
        Calculate tonnage from the model number if possible (e.g., 036 = 3 tons, 048 = 4 tons).
        
        {
          "modelNumber": "string",
          "serialNumber": "string",
          "manufactureYear": "number",
          "tonnage": "number",
          "refrigerant": "string"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [
              { text: prompt },
              { inlineData: { data: Buffer.from(imageBuffer).toString('base64'), mimeType: 'image/jpeg' } }
          ]}
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("No response from AI");

      const extractedData = JSON.parse(resultText);

      const firestoreDb = getDb();
      if (firestoreDb) {
        await firestoreDb.collection('homes').doc(userId).set({
          userId: userId,
          equipment: extractedData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }

      res.json({ success: true, data: extractedData });
    } catch (error: any) {
      console.error("Scanner Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
