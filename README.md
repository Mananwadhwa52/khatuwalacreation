# Khatu Walas Creation — Full Stack E-commerce Platform

> **Divine Attire for Radha Krishna & Laddu Gopal** — Complete MERN Stack Application

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/Mongoose-8.24-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.22-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)

---

## 📁 PROJECT STRUCTURE

```
khatuwala-full/
│
├── backend/                          # Node.js Express Backend
│   ├── models/
│   │   ├── User.js                   # User schema with security fields
│   │   ├── Product.js                # Product schema with images, reviews
│   │   ├── Order.js                  # Order schema with payment, shipping
│   │   ├── Review.js                 # Product review schema
│   │   ├── Contact.js                # Contact form submissions
│   │   └── Coupon.js                 # Discount coupon schema
│   │
│   ├── routes/
│   │   ├── auth.js                   # Login, register, profile, wishlist
│   │   ├── products.js               # CRUD products, search, filter
│   │   ├── orders.js                 # Order management, tracking
│   │   ├── payment.js                # Razorpay integration
│   │   ├── reviews.js                # Product reviews
│   │   └── contact.js                # Contact form
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT auth, admin guard, super admin, audit logging
│   │   └── cloudinary.js             # Image upload config
│   │
│   ├── utils/
│   │   └── email.js                  # Nodemailer email templates
│   │
│   ├── server.js                     # Express app entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (not committed)
│   └── .env.example                  # Environment variables template
│
├── frontend/                         # React + Vite Frontend
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx        # Main navigation with cart icon
│   │   │   │   └── Footer.jsx        # Footer with links
│   │   │   ├── cart/
│   │   │   │   └── CartDrawer.jsx    # Sliding cart drawer
│   │   │   └── product/
│   │   │       └── ProductCard.jsx   # Product grid card
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero, categories, featured
│   │   │   ├── ProductsPage.jsx      # Product listing with filters
│   │   │   ├── ProductDetail.jsx     # Single product page
│   │   │   ├── CartPage.jsx          # Cart page
│   │   │   ├── CheckoutPage.jsx      # Checkout with Razorpay
│   │   │   ├── OrderSuccess.jsx      # Order confirmation
│   │   │   ├── OrdersPage.jsx        # User orders list
│   │   │   ├── OrderDetail.jsx       # Single order tracking
│   │   │   ├── LoginPage.jsx         # Login form
│   │   │   ├── RegisterPage.jsx      # Registration form
│   │   │   ├── ProfilePage.jsx       # User profile & settings
│   │   │   ├── WishlistPage.jsx      # Saved products
│   │   │   ├── AboutPage.jsx         # About us
│   │   │   ├── ContactPage.jsx       # Contact form
│   │   │   ├── FAQPage.jsx           # FAQ accordion
│   │   │   │
│   │   │   ├── policies/
│   │   │   │   ├── ShippingPolicy.jsx
│   │   │   │   ├── RefundPolicy.jsx
│   │   │   │   ├── PrivacyPolicy.jsx
│   │   │   │   └── TermsPage.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx       # Admin sidebar layout
│   │   │       ├── AdminDashboard.jsx    # Dashboard with stats
│   │   │       ├── AdminProducts.jsx     # Product management
│   │   │       ├── AdminOrders.jsx       # Order management
│   │   │       ├── AdminOrderDetail.jsx  # Update order status
│   │   │       ├── AdminContacts.jsx     # View messages
│   │   │       ├── AdminCoupons.jsx      # Coupon management
│   │   │       └── AdminUsers.jsx        # User list
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── CartContext.jsx       # Shopping cart state
│   │   │
│   │   ├── utils/
│   │   │   └── api.js                # Axios instance with interceptors
│   │   │
│   │   ├── App.jsx                   # Main router
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles + Tailwind
│   │
│   ├── index.html
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration (reads env)
│   ├── tailwind.config.js            # Tailwind theme
│   ├── postcss.config.js
│   ├── .env                          # Frontend env variables (not committed)
│   └── .env.example                  # Frontend env variables template
│
└── README.md                         # This file
```

---

## 🚀 FEATURES

### **Customer Features**
- ✅ Product browsing with categories & filters
- ✅ Product search
- ✅ Product detail with reviews & ratings
- ✅ Shopping cart (persistent in localStorage)
- ✅ User authentication (JWT)
- ✅ Wishlist
- ✅ Checkout with Razorpay payment gateway
- ✅ Cash on Delivery (COD)
- ✅ Coupon codes
- ✅ Order tracking
- ✅ Order cancellation & refund requests
- ✅ User profile management
- ✅ Responsive design (mobile-first)
- ✅ Contact form
- ✅ FAQ page
- ✅ Policy pages (Shipping, Refund, Privacy, Terms)

