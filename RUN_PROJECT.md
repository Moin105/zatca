# 🚀 Project Running Status

## Current Status

✅ **Frontend**: Running on http://localhost:3000
⏳ **Backend**: Starting... (check status below)

## Access the Application

🌐 **Frontend URL**: http://localhost:3000

Open this URL in your browser to access the ZATCA E-Invoicing System.

## Backend Status

The backend should be running on: **http://localhost:3001**

### Check Backend Health

Open in browser or use curl:
```
http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "ZATCA E-Invoicing Backend"
}
```

## If Backend is Not Running

### Option 1: Check Backend Logs

The backend server was started in the background. Check the terminal where you ran:
```bash
cd backend
npm run start:dev
```

### Option 2: Start Backend Manually

If backend didn't start, run:
```bash
cd backend
npm run start:dev
```

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Create database: `CREATE DATABASE zatca_einvoicing;`
   - Update `backend/.env` with correct credentials

2. **Port Already in Use**
   - Change PORT in `backend/.env` if 3001 is taken

3. **Missing Dependencies**
   - Run: `cd backend && npm install`

## Next Steps

1. ✅ Open http://localhost:3000 in your browser
2. ✅ Verify backend at http://localhost:3001/health
3. ✅ Start using the application!

## Project Structure

```
Frontend: http://localhost:3000
Backend API: http://localhost:3001
```

## Quick Test

1. Visit http://localhost:3000
2. You should see the ZATCA E-Invoicing System homepage
3. Navigate to Companies, Customers, or Invoices pages

---

**Note**: If you see any errors, check the terminal output for the backend server.
