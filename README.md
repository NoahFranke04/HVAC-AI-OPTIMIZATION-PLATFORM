# ❄️ HVAC AI - Smart Diagnostics & Optimization System

**React • TypeScript • Node.js • Express • Firebase • Stripe • Google Gemini AI**

**Live Demo:** https://hvac-ai-optimization-platform-362221022690.us-central1.run.app

---

## 📌 Project Overview

The **HVAC AI - Smart Diagnostics & Optimization System** is a full-stack, AI-powered SaaS application designed to help homeowners and HVAC professionals better understand, manage, and optimize HVAC systems.

The platform combines **AI-powered HVAC equipment identification** with **intelligent temperature recommendations and energy optimization**.

Users can upload photos of HVAC equipment data plates to automatically extract important technical information, including model numbers, serial numbers, manufacturing information, tonnage, and refrigerant type. The system can also analyze multiple environmental and user-provided factors to generate recommended thermostat settings designed to balance **comfort, energy efficiency, HVAC workload, and potential cost savings**.

The goal is to replace manual HVAC research and generic thermostat recommendations with a smarter, data-driven system.

The application combines:

* 📷 AI-powered HVAC data plate analysis
* 🌡️ Intelligent thermostat recommendations
* ⚡ Energy optimization insights
* 💰 Potential cost-saving recommendations
* ☁️ Persistent equipment history
* 🔐 Secure user authentication
* 💳 SaaS subscription management
* 🧠 Google Gemini AI integration
* 🛡️ Protected backend APIs and rate limiting
* 🚀 Cloud-ready deployment architecture

---

# 🚀 The Problem & Solution

## ❌ The Problem

HVAC systems contain a large amount of important technical information, but accessing and interpreting that information can be difficult.

HVAC technicians and homeowners may need to:

1. Locate the equipment data plate.
2. Manually read faded or damaged information.
3. Record model and serial numbers.
4. Search manufacturer nomenclature charts.
5. Decode equipment capacity.
6. Determine the age of the equipment.
7. Identify refrigerant information.
8. Manually enter the results into another system.

For example, HVAC model numbers may contain capacity information such as:

```text
024 → 2 Tons
036 → 3 Tons
048 → 4 Tons
060 → 5 Tons
```

Different manufacturers use different naming conventions, which can make identifying equipment information time-consuming.

On the optimization side, many people also use **static thermostat settings** without considering the current conditions of their home or HVAC system.

A fixed recommendation does not necessarily account for factors such as:

* Current indoor temperature
* Outdoor conditions
* Humidity
* Time of day
* Occupancy
* User comfort preferences
* HVAC equipment information
* Energy efficiency considerations

This can potentially result in unnecessary energy usage, increased HVAC workload, and higher operating costs.

---

## ✅ The Solution

I built a full-stack AI platform that helps transform HVAC information and environmental inputs into useful, structured recommendations.

The system provides two major AI-powered capabilities:

### 📷 1. HVAC Equipment Intelligence

Users upload a photo of an HVAC equipment data plate.

The system uses AI vision to extract information such as:

* Model number
* Serial number
* Manufacturing year
* Equipment tonnage
* Refrigerant type

### 🌡️ 2. Temperature & Energy Optimization

The system can analyze multiple environmental and user-provided factors to generate an intelligent thermostat recommendation.

The goal is to help users find a balance between:

* 😌 Comfort
* ⚡ Energy efficiency
* 💰 Potential energy savings
* 🔧 Reduced HVAC workload

```text
📷 HVAC Equipment Data
          +
🌡️ Indoor Conditions
          +
☀️ Environmental Factors
          +
👤 User Preferences
          ↓
      🧠 AI Analysis
          ↓
📊 Smart Recommendations
          ↓
🌡️ Recommended Temperature
          +
⚡ Energy Optimization Insights
```

This allows the platform to move beyond simple equipment identification and toward a broader **AI-powered HVAC optimization system**.

---

# ⚙️ Tech Stack

* **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, TypeScript
* **Database:** Firebase Firestore
* **Authentication:** Firebase Authentication + Firebase Admin
* **Payments:** Stripe Checkout, Billing Portal, Secure Webhooks
* **AI Engine:** Google Gemini AI using the `@google/genai` SDK
* **Security:** Firebase ID Token Verification, Rate Limiting, Stripe Webhook Verification
* **Build Tools:** Vite, esbuild, tsx
* **UI:** React Router DOM, Lucide React, Motion, Recharts
* **Deployment:** Container-ready architecture for platforms such as Google Cloud Run

