# Velocity Sneakers - Application Workflow Overview

This document describes the structural and interactive architecture of the **Velocity Sneakers** eCommerce application. It outlines the core system flow, data relationships, and state transitions using illustrative flowcharts.

---

## 1. High-Level Architecture Flow

The application follows a full-stack architecture. The frontend is built on **React 19 + TypeScript + Vite**, powered by a **Firestore** real-time database, with server-side proxy elements running on an **Express** node backend.

```mermaid
graph TD
    subgraph Client [Client-Side Browser]
        UI[React Components / Pages] <--> Context[App Context / useApp Hook]
        Context <--> PaystackHook[usePaystack Hook]
    end

    subgraph FirebaseServices [Firebase Cloud Platform]
        Auth[Firebase Authentication] <--> ProfileDB[Firestore: 'users' Collection]
        RealTimeDB[(Cloud Firestore)]
    end

    subgraph ExternalGateways [External Gateways]
        PayGateway[Paystack Payment Service]
    end

    subgraph Server [Production Service Container]
        API[Express Router / server.ts]
    end

    UI <--> RealTimeDB
    Context <--> Auth
    PaystackHook <--> PayGateway
    UI <--> API
```

---

## 2. Core Operational Workflows

Below are interactive workflows outlining state and data transitions across primary application features.

### A. Authentication & Session Bootstrapping
When a user launches the application, their session goes through a state synchronization sequence:

```mermaid
flowchart TD
    Start([User Opens App]) --> CheckAuth[AppProvider Listens to onAuthStateChanged]
    CheckAuth --> IsLoggedIn{User Authenticated?}
    
    IsLoggedIn -- Yes --> FetchProfile[Fetch profile from Firestore 'users' collection]
    FetchProfile --> SetRole{Is User Admin?}
    SetRole -- Yes --> AllowAdmin[Grant administrative controls in Nav & Dashboard]
    SetRole -- No --> StandardDashboard[Grant consumer access dashboard]
    
    IsLoggedIn -- No --> PublicMode[Show limited public features]
    PublicMode --> TriggerAuth[User signs in at /auth]
    TriggerAuth --> CreateProfile{Profile exists in DB?}
    CreateProfile -- No --> WriteProfile[Create profile with standard consumer role]
    CreateProfile -- Yes --> FetchProfile
```

---

### B. Catalog Exploration, Filter, and Collections
The product catalogue and dynamic categories stream directly from the static seed data fallback and live Firestore database collections:

```mermaid
flowchart TD
    Browse([Browse Shoes at /products]) --> ParseParams[Parse search/category query params]
    ParseParams --> CheckPredefined[Apply filter: category, search words, brand, sorted price/recency]
    
    CollectionTab[View Collections at /collections] --> FetchCollections[Retrieve Collections from 'collections' and static fallback]
    FetchCollections --> ClickCollection[Filter product search parameters based on category]
    
    ClickProduct[Click individual sneaker card] --> LoadDetails[Display Product Details at /product/:id]
    LoadDetails --> RealtimeReviews[Stream active reviews under product using onSnapshot]
```

---

### C. Shopping Cart, Payment Checkout, and Notification Flow
Orders undergo atomic validation, processing, and checkout verification before generating notifications:

```mermaid
flowchart TD
    AddToCart[Add Sneaker to Cart] --> CheckQty[Validate stock configuration]
    CheckQty --> UpdateLocalState[Update useApp cart array state]
    
    NavigateCart[Open /cart] --> VerifyUser{Is User Logged In?}
    VerifyUser -- No --> RedirectAuth[Prompt Authentication at /auth]
    VerifyUser -- Yes --> StartCheckout[Initiate Paystack checkout trigger]
    
    StartCheckout --> LoadGateway[Load Paystack Inline Iframe Widget]
    LoadGateway --> ProcessPay{Was Payment Authorized By Bank?}
    
    ProcessPay -- Yes --> SaveOrder[Create database purchase record in 'orders' collection]
    SaveOrder --> ClearLocalCart[Clear App Context Cart state]
    ClearLocalCart --> GenerateNotification[Push Success Notification in 'notifications' DB]
    GenerateNotification --> RedirectDashboard[Redirect User to /dashboard/orders]
    
    ProcessPay -- No --> DisplayFailure[Show Payment Attempt Failed inline alert]
```

---

### D. Wishlist Persistence Mechanism
The Wishlist logic is decoupled from local session loss, utilizing both real-time DB states and fallback sample assets:

```mermaid
flowchart TD
    WishlistClick[User Toggles Wishlist Icon] --> CheckLogin{Is User Logged In?}
    CheckLogin -- No --> RedirectLogin[Redirect user to authentication portal]
    CheckLogin -- Yes --> FindInWishlist{Sneaker ID in Wishlist Array?}
    
    FindInWishlist -- Yes --> PullItem[Remove sneaker ID and update Firestore users document]
    FindInWishlist -- No --> PushItem[Append sneaker ID and update Firestore users document]
    
    PullItem --> SyncView[Rerender list interface dynamically with layout animations]
    PushItem --> SyncView
```

---

## 3. Database Schema Overview

The database uses Firestore to build relationships between users, items, transactions, reviews, and notifications:

*   **`users/{uid}`**: User profiles (email, full name, profile picture, wishlist arrays, and user permission level tags). Prevented email layout string truncation.
*   **`sneakers/{sneakerId}`**: Dynamic product archives containing custom configurations (brand names, pricing, description, imagery assets, sizes, tags, stock records).
*   **`reviews/{reviewId}`**: Verified user testimonials (rating index, product reference, timestamp, username).
*   **`orders/{orderId}`**: Detailed individual e-payments, logistics track sheets, transaction details, and reference codes.
*   **`collections/{colId}`**: Dynamic curated product categorizations.
*   **`notifications/{notifyId}`**: Inline real-time alerts shown to the user on completion of logistics activities or purchases.
