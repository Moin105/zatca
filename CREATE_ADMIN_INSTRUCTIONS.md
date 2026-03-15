# Create Super Admin - Instructions

## ✅ Easiest Method: Use API After Backend Starts

### Step 1: Start Backend Server
```bash
cd backend
npm run start:dev
```

Wait for: `🚀 Backend server running on http://localhost:3001`

### Step 2: Create Admin via API

**Option A: Using curl (PowerShell)**
```powershell
curl -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d '{\"email\":\"admin@zatca.com\",\"password\":\"admin123\",\"name\":\"System Administrator\",\"role\":\"admin\"}'
```

**Option B: Using Postman or Browser**
- URL: `POST http://localhost:3001/auth/register`
- Body (JSON):
```json
{
  "email": "admin@zatca.com",
  "password": "admin123",
  "name": "System Administrator",
  "role": "admin"
}
```

### Step 3: Login
- Open: http://localhost:3000/login
- Email: `admin@zatca.com`
- Password: `admin123`

---

## Alternative: Fix Database Connection

Agar seed script use karna hai:

1. **Check PostgreSQL Password:**
   - `backend/.env` file mein correct password dalo
   - Default: `postgres` (agar aapka password different hai, update karo)

2. **Create Database (if not exists):**
   ```sql
   CREATE DATABASE zatca_einvoicing;
   ```

3. **Run Seed Script:**
   ```bash
   cd backend
   npm run seed:admin
   ```

---

## Default Admin Credentials

- **Email**: `admin@zatca.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Change password after first login!**

---

**Recommended**: Backend start karo, phir API se register karo - yeh sabse easy method hai!