---

# ✨ Core Features

## 📷 AI HVAC Data Plate Scanner

Users can upload an image of an HVAC equipment data plate.

The backend securely sends the image to **Google Gemini AI**, which analyzes the image and extracts important equipment information.

Example output:

```json
{
  "modelNumber": "24ABB336A00300",
  "serialNumber": "1214E12345",
  "manufactureYear": 2014,
  "tonnage": 3,
  "refrigerant": "R-410A"
}
```

The AI is instructed to return **structured JSON**, allowing the application to reliably process, store, and display the results.

This eliminates much of the manual process of:

* Reading equipment labels
* Searching manufacturer documentation
* Interpreting model numbers
* Determining cooling capacity
* Recording equipment information

---

## 🌡️ AI Temperature Recommendations

The platform can analyze multiple pieces of information to generate a recommended thermostat setting.

Rather than providing the same generic recommendation to every user, the system evaluates the user's current situation and generates a recommendation based on multiple factors.

These factors can include:

* 🌡️ Current indoor temperature
* ☀️ Outdoor environmental conditions
* 💧 Humidity
* 🕒 Time and current conditions
* 👥 Occupancy
* 😌 User comfort preferences
* ❄️ HVAC equipment information
* ⚡ Energy efficiency considerations

The system is designed to answer questions such as:

> **Based on the current conditions, what temperature should the thermostat be set to in order to balance comfort and energy efficiency?**

The resulting recommendation can help users make more informed HVAC decisions while potentially reducing unnecessary energy consumption.

---

## ⚡ Energy Optimization Insights

The platform extends beyond simply identifying HVAC equipment.

By combining environmental conditions, equipment information, and user inputs, the system can provide optimization-focused recommendations.

The goal is to help users understand how their HVAC settings may affect:

* Energy usage
* Operating costs
* System workload
* Indoor comfort

```text
Current Conditions
       +
HVAC Equipment Data
       +
Environmental Factors
       +
User Preferences
       ↓
   AI Analysis
       ↓
Temperature Recommendation
       +
Energy Optimization Insights
       ↓
Potential Cost-Saving Opportunities
```

This creates a foundation for a smarter HVAC decision-making system.

---

## 🔐 Secure User Authentication

The application uses **Firebase Authentication** to manage user accounts and authentication.

Protected API requests include a Firebase ID token:

```text
Authorization: Bearer <firebase-id-token>
```

The backend verifies the token before allowing access to protected functionality.

```text
👤 User Login
       ↓
Firebase Authentication
       ↓
Firebase ID Token
       ↓
🔐 Authorization Header
       ↓
verifyAuth Middleware
       ↓
Firebase Admin SDK
       ↓
✅ Verified User
```

The backend does not simply trust a user ID sent by the frontend.

Instead, the Firebase token is verified and a trusted user identity is extracted.

This helps prevent user ID spoofing.

---

## ☁️ Persistent Equipment History

Successful HVAC scans can be stored in **Firebase Firestore**.

This allows users to build a persistent, cloud-based record of HVAC equipment.

Stored information can include:

* User ID
* Model number
* Serial number
* Manufacturing information
* Equipment tonnage
* Refrigerant type
* Scan timestamps

This provides a foundation for future features such as:

* Equipment inventories
* Maintenance tracking
* Property records
* Customer equipment history
* Analytics
* Commercial equipment management

---

## 💳 SaaS Subscription System

The platform includes tiered subscription infrastructure powered by **Stripe**.

### 🆓 Free

Entry-level access with limited functionality or usage.

### 🏠 Home

Designed for homeowners who want to better understand and manage their HVAC systems.

Potential functionality includes:

* HVAC equipment identification
* Equipment information storage
* Temperature recommendations
* Energy optimization insights

### 🔧 Pro

Designed for HVAC professionals who may require:

* Increased usage limits
* Equipment history
* Advanced AI insights
* Additional optimization tools

### 🏢 Commercial

Designed as the foundation for larger organizations and future multi-user functionality.

Potential capabilities include:

* Multiple users
* Shared equipment databases
* Larger equipment inventories
* Centralized management
* Commercial analytics

---

## 🔄 Subscription Lifecycle Management

Stripe manages the payment process while the backend synchronizes the user's subscription status with Firestore.

