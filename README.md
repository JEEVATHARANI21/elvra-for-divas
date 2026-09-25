# 🌿 ELVRA FOR DIVAS — Complete E-Commerce Platform

> **Wings to Explore**  
> *Comfort Looks Good On You.*

A modern, editorial fashion e-commerce platform built with React, TypeScript, Tailwind CSS, Node.js Express, XAMPP MySQL, and Razorpay payment integration.

---

## 🎨 Brand Visual Identity

| Element | Color / Font | Hex / Style |
| :--- | :--- | :--- |
| **Primary** | Sage Green | `#8A9A86` |
| **Secondary** | Warm Sand | `#E5D9C5` |
| **Accent** | Muted Terracotta | `#C88A75` |
| **Background** | Soft Warm Cream | `#FAF8F5` |
| **Typography (Headings)** | Playfair Display / Cormorant Garamond | Editorial Serif |
| **Typography (Body)** | Montserrat / Inter | Clean Modern Sans |

---

## 🚀 Key Features

### 🛍️ Customer Storefront
- **High-Fashion Editorial Homepage**:
  - Hero section featuring *"Wings to Explore"*, soft script accents, and primary action buttons.
  - Brand philosophy narrative (*"Comfort. Confidence. Freedom."*).
  - Four curated category cards (*Everyday Tops, Loungewear, Track Pants, Co-ord Sets*).
  - Dynamic **New Arrivals** catalog.
  - Editorial spotlight banner (*"Softness in every single movement."*).
  - Social proof gallery with Instagram integration (`@elvrafordivas`).
- **Comprehensive Shop & Filtering**:
  - Filter by category, color swatches, sizes (S, M, L, XL), search query, and sorting (Newest, Price Asc/Desc, Popularity).
  - Mobile bottom filter drawer.
- **Curated Collections**:
  - Dedicated collection pages (`/collections/:slug`) for *Everyday Comfort, Lounge Edit, Weekend Edit, New Collection*.
- **Product Detail Experience**:
  - Multi-image gallery with zoom feel.
  - Interactive color swatches and size selector with real-time stock checks.
  - Size Guide modal with imperial bust/waist/hip measurements.
  - Fabric & care recommendations, delivery timelines, and 7-day exchange policies.
  - Verified customer reviews with submission form.
  - Related product recommendations.
- **Bag & Slide-Over Drawer**:
  - Live free shipping progress milestone bar (Complimentary shipping above ₹999).
  - Dynamic coupon code validator (`ELVRA10`, `WELCOME15`).
- **Streamlined 3-Step Checkout & 2026 Razorpay Standard**:
  - **Step 1:** Customer contact and delivery address.
  - **Step 2:** Shipping method and order confirmation.
  - **Step 3:** Razorpay Standard Checkout modal with automatic server-side HMAC-SHA256 signature verification.
  - Authoritative server-side price calculation endpoint (`/api/orders/preview`) preventing client price manipulation.
  - Dedicated asynchronous webhook handler (`/api/payment/webhook`) with unique `event_id` idempotency.
- **Concierge Services**:
  - Floating WhatsApp widget (`@elvrafordivas`) with one-tap quick options (Track Order, Size & Fit, Returns, Stylist).
  - Dedicated public order tracker (`/track-order`).
  - Customer account portal with saved addresses and order history with fulfillment status chips.

### 🛡️ Admin Control Panel (`/admin`)
- **Dashboard**: Real-time sales metrics (Today's Sales, Lifetime Revenue, Pending Orders, Customer Count, Active Products, Low Stock alerts).
- **Product & Inventory Management**: Catalog list, active status indicators, and an interactive **Add New Product Modal** featuring a Color × Size variant matrix generator that automatically creates individual SKUs and stock balances.
- **Inventory Movement Ledger**: Real-time movement tracking (`purchase`, `sale`, `return`, `adjustment`, `damage`) preserving complete stock audit history.
- **Order Fulfillment**: Complete order log, customer details, fulfillment status updater (*Placed &rarr; Confirmed &rarr; Packed &rarr; Shipped &rarr; Delivered &rarr; Cancelled*), and courier tracking number assignment.

---

## 🗄️ Database Architecture (`elvra_for_divas`)

The normalized schema comprises 22 tables:
- `users` (Customer & Admin credentials, generated name, roles)
- `addresses` (Shipping addresses)
- `categories` (Category slugs, imagery, display order)
- `collections` (Curated seasonal edits)
- `products` (Core catalog records, pricing, fabric, fit, category & collection foreign keys)
- `product_images` (Multi-angle photography with image_type)
- `product_variants` (Color × Size matrix with unique SKUs and stock)
- `inventory` (Movement audit history with quantity changes & reasons)
- `carts` & `cart_items` (Guest sessions and customer bags)
- `wishlists` & `wishlist_items` (Customer favorites)
- `orders` & `order_items` (Order records and snapshots with subtotal, discount, shipping, tax, total)
- `payments` (Razorpay order ID, payment ID, signature, status)
- `payment_webhooks` (Event ID, type, payload, processed flag for idempotency)
- `refunds` (Refund records and status)
- `coupons` & `coupon_usages` (Promotional discounts with usage limits)
- `reviews` (Star ratings, fit assessment, comfort score)
- `banners` & `settings` (Store configuration)

---

## 💻 Running the Project Locally

### 1. Database Setup (XAMPP MySQL)
Ensure MySQL is running on `127.0.0.1:3306` (standard XAMPP control panel):
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "source d:/Elvrafordivas/database/schema.sql; source d:/Elvrafordivas/database/seed.sql;"
```

### 2. Backend Server
```powershell
cd d:\Elvrafordivas\server
npm run dev
```
Backend runs at: `http://localhost:5000`

### 3. Frontend Client
```powershell
cd d:\Elvrafordivas\client
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Credentials

- **Admin Account**:
  - Email: `admin@elvra.com`
  - Password: `admin123`
  - Portal: `http://localhost:5173/admin/login`
- **Customer Demo Account**:
  - Email: `diva@elvra.com`
  - Password: `diva123`
- **Active Promotional Coupons**:
  - `ELVRA10` — 10% Off
  - `WELCOME15` — 15% Off