### **Admin Features**
- ✅ Admin dashboard with revenue stats
- ✅ Product management (CRUD)
- ✅ Image upload to Cloudinary
- ✅ Order management
- ✅ Update order status & tracking
- ✅ View customer messages
- ✅ User management (suspend/activate/unlock)
- ✅ Coupon management (basic structure)
- ✅ Super admin role for critical operations
- ✅ Admin action audit logging (IP, user-agent, timestamp)

### **Technical Features**
- ✅ JWT authentication with role-embedded tokens
- ✅ Protected routes
- ✅ Role-based access control (user / admin / super admin)
- ✅ Helmet HTTP security headers
- ✅ NoSQL injection prevention (express-mongo-sanitize)
- ✅ XSS protection (xss-clean)
- ✅ Brute-force login lockout (5 attempts → 30 min lock)
- ✅ Auth-specific rate limiting (10 req/15 min)
- ✅ Contact form rate limiting (5 req/15 min)
- ✅ Image upload to Cloudinary
- ✅ Razorpay payment integration
- ✅ Email notifications (Nodemailer)
- ✅ Responsive UI with Tailwind CSS
- ✅ Toast notifications
- ✅ Loading states & skeletons
- ✅ Error handling (stack traces hidden in production)

---

## 🔒 SECURITY

The backend implements **multi-layered security** to protect user data, prevent attacks, and secure admin operations:

### Core Security

| Layer | Implementation | Details |
|---|---|---|
| **HTTP Security Headers** | `helmet` | Sets 15+ headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc. |
| **Authentication** | JWT (JSON Web Tokens) | Role-embedded tokens with configurable expiry (`JWT_EXPIRE`) |
| **Password Hashing** | bcrypt.js (12 rounds) | Salted hashing — passwords never stored in plain text |
| **NoSQL Injection Prevention** | `express-mongo-sanitize` | Strips `$` and `.` operators from req.body/query/params |
| **XSS Protection** | `xss-clean` | Sanitizes user input to prevent stored/reflected XSS |
| **CORS** | `cors` middleware | Origin restricted to `FRONTEND_URL`, methods limited to GET/POST/PUT/DELETE |
| **Body Size Limit** | Express built-in | Request bodies capped at 10 MB |
| **Payment Verification** | HMAC-SHA256 | Razorpay signature verification prevents payment tampering |
| **Credential Protection** | `.env` file | All secrets (DB, JWT, API keys) stored in environment variables |
| **Error Hiding** | Production mode | Stack traces hidden when `NODE_ENV=production` |

### Rate Limiting

| Route | Limit | Window |
|---|---|---|
| All `/api/*` routes | 300 requests | 15 minutes |
| `/api/auth/login` & `/api/auth/register` | 10 requests | 15 minutes |
| `/api/contact` | 5 requests | 15 minutes |

### Brute-Force & Account Protection

| Feature | Details |
|---|---|
| **Login Lockout** | Account locked for **30 minutes** after **5 consecutive failed attempts** |
| **Account Suspension** | Admins can suspend user accounts via `PUT /api/auth/users/:id/status` |
| **Account Unlock** | Admins can unlock locked accounts via `PUT /api/auth/users/:id/unlock` |
| **Role Injection Prevention** | Registration always forces `role: 'user'` — cannot escalate via API |
| **Last Login Tracking** | `lastLogin` timestamp updated on every successful login |

### Admin Security

| Feature | Details |
|---|---|
| **DB Role Re-verification** | `adminOnly` middleware re-fetches role from DB on every request (prevents stale-JWT role escalation) |
| **Super Admin** | Only `ADMIN_EMAIL` account can suspend/activate users — other admins cannot |
| **Audit Logging** | Every admin action logged with admin ID, name, method, path, IP, user-agent, and timestamp |
| **Suspension Check** | Suspended admin accounts are immediately blocked even if JWT is still valid |
| **Secured Seed Route** | `POST /seed-admin` requires `SEED_SECRET` in body and is **disabled entirely in production** |
| **File Upload Validation** | Image MIME type check, 8 MB per-file limit, allowed formats: jpg/jpeg/png/webp |

### Security Best Practices for Deployment

> ⚠️ **Before going to production, ensure the following:**