```text
👤 User Clicks Upgrade
          ↓
💳 Stripe Checkout Session
          ↓
💰 Payment Completed
          ↓
🔔 Stripe Webhook
          ↓
🔐 Backend Verifies Event
          ↓
☁️ Firestore Updated
          ↓
🚀 User Access Updated
```

The system supports subscription lifecycle events such as:

* Successful checkout
* Subscription updates
* Subscription cancellation

---

# 🧠 AI Integration Details

The platform uses **Google Gemini AI** to process both HVAC equipment information and optimization-related inputs.

## AI Equipment Analysis

The AI receives:

```text
📷 HVAC Data Plate Image
          +
📝 Specialized HVAC Instructions
          ↓
🧠 Google Gemini AI
          ↓
🔍 Extract Equipment Information
          ↓
⚙️ Interpret Model Information
          ↓
📊 Structured JSON Response
```

The AI is instructed to return structured data instead of a conversational response.

For example, instead of:

> "This appears to be approximately a three-ton HVAC unit."

The backend can receive:

```json
{
  "tonnage": 3
}
```

This makes the AI output easier to validate, process, store, and display.

---

## AI Temperature Optimization

The optimization system uses available environmental, system, and user-provided information to generate a recommendation.

Conceptually:

```text
🌡️ Current Temperature
          +
☀️ Environmental Conditions
          +
💧 Humidity
          +
👤 User Preferences
          +
❄️ HVAC Information
          +
⚡ Efficiency Considerations
          ↓
       🧠 AI Engine
          ↓
🌡️ Recommended Temperature
          +
📊 Optimization Insights
```

The purpose is not simply to recommend an arbitrary temperature.

The system is designed to evaluate multiple factors and provide a more contextual recommendation focused on balancing comfort and efficiency.

---

# 🏗️ System Architecture

The application uses a full-stack architecture consisting of a React frontend and a Node.js/Express backend.

```text
                         👤 User
                            │
                            ▼
                  ┌───────────────────┐
                  │   React Frontend  │
                  │                   │
                  │ • User Interface  │
                  │ • Image Upload    │
                  │ • HVAC Inputs     │
                  │ • Optimization    │
                  │ • Authentication  │
                  └─────────┬─────────┘
                            │
                    🔐 Bearer Token
                            │
                            ▼
                  ┌───────────────────┐
                  │ Express Backend   │
                  │                   │
                  │ • API Routes      │
                  │ • Authentication  │
                  │ • Rate Limiting   │
                  │ • AI Processing   │
                  │ • Stripe Logic    │
                  └───────┬─────┬─────┘
                          │     │
              ┌───────────┘     └───────────┐
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │   Gemini AI     │           │     Stripe      │
     │                 │           │                 │
     │ • Vision        │           │ • Checkout      │
     │ • HVAC Analysis │           │ • Billing       │
     │ • Optimization  │           │ • Webhooks      │
     │ • JSON Output   │           └────────┬────────┘
     └────────┬────────┘                    │
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    ┌─────────────────┐
                    │    Firestore    │
                    │                 │
                    │ • Users         │
                    │ • Equipment     │
                    │ • Scan History  │
                    │ • Subscriptions │
                    └─────────────────┘
```

The frontend is treated as an **untrusted environment**, while sensitive operations occur on the backend.

Sensitive credentials such as:

```text
GEMINI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
FIREBASE_SERVICE_ACCOUNT_KEY
```

are stored securely on the server and should never be exposed in client-side code.

---

# 🔌 API Functionality

## 🩺 Health Check

```http
GET /api/health
```

Used for application and deployment health checks.

Example response:

```json
{
  "status": "ok"
}
```

---

## 📷 AI HVAC Data Plate Analysis

```http
POST /api/scan-data-plate
```

Analyzes an HVAC equipment data plate using AI.

**Authentication Required:** ✅

```text
Authorization: Bearer <firebase-id-token>
```

Processing flow:

```text
Request Received
       ↓
Verify Firebase Token
       ↓
Process Image
       ↓
Prepare AI Request
       ↓
Gemini Vision Analysis
       ↓
Parse Structured Response
       ↓
Store Equipment Data
       ↓
Return Results
```

---

## 🌡️ HVAC Optimization

The application processes available HVAC, environmental, and user-provided information to generate temperature and optimization recommendations.

Conceptually:

```text
User Inputs
     ↓
Authentication
     ↓
Backend Processing
     ↓
AI Analysis
     ↓
Recommended Temperature
     +
Optimization Insights
```

---

