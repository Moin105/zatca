# Database Create Karne Ke Steps

## ✅ PostgreSQL Running Hai!

Ab database create karo:

## Method 1: pgAdmin Se (Easiest)

1. **pgAdmin Open Karo**
   - Start Menu se "pgAdmin" search karo
   - Ya: `C:\Program Files\PostgreSQL\18\bin\pgAdmin4.exe`

2. **Connect Karo**
   - Left side mein "Servers" expand karo
   - PostgreSQL server par double-click
   - Password enter karo (jo aapne install time pe set kiya tha)

3. **Database Create Karo**
   - "Databases" par **right-click**
   - "Create" → "Database"
   - Name: `zatca_einvoicing`
   - Click "Save"

✅ **Done!** Database create ho gaya.

---

## Method 2: Command Line Se

Agar aapko apna PostgreSQL password pata hai:

```powershell
# PowerShell mein (apna password dalo):
$env:PGPASSWORD = "your_postgres_password"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE zatca_einvoicing;"
```

Ya directly:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
# Phir password enter karo
# Phir SQL command:
CREATE DATABASE zatca_einvoicing;
\q
```

---

## Method 3: Backend Start Karo (Auto-create)

Agar database nahi hai, backend start karte waqt error aayega, lekin tables automatically create ho jayengi agar database exist karta hai.

**Important**: Pehle database manually create karna padega!

---

## Password Kaise Pata Karein?

1. **Installation time pe set kiya hoga**
2. **Ya default**: `postgres` (agar change nahi kiya)
3. **Ya Windows user password** (agar Windows authentication use ki)

---

## After Database Created

1. ✅ Database create ho gaya
2. ✅ `backend/.env` mein correct password dalo
3. ✅ Backend start karo: `cd backend && npm run start:dev`
4. ✅ Tables automatically create ho jayengi
5. ✅ Admin user create karo via API

---

**Quickest**: pgAdmin use karo - sabse easy hai!
