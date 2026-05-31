# Velox Sneakers eCommerce

An interactive, high-performance, and beautifully crafted sneakers eCommerce store featuring premium animations, seamless shopping interactions, wishlist persistence, verified user reviews, real-time notifications, and integrated Paystack payments.

---

## 🚀 Key Features

*   **Dynamic Shoe Showcase**: Fast filtering and sorting by pricing, release recency, brands, categories (Men, Women, Sports, Lifestyle), and sizes.
*   **Wishlist Synchronization**: Wishlist items are kept persistent and securely saved under the user's Firestore profile.
*   **Paystack Integration**: Modern, seamless local and international transaction processing using standard Paystack inline SDKs with unified server-side payment verification.
*   **Dynamic Collections**: Curated sneaker drops streamed directly from Firestore with robust static fallbacks.
*   **Real-time Review Engine**: Allows users to post verified buy-cycle testimonials with dynamic real-time ratings and testimonial streams.
*   **Admin Console Control**: Dynamic dashboard configurations allow admins to update product stock, deploy new collections, and oversee notification channels.
*   **Responsive Flow Architecture**: Fluid visual cues, stagger animations, and micro-interactions powered by `motion` (Framer Motion).

---

## 🛠️ Tech Stack

*   **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
*   **Animations**: Framer Motion (`motion/react`)
*   **Database & Auth**: Firebase (Firestore, Cloud Authentication)
*   **Payment Gateway**: Paystack Payments
*   **Serverless Function Backend**: Vercel Serverless Functions + Express Sandbox Express

---

## 📦 Project Directory Breakdown

```
├── api/                   # Vercel Serverless API handlers
│   ├── health.ts          # API container status monitor
│   └── verify-payment.ts  # Paystack server-side lookup validation
├── src/
│   ├── components/        # Isolated modular display units (Navbar, ProductCard, etc.)
│   ├── pages/             # Route-level screens (Home, Products, Auth, Dashboard, etc.)
│   ├── lib/               # Utility scripts & Firestore seed connectors
│   ├── App.tsx            # Navigation routers and page mounts
│   └── main.tsx           # Global standard renderer
├── vercel.json            # Vercel platform runtime routing config
├── FLOWCHART.md           # Application operational workflow maps
└── firestore.rules        # Secure Firestore user validation filters
```

---

## 🔧 Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:
```env
# Client-side configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Server-side (Vercel Serverless / Local Express Proxy)
PAYSTACK_SECRET_KEY=your_paystack_real_secret_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deployment Guidelines

### Vercel Deployment

This project is optimized out-of-the-box for serverless deployment on Vercel. 

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: Add your Paystack Secret and Firebase client properties under **Environment Variables** in the Vercel project setting menu.
