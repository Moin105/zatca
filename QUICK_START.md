# Quick Start Guide

## 🚀 Running the Project Locally

### Prerequisites

1. **Node.js** 18+ installed
2. **PostgreSQL** 14+ installed and running
3. **Database created**: `zatca_einvoicing`

### Step 1: Create Database

```sql
-- Connect to PostgreSQL
CREATE DATABASE zatca_einvoicing;
```

### Step 2: Configure Backend (if needed)

Create `backend/.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=zatca_einvoicing
PORT=3001
NODE_ENV=development
```

### Step 3: Start Backend Server

```bash
cd backend
npm run start:dev
```

Backend will run on: **http://localhost:3001**

### Step 4: Start Frontend Server (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📝 Quick Commands

### Install All Dependencies
```bash
npm run install:all
```

### Start Both Servers (separate terminals)
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

## ✅ Verify Installation

1. **Backend Health Check**: http://localhost:3001/health
2. **Frontend**: http://localhost:3000

## 🔧 Troubleshooting

### Database Connection Error

If you see database connection errors:
1. Ensure PostgreSQL is running
2. Check database credentials in `backend/.env`
3. Verify database `zatca_einvoicing` exists

### Port Already in Use

If port 3001 or 3000 is already in use:
- Change `PORT` in `backend/.env` for backend
- Change port in `frontend/package.json` scripts for frontend

### Missing Dependencies

```bash
# Reinstall all dependencies
npm run install:all
```

## 🎯 Next Steps

1. Access the frontend at http://localhost:3000
2. Create a company (Companies page)
3. Add customers (Customers page)
4. Create invoices (Invoices page)

## 📚 Documentation

- `SETUP.md` - Detailed setup instructions
- `SECURITY.md` - Security documentation
- `FRONTEND_SECURITY.md` - Frontend security details