1. **Never commit `.env`** — add it to `.gitignore`
2. **Use strong JWT secrets** — minimum 32 characters with mixed casing and symbols
3. **Set `NODE_ENV=production`** — hides error stack traces and disables seed-admin route
4. **Switch to Razorpay live keys** — replace `rzp_test_*` keys with production keys
5. **Use Gmail App Passwords** — never use your real Gmail password for SMTP
6. **Enable HTTPS** — use a reverse proxy (Nginx) or platform SSL (Render, Vercel)
7. **Restrict CORS origin** — set `FRONTEND_URL` to your actual production domain
8. **Rotate secrets regularly** — especially JWT secret, SEED_SECRET, and API keys
9. **Monitor audit logs** — review `🔐 ADMIN ACTION` entries in server logs regularly
10. **Review suspended accounts** — periodically audit `isActive: false` accounts

---

## 🛠️ TECHNOLOGY STACK

### **Backend**
| Package | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.22 | Web framework |
| MongoDB (Mongoose) | 8.24 | Database & ODM |
| jsonwebtoken | 9.0 | JWT authentication |
| bcryptjs | 2.4 | Password hashing |
| helmet | 8.2 | HTTP security headers (CSP, HSTS, etc.) |
| express-mongo-sanitize | 2.2 | NoSQL injection prevention |
| xss-clean | 0.1 | XSS attack prevention |
| Cloudinary | 1.41 | Cloud image storage |
| multer + multer-storage-cloudinary | 1.4 / 4.0 | File upload handling |
| Razorpay | 2.9 | Payment gateway |
| Nodemailer | 6.10 | Email service |
| express-rate-limit | 7.5 | API rate limiting (global + per-route) |
| express-async-handler | 1.2 | Async error handling |
| dotenv | 16.6 | Environment variables |
| cors | 2.8 | Cross-origin resource sharing |
| nodemon (dev) | 3.1 | Auto-restart on file changes |

### **Frontend**
| Package | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library |
| React DOM | 18.3 | React DOM renderer |
| Vite | 5.4 | Build tool & dev server |
| React Router | 6.30 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Axios | 1.18 | HTTP client |
| React Hot Toast | 2.6 | Toast notifications |
| Lucide React | 0.383 | Icon library |
| PostCSS | 8.5 | CSS processing |
| Autoprefixer | 10.5 | CSS vendor prefixing |
| @vitejs/plugin-react | 4.7 | Vite React plugin |

---

## 📦 INSTALLATION & SETUP

### **Prerequisites**
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier)
- Razorpay account (test mode)
- Gmail account (for SMTP)

---

