# Database Setup Guide - PostgreSQL

## Step 1: Install PostgreSQL (Agar nahi hai)

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (default port: 5432)
3. During installation, set a password for `postgres` user (remember this!)

### Verify Installation:
```powershell
psql --version
```

## Step 2: Start PostgreSQL Service

### Windows (PowerShell as Administrator):
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start PostgreSQL service
Start-Service -Name postgresql-x64-*  # Replace * with your version number

# Or start all PostgreSQL services
Get-Service -Name postgresql* | Start-Service
```

### Alternative: Using Services GUI
1. Press `Win + R`
2. Type: `services.msc`
3. Find "postgresql" service
4. Right-click → Start

## Step 3: Create Database

### Method 1: Using psql Command Line

```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted
# Then run:
CREATE DATABASE zatca_einvoicing;

# Verify database created
\l

# Exit
\q
```

### Method 2: Using pgAdmin (GUI)

1. Open **pgAdmin** (comes with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `zatca_einvoicing`
5. Click "Save"

### Method 3: Using SQL Command Directly

```powershell
# One-line command
psql -U postgres -c "CREATE DATABASE zatca_einvoicing;"
```

## Step 4: Configure Backend .env

Update `backend/.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_DATABASE=zatca_einvoicing
```

**Important**: `DB_PASSWORD` mein apna PostgreSQL password dalo!

## Step 5: Test Database Connection

### Option 1: Start Backend (Auto-creates tables)
```bash
cd backend
npm run start:dev
```

If connection successful, you'll see:
```
🚀 Backend server running on http://localhost:3001
```

If error, check:
- PostgreSQL service is running
- Database exists
- Password in .env is correct

### Option 2: Test Connection Manually
```powershell
psql -U postgres -d zatca_einvoicing -c "SELECT version();"
```

## Step 6: Create Admin User

After backend starts successfully:

```powershell
# Method 1: Using API (after backend starts)
Invoke-WebRequest -Uri "http://localhost:3001/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"admin@zatca.com","password":"admin123","name":"System Administrator","role":"admin"}'

# Method 2: Using seed script (if database connection works)
cd backend
npm run seed:admin
```

## Troubleshooting

### Error: "password authentication failed"
- Check `backend/.env` mein correct password hai
- Default password usually `postgres` hai (agar change nahi kiya)

### Error: "database does not exist"
- Create database: `CREATE DATABASE zatca_einvoicing;`

### Error: "connection refused"
- PostgreSQL service running nahi hai
- Start service: `Start-Service -Name postgresql-*`

### Error: "port 5432 already in use"
- PostgreSQL already running hai (good!)
- Ya koi aur service port use kar rahi hai

### Find PostgreSQL Service Name
```powershell
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

## Quick Commands

### Start PostgreSQL:
```powershell
Get-Service -Name postgresql* | Start-Service
```

### Stop PostgreSQL:
```powershell
Get-Service -Name postgresql* | Stop-Service
```

### Check if Running:
```powershell
Get-Service -Name postgresql* | Select-Object Name, Status
```

### Connect to Database:
```powershell
psql -U postgres -d zatca_einvoicing
```

### List All Databases:
```powershell
psql -U postgres -c "\l"
```

## Complete Setup Flow

1. ✅ Install PostgreSQL
2. ✅ Start PostgreSQL service
3. ✅ Create database: `CREATE DATABASE zatca_einvoicing;`
4. ✅ Update `backend/.env` with correct password
5. ✅ Start backend: `cd backend && npm run start:dev`
6. ✅ Create admin user via API
7. ✅ Start frontend: `cd frontend && npm run dev`
8. ✅ Login at http://localhost:3000

---

**Need Help?** Check PostgreSQL logs or verify service status.
