# Database Create Karo - Quick Fix

## ❌ Error
`database "zatca_einvoicing" does not exist`

## ✅ Solution: Database Create Karo

### Method 1: pgAdmin Se (Easiest - Agar Connect Ho)

1. **pgAdmin open karo**
2. **PostgreSQL server se connect karo** (agar password issue hai, pehle fix karo)
3. **Left side mein "Databases" par right-click**
4. **"Create" → "Database"**
5. **Name**: `zatca_einvoicing`
6. **Save**

✅ Done! Backend restart karo.

---

### Method 2: Command Line Se

#### Step 1: PostgreSQL bin folder mein jao
```powershell
cd "C:\Program Files\PostgreSQL\18\bin"
```

#### Step 2: Database create karo

**Option A: Agar password pata hai:**
```powershell
$env:PGPASSWORD = "your_password_here"
.\psql.exe -U postgres -c "CREATE DATABASE zatca_einvoicing;"
```

**Option B: Interactive (password prompt):**
```powershell
.\psql.exe -U postgres
# Password enter karo
# Phir SQL command:
CREATE DATABASE zatca_einvoicing;
\q
```

**Option C: Windows Authentication (agar enabled hai):**
```powershell
.\psql.exe -d postgres -c "CREATE DATABASE zatca_einvoicing;"
```

---

### Method 3: SQL File Se

1. **SQL file create karo**: `create-db.sql`
2. **Content**:
   ```sql
   CREATE DATABASE zatca_einvoicing;
   ```
3. **Run**:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f create-db.sql
   ```

---

## After Database Created

1. ✅ Database create ho gaya
2. ✅ Backend automatically connect ho jayega (restart karo agar chahiye)
3. ✅ Tables automatically create ho jayengi
4. ✅ Admin user create karo via API

---

## Quick Command (Try This First)

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE zatca_einvoicing;"
```

Password enter karna padega. Agar password issue hai, pehle pgAdmin se connect karo.

---

**Most Reliable**: pgAdmin use karo - GUI se easy hai!
