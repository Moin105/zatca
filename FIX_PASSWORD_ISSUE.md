# Fix PostgreSQL Password Authentication Error

## ❌ Problem

Error: `password authentication failed for user "postgres"`

**Meaning**: PostgreSQL password galat hai ya match nahi kar raha.

## ✅ Solutions

### Solution 1: Correct Password Use Karo

Agar aapko apna PostgreSQL password pata hai:

1. **pgAdmin mein**: Correct password dalo
2. **backend/.env mein**: Correct password update karo

### Solution 2: Password Reset Karo (Agar password yaad nahi)

#### Windows Authentication Se (Easiest):

1. **pgAdmin open karo** (agar already connected ho)
2. Ya **Command Prompt as Administrator** open karo
3. PostgreSQL bin folder mein jao:
   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

4. **Password reset command**:
   ```powershell
   .\psql.exe -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'newpassword123';"
   ```

   Ya Windows authentication use karke:
   ```powershell
   # First, find your Windows username
   $env:PGUSER = "postgres"
   .\psql.exe -d postgres -c "ALTER USER postgres WITH PASSWORD 'newpassword123';"
   ```

#### Alternative: pg_hba.conf Edit Karo (Advanced)

1. Find `pg_hba.conf` file:
   ```
   C:\Program Files\PostgreSQL\18\data\pg_hba.conf
   ```

2. File open karo (as Administrator)
3. Find line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
   
4. Change to (temporarily, for testing):
   ```
   host    all             all             127.0.0.1/32            trust
   ```

5. PostgreSQL service restart karo
6. Connect without password
7. Password set karo
8. phir se `scram-sha-256` par change karo

⚠️ **Warning**: Production mein `trust` use mat karo!

### Solution 3: Default Password Try Karo

Common default passwords:
- `postgres`
- `admin`
- `root`
- `password`
- Windows user password (agar Windows auth use ki)

### Solution 4: New User Create Karo (Agar postgres user lock ho)

```sql
CREATE USER zatca_user WITH PASSWORD 'zatca123';
ALTER USER zatca_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE zatca_einvoicing TO zatca_user;
```

Phir `backend/.env` mein:
```env
DB_USERNAME=zatca_user
DB_PASSWORD=zatca123
```

## Quick Fix Steps

### Step 1: Password Reset (Command Line)

```powershell
# PostgreSQL bin folder
cd "C:\Program Files\PostgreSQL\18\bin"

# Try to connect (agar Windows auth enabled hai)
.\psql.exe -U postgres -d postgres

# Agar connect ho gaya, phir:
ALTER USER postgres WITH PASSWORD 'postgres123';
\q
```

### Step 2: Update backend/.env

```env
DB_PASSWORD=postgres123  # Jo aapne set kiya
```

### Step 3: pgAdmin mein Test

- Host: `localhost`
- Username: `postgres`
- Password: `postgres123` (jo aapne set kiya)

## If Nothing Works

### Option 1: Reinstall PostgreSQL
- Uninstall current PostgreSQL
- Reinstall with a password you remember
- Note down the password!

### Option 2: Use Different User
- Create new PostgreSQL user with known password
- Use that in backend/.env

## After Password Fixed

1. ✅ pgAdmin se connect karo
2. ✅ Database create karo: `zatca_einvoicing`
3. ✅ backend/.env update karo
4. ✅ Backend start karo
5. ✅ Admin user create karo

---

**Most Common Issue**: Password install time pe set kiya, lekin yaad nahi. Try common passwords ya reset karo.
