# 🚀 Quick Start with Authentication

## ✅ What's New

1. **Modern Login System** - Professional login page with ZATCA branding
2. **Protected Routes** - All pages require authentication
3. **Beautiful Dashboard** - Modern UI with gradient design
4. **JWT Authentication** - Secure token-based authentication

## 🎯 Quick Setup

### Step 1: Create Admin User

```bash
cd backend
npm run seed:admin
```

**Default Credentials:**
- Email: `admin@zatca.com`
- Password: `admin123`

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 3: Login

1. Open http://localhost:3000
2. You'll see the login page
3. Enter credentials:
   - Email: `admin@zatca.com`
   - Password: `admin123`
4. Click "Sign in"
5. You'll be redirected to the dashboard

## 🎨 New Features

### Modern UI Design
- ✅ Gradient backgrounds (blue to green)
- ✅ Professional login page
- ✅ Beautiful dashboard with cards
- ✅ Improved navigation
- ✅ Better typography and spacing

### Authentication
- ✅ Login/Password system
- ✅ JWT token management
- ✅ Auto-logout on token expiry
- ✅ Protected routes
- ✅ Session management

## 📱 Pages

- **Login** (`/login`) - Beautiful login page
- **Dashboard** (`/dashboard`) - Main dashboard with stats
- **Companies** (`/companies`) - Manage companies (protected)
- **Customers** (`/customers`) - Manage customers (protected)
- **Invoices** (`/invoices`) - Manage invoices (protected)

## 🔒 Security

- All API routes are protected with JWT
- Frontend routes require authentication
- Passwords are hashed with bcrypt
- Tokens expire after 24 hours

## 📝 Next Steps

1. Login with admin credentials
2. Create your company
3. Add customers
4. Start creating invoices!

---

**Ready to use!** 🎉