### **1. Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
```

**Edit the `.env` file** with your actual values:

```env
# MongoDB
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/khatuwala?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Cloudinary (get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (get from razorpay.com/dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Gmail SMTP (use App Password, not real password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Khatu Walas Creation <your_gmail@gmail.com>"

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# First Admin Account (super admin)
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@khatuwalascreation.com
ADMIN_PASSWORD=Admin@SecurePass123

# Seed Admin Security (required to call POST /api/auth/seed-admin)
SEED_SECRET=your_random_seed_secret_here
```

**Start backend:**

```bash
npm run dev
```

**Create first admin user (secured):**

```bash
# Use Postman or cURL — requires SEED_SECRET from .env
curl -X POST http://localhost:5000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"seedSecret": "your_random_seed_secret_here"}'

# Response: { success: true, message: "Admin created", email: "admin@khatuwalascreation.com" }
# ⚠️ This route is DISABLED when NODE_ENV=production
```

Backend running at: `http://localhost:5000`

---

### **2. Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Start dev server
npm run dev
```

The `.env` file contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Frontend running at: `http://localhost:5173`

**Login credentials:**
- Admin: `admin@khatuwalascreation.com` / `Admin@SecurePass123` (or whatever you set in .env)

---

## 🌐 DEPLOYMENT

### **Backend — Deploy to Render**

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new **Web Service**
4. Connect your GitHub repo
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add Environment Variables (all from `.env`)
7. Deploy!

**Get your backend URL:** `https://your-app.onrender.com`

---

### **Frontend — Deploy to Vercel**

1. Create `.env` in frontend:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

2. Build frontend:

```bash
npm run build
```

3. Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo to Vercel dashboard.

**Add Environment Variable in Vercel:**
- `VITE_API_URL` = `https://your-backend.onrender.com/api`

**Done!** Your site is live.

---

## 🔑 GETTING API KEYS

### **1. MongoDB Atlas** (Free Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Replace `<password>` with your password
6. Use in `MONGODB_URI`

### **2. Cloudinary** (Free Image Storage)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up free
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret
5. Use in `.env`

### **3. Razorpay** (Payment Gateway)
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up
3. Go to Settings → API Keys
4. Generate Test Keys
5. Copy Key ID and Secret
6. Use in `.env`

**Note:** Use test mode for development. For production, activate account and use live keys.

### **4. Gmail SMTP** (Email Service)
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create new app password for "Mail"
5. Copy 16-character password
6. Use in `EMAIL_PASS` (not your real Gmail password!)

---

## 📝 API ENDPOINTS

### **Authentication**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public (rate-limited) | Register new user |
| `POST` | `/api/auth/login` | Public (rate-limited) | Login & get token (lockout after 5 failures) |
| `GET` | `/api/auth/me` | 🔐 User | Get current user profile |
| `PUT` | `/api/auth/profile` | 🔐 User | Update name/phone/password |
| `POST` | `/api/auth/address` | 🔐 User | Add shipping address |
| `POST` | `/api/auth/wishlist/:productId` | 🔐 User | Toggle wishlist item |
| `GET` | `/api/auth/users` | 🔐 Admin | List all users |
| `PUT` | `/api/auth/users/:id/status` | 🛡️ Super Admin | Suspend/activate user account |
| `PUT` | `/api/auth/users/:id/unlock` | 🔐 Admin | Unlock a locked user account |
| `POST` | `/api/auth/seed-admin` | 🔑 SEED_SECRET | Create first admin (disabled in production) |

### **Products**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products (filter, sort, paginate) |
| `GET` | `/api/products/:id` | Public | Get single product |
| `POST` | `/api/products` | 🔐 Admin | Create product (multipart/form-data) |
| `PUT` | `/api/products/:id` | 🔐 Admin | Update product |
| `DELETE` | `/api/products/:id` | 🔐 Admin | Delete product & images |

### **Orders**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/orders/my` | 🔐 User | Get user's orders |
| `GET` | `/api/orders/:id` | 🔐 User/Admin | Get single order |
| `POST` | `/api/orders/:id/cancel` | 🔐 User | Cancel order |
| `POST` | `/api/orders/:id/refund` | 🔐 User | Request refund |
| `GET` | `/api/orders` | 🔐 Admin | List all orders |
| `PUT` | `/api/orders/:id/status` | 🔐 Admin | Update status & tracking |
| `GET` | `/api/orders/admin/stats` | 🔐 Admin | Dashboard statistics |

### **Payment**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payment/apply-coupon` | Public | Validate & calculate discount |
| `POST` | `/api/payment/create-order` | Public | Create Razorpay order |
| `POST` | `/api/payment/verify` | Public | Verify payment signature |

### **Reviews**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reviews/product/:productId` | Public | Get product reviews |
| `POST` | `/api/reviews` | 🔐 User | Submit review (one per product) |
| `DELETE` | `/api/reviews/:id` | 🔐 Admin | Delete review |

### **Contact**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit contact form |
| `GET` | `/api/contact` | 🔐 Admin | List all messages |
| `PUT` | `/api/contact/:id/read` | 🔐 Admin | Mark message as read |

---

## 🎨 DESIGN SYSTEM

**Colors:**
- Primary: `#570000` (Deep Maroon)
- Gold: `#D4AF37` (Luxury Gold)
- Cream: `#FAF6F0` (Background)
- Muted: `#5a413d` (Text Gray)

**Fonts:**
- Display: Playfair Display (headings)
- Body: Montserrat (text)

**Components:**
- Button Primary: Gold gradient
- Button Outline: Bordered
- Input Field: Underlined style
- Cards: Cream background with gold borders
- Badges: Small uppercase labels

---

## 🐛 TROUBLESHOOTING

### Backend won't start
- Check MongoDB connection string
- Verify all env variables are set
- Check port 5000 is not in use

### Frontend API calls fail
- Check backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Open browser console for errors

### Payment not working
- Check Razorpay keys are test keys
- Check Razorpay script is loaded (check Network tab)
- Verify amount is minimum ₹1

### Images not uploading
- Check Cloudinary credentials
- Check file size < 8MB
- Check file type is image/*

### Email not sending
- Use Gmail App Password, not real password
- Enable 2FA on Gmail first
- Check `EMAIL_USER` and `EMAIL_PASS`

---

## 📞 SUPPORT

For issues or questions:
- Instagram: [@khatuwalascreation](https://instagram.com/khatuwalascreation)
- Email: hello@khatuwalascreation.com

---

## 📄 LICENSE

This project is for **Khatu Walas Creation** business use.

---

**Built with 🙏 devotion | Every stitch is an offering**