## 💳 Create Checkout Session

```http
POST /api/create-checkout-session
```

Creates a Stripe Checkout session for subscription upgrades.

---

## ⚙️ Manage Subscription

```http
POST /api/create-portal-session
```

Creates a Stripe Billing Portal session where users can manage their subscriptions and billing information.

---

## 🔔 Stripe Webhook

```http
POST /api/webhook
```

Receives subscription events directly from Stripe and synchronizes subscription information with Firestore.

---

# 🔒 Security Architecture

## 🔐 Firebase ID Token Verification

Protected requests follow this flow:

```text
Frontend Request
      ↓
Firebase ID Token
      ↓
Authorization Header
      ↓
verifyAuth Middleware
      ↓
firebaseAdmin.auth().verifyIdToken()
      ↓
✅ Verified User
      ↓
Protected API Access
```

This prevents users from impersonating other users by manually modifying a user ID in a request.

---

## 🛡️ Rate Limiting

The backend uses `express-rate-limit` to help protect against:

* API abuse
* Automated attacks
* Excessive AI API usage
* Unexpected cloud costs

The documented configuration limits requests to approximately:

```text
100 Requests / 15 Minutes
```

---

## 💳 Stripe Webhook Verification

Stripe webhook events are cryptographically verified before being processed.

This helps prevent malicious users from sending fake requests claiming that a payment or subscription update occurred.

---

# 📁 Project Structure

```text
project-root/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── index.html
├── server.ts
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   └── components/
│
└── dist/
    ├── index.html
    ├── assets/
    └── server.cjs
```

## Important Files

| File             | Purpose                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| `server.ts`      | Express backend, API routes, authentication, AI integration, Stripe, and Firestore |
| `src/main.tsx`   | React application entry point                                                      |
| `src/App.tsx`    | Main application component and application logic                                   |
| `src/index.css`  | Global styling                                                                     |
| `vite.config.ts` | Vite configuration                                                                 |
| `package.json`   | Dependencies, scripts, and build configuration                                     |

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the required credentials.

Example:

```env
PORT=3000
NODE_ENV=development

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

FIREBASE_SERVICE_ACCOUNT_KEY=YOUR_SERVICE_ACCOUNT_KEY

STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

STRIPE_PRICE_ID_HOME=YOUR_HOME_PRICE_ID
STRIPE_PRICE_ID_PRO=YOUR_PRO_PRICE_ID
STRIPE_PRICE_ID_COMMERCIAL=YOUR_COMMERCIAL_PRICE_ID
```

> ⚠️ Never commit real API keys, service account credentials, or Stripe secrets to GitHub.

---

# 💻 Local Development

Start the development environment:

```bash
npm run dev
```

The application supports a modern React/Vite frontend development workflow alongside the Node.js backend.

---

# 📦 Production Build

Build the application:

```bash
npm run build
```

The production pipeline:

```text
React + Vite
      ↓
Frontend Build
      ↓
Static Assets
      +
Node.js + esbuild
      ↓
Production Backend
      ↓
Deployable Application
```

Start the production application:

```bash
npm start
```

---

# ☁️ Deployment

The application is designed to run as a single cloud-deployable service.

A platform such as Google Cloud Run can host:

* The Express backend
* Protected API endpoints
* The compiled React frontend

The backend supports dynamically assigned deployment ports through:

```text
process.env.PORT
```

This makes the application compatible with modern container-based cloud environments.

---

# 💰 Business Model & Real-World Potential

The application was designed around a potential SaaS business model.

## 🏠 Homeowners

Homeowners could use the platform to:

* Identify HVAC equipment
* Determine equipment age
* Understand refrigerant information
* Store HVAC system information
* Receive thermostat recommendations
* Discover energy optimization opportunities

Potential monetization models include:

* Freemium access
* Monthly subscriptions
* Annual subscriptions
* Pay-per-analysis or reports

---

## 🔧 HVAC Technicians

HVAC professionals could potentially use the platform to:

* Identify equipment faster
* Reduce manual data entry
* Maintain equipment records
* Quickly interpret HVAC information
* Provide customers with equipment insights
* Use AI-assisted optimization recommendations

A professional subscription could provide:

* Increased AI usage limits
* Advanced equipment history
* Customer equipment management
* Additional optimization tools

---

## 🏢 Commercial HVAC Companies

Future commercial functionality could support:

