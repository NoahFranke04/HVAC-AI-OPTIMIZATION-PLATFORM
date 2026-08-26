# ❄️ HVAC AI - Smart Diagnostics & Optimization System
**React • Node.js • Firebase • Stripe • React Native • Gemini AI**

**Live Demo:** https://hvac-ai-optimization-platform-362221022690.us-central1.run.app

## 📌 Project Overview
A production-ready full-stack SaaS application and companion mobile app that leverages AI to analyze HVAC data plates, predict system failures, and optimize energy consumption. The system provides tiered access, minimizing downtime and maximizing efficiency for both homeowners and commercial technicians.

## 🚀 The Problem & Solution
**Problem:** Managing HVAC systems traditionally relies on manual tracking of unit details. Furthermore, unexpected compressor failures and static running schedules lead to massive replacement costs and energy waste.
**Solution:** I built a comprehensive platform where users can instantly scan AC data plates using AI to extract exact specifications. The system tracks equipment health, processes tiered subscriptions for advanced diagnostics, and provides real-time predictive failure warnings and cost-saving optimization opportunities synced instantly across Web and Mobile.

## ⚙️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, TypeScript
* **Backend:** Node.js (Express), REST API
* **Database & Auth:** Firebase (Firestore, Authentication)
* **Mobile App:** React Native, Expo (Reader App Model)
* **Payments:** Stripe (Checkout, Billing Portal, Secure Webhooks)
* **AI Engine:** Google Gemini API (1.5 Flash Vision)

## ✨ Core Features
* **AI Data Plate Scanner:** Multimodal vision processing instantly extracts model number, serial number, tonnage, and refrigerant info from photos of AC unit stickers.
* **Predictive Diagnostics:** Pro & Commercial tier users receive AI-driven insights on failure risks (e.g., compressor degradation based on runtime cycles).
* **Real-time Subscription Sync:** Stripe webhooks securely update Firestore in the backend, which pushes state changes live to the Expo mobile app via `onSnapshot` listeners.
* **Cross-Platform Ecosystem:** Seamless integration between the Vite web administration dashboard and the React Native application.

## 🧠 AI Integration Details
The platform utilizes the **Google Gemini 1.5 Flash** multimodal vision model to process complex, often degraded physical data plate stickers on outdoor HVAC units. Through specialized prompting, it calculates estimated cooling tonnage directly from nomenclature inside model numbers (e.g., identifying '036' as 3 tons) and outputs strict, structured JSON. This eliminates manual data entry and builds an accurate equipment database instantly.
