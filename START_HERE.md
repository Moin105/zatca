# 🚀 Start the Project - Step by Step

## Current Status

✅ **Dependencies**: Installed
✅ **Frontend**: Port 3000 is active
❌ **Backend**: Needs to be started

## Quick Start (2 Terminals Required)

### Terminal 1 - Backend Server

```powershell
cd c:\Users\hp\zatca\backend
npm run start:dev
```

**Expected Output:**
```
🚀 Backend server running on http://localhost:3001
```

**If you see database errors:**
1. Make sure PostgreSQL is installed and running
2. Create the database:
   ```sql
   CREATE DATABASE zatca_einvoicing;
   ```
3. Update `backend/.env` with your PostgreSQL credentials

### Terminal 2 - Frontend Server

```powershell
cd c:\Users\hp\zatca\frontend
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
```

## Access the Application

1. **Open your browser**: http://localhost:3000
2. You should see the ZATCA E-Invoicing System homepage

## Verify Everything Works

### 1. Check Backend Health
Open: http://localhost:3001/health

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "ZATCA E-Invoicing Backend"
}
```

### 2. Check Frontend
Open: http://localhost:3000

Should show the ZATCA E-Invoicing System interface.

## Database Setup (If Needed)

### Option 1: Using PostgreSQL Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zatca_einvoicing;

# Exit
\q
```

### Option 2: Using pgAdmin

1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `zatca_einvoicing`
4. Click "Save"

### Configure Backend .env

Create `backend/.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=zatca_einvoicing
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Backend Won't Start

**Error: "Cannot connect to database"**
- ✅ Check PostgreSQL is running
- ✅ Verify database exists
- ✅ Check credentials in `backend/.env`

**Error: "Port 3001 already in use"**
- Change PORT in `backend/.env` to another port (e.g., 3002)

### Frontend Won't Start

**Error: "Port 3000 already in use"**
- Kill the process using port 3000:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Database Tables Not Created

The system uses `synchronize: true` in development mode, so tables are created automatically on first backend start.

If tables don't exist:
1. Check backend logs for errors
2. Verify database connection
3. Restart backend server

## What to Do Next

1. ✅ Start backend in Terminal 1
2. ✅ Start frontend in Terminal 2 (if not already running)
3. ✅ Open http://localhost:3000 in browser
4. ✅ Create a company
5. ✅ Add customers
6. ✅ Create invoices

## Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health

---

**Need Help?** Check `SETUP.md` for detailed instructions.
