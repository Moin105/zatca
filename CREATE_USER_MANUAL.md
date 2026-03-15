# Admin User Create Karne Ke Steps

## Method 1: API Se (After Backend Starts)

### PowerShell Command:

```powershell
$body = @{
    email = "admin@zatca.com"
    password = "admin123"
    name = "System Administrator"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method POST -ContentType "application/json" -Body $body
```

### Ya Browser/Postman Se:

**URL**: `POST http://localhost:3001/auth/register`

**Body (JSON)**:
```json
{
  "email": "admin@zatca.com",
  "password": "admin123",
  "name": "System Administrator",
  "role": "admin"
}
```

## Method 2: Seed Script (If Database Connected)

```bash
cd backend
npm run seed:admin
```

## Default Credentials

After user created:
- **Email**: `admin@zatca.com`
- **Password**: `admin123`
- **Role**: `admin`

## Steps

1. ✅ Backend start karo: `cd backend && npm run start:dev`
2. ✅ Wait for: `🚀 Backend server running on http://localhost:3001`
3. ✅ API command run karo (upar wala)
4. ✅ Login karo: http://localhost:3000/login

---

**Note**: Agar user already exists, error aayega. Us case mein directly login karo!