```text
HVAC Company
│
├── 👨‍💼 Administrator
├── 🔧 Technician Accounts
├── 🏢 Multiple Properties
├── ❄️ Equipment Inventory
├── 📊 Energy Insights
└── ☁️ Shared Database
```

Potential revenue opportunities include:

* Commercial SaaS subscriptions
* Multi-user accounts
* Business licensing
* API access
* CRM integrations
* Equipment management tools

---

# 🗺️ Future Roadmap

## 🔥 High Priority

* Improved HVAC optimization recommendations
* More detailed energy-saving insights
* Equipment maintenance tracking
* Historical equipment analytics
* Expanded AI capabilities

## ⚙️ Medium Priority

* Team accounts
* Commercial dashboards
* Customer equipment management
* Advanced reporting
* More detailed cost analysis

## 📱 Long-Term

* Dedicated mobile application
* Direct camera integration
* Push notifications
* Offline/PWA support
* IoT and smart thermostat integrations
* Sensor data analysis
* Predictive maintenance capabilities
* CRM integrations
* Public or commercial API access

---

# ⚠️ Current Limitations

* AI accuracy depends on the quality of the uploaded image and available input data.
* Damaged or unreadable equipment plates may produce incomplete information.
* AI recommendations should be reviewed when accuracy is critical.
* Energy savings can vary depending on the building, equipment, weather, utility rates, and user behavior.
* The AI functionality requires an internet connection.
* The application is intended to assist with HVAC decision-making and does not replace professional HVAC inspection or service.

---

# 🎯 Key Concepts Demonstrated

This project demonstrates experience with:

* Full-stack TypeScript development
* React application development
* Node.js and Express
* REST API architecture
* AI and multimodal image analysis
* Structured AI output
* AI-driven recommendations
* Firebase Authentication
* Firebase Admin
* Secure token verification
* Firestore databases
* Stripe subscriptions
* Stripe webhooks
* SaaS architecture
* API security
* Rate limiting
* Environment variable management
* Cloud deployment
* Production build pipelines

---

# 💡 Project Motivation

This project was built to explore how **modern AI can be integrated into a complete, real-world software product**.

Rather than creating a generic chatbot, the goal was to apply AI to practical HVAC-related problems.

The platform focuses on two main challenges:

> **How can physical HVAC equipment information be converted into useful digital data?**

and:

> **How can multiple environmental and user-specific factors be analyzed to provide smarter HVAC and temperature recommendations?**

By combining AI with full-stack software engineering, the project demonstrates how multimodal AI can become part of a complete SaaS product.

---

# 🧩 Technology Summary

| Technology              | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| TypeScript              | Type-safe full-stack development                   |
| React 19                | Frontend user interface                            |
| Vite                    | Frontend development and builds                    |
| Tailwind CSS            | Responsive UI styling                              |
| Node.js                 | Backend runtime                                    |
| Express                 | API and server architecture                        |
| Firebase Authentication | User authentication                                |
| Firebase Admin          | Server-side token verification                     |
| Firestore               | Cloud database                                     |
| Google Gemini AI        | HVAC image analysis and AI-powered recommendations |
| Stripe                  | Subscription and payment management                |
| `express-rate-limit`    | API abuse protection                               |
| esbuild                 | Backend production bundling                        |
| React Router            | Client-side navigation                             |
| Lucide React            | User interface icons                               |
| Motion                  | UI animations                                      |
| Recharts                | Data visualization capabilities                    |

---

# ⭐ Final Summary

The **HVAC AI - Smart Diagnostics & Optimization System** combines modern AI with full-stack SaaS architecture to create a smarter way to understand and manage HVAC systems.

By combining:

```text
📷 AI Vision
      +
🌡️ Smart Temperature Recommendations
      +
⚡ Energy Optimization
      +
⚛️ React
      +
🟢 Node.js
      +
🔥 Firebase
      +
🧠 Google Gemini AI
      +
💳 Stripe
```

the application provides a foundation for an HVAC-focused platform capable of:

* Automatically identifying HVAC equipment from images
* Extracting structured technical information
* Building persistent equipment records
* Analyzing multiple factors for smarter thermostat recommendations
* Providing energy optimization insights
* Helping identify potential cost-saving opportunities
* Managing secure user accounts
* Supporting SaaS subscriptions
* Scaling into homeowner, professional, and commercial use cases

The project demonstrates how **AI can be combined with traditional full-stack software engineering to solve practical, real-world problems**.

**If you found this project interesting, feel free to ⭐ the repository!**
