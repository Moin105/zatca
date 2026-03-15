# Create Super Admin User

## Method 1: Using Seed Script (Recommended)

**Prerequisites:**
- PostgreSQL is running
- Database `zatca_einvoicing` exists
- Correct credentials in `backend/.env`

**Run:**
```bash
cd backend
npm run seed:admin
```

**If you get database connection error:**
1. Check PostgreSQL is running
2. Verify database exists: `CREATE DATABASE zatca_einvoicing;`
3. Update `backend/.env` with correct PostgreSQL password

## Method 2: Using API (After Backend Starts)

### Step 1: Start Backend
```bash
cd backend
npm run start:dev
```

### Step 2: Register Admin via API
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zatca.com",
    "password": "admin123",
    "name": "System Administrator",
    "role": "admin"
  }'
```

### Step 3: Login
Use the credentials to login at http://localhost:3000/login

## Method 3: Direct Database (Advanced)

If you have direct database access:

1. Start backend once to create tables
2. Generate bcrypt hash for password 'admin123'
3. Insert user directly into database

**Generate Hash:**
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10).then(console.log);
```

**Insert User:**
```sql
INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@zatca.com',
  '<generated_hash_here>',
  'System Administrator',
  'admin',
  true,
  NOW(),
  NOW()
);
```

## Default Credentials

After creating admin:
- **Email**: `admin@zatca.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Important**: Change password after first login!

## Troubleshooting

### Database Connection Error
- Check PostgreSQL service is running
- Verify database credentials in `backend/.env`
- Test connection: `psql -U postgres -d zatca_einvoicing`

### Database Doesn't Exist
```sql
CREATE DATABASE zatca_einvoicing;
```

### User Already Exists
If admin already exists, you can:
1. Delete and recreate
2. Reset password via API (if you have another admin)
3. Update password directly in database

---

**Quickest Method**: Start backend, then use API to register admin user.
