# pgAdmin Connection Fix

## ❌ Problem

Error: `failed to resolve host 'zatca_einvoicing'`

**Issue**: Database name ko hostname ki jagah use kar diya hai!

## ✅ Correct Settings

### Connection Tab:

1. **Host name/address**: `localhost` (ya `127.0.0.1`)
   - ❌ Wrong: `zatca_einvoicing`
   - ✅ Correct: `localhost`

2. **Port**: `5432` ✅ (yeh theek hai)

3. **Maintenance database**: `postgres` ✅ (yeh theek hai)

4. **Username**: `postgres` ✅ (yeh theek hai)

5. **Password**: Apna PostgreSQL password dalo

6. **Save password?**: On karo (optional, taake baar baar na dalna pade)

### After Connection:

1. Connect hone ke baad, left side mein "Databases" expand karo
2. "Databases" par **right-click**
3. "Create" → "Database"
4. Name: `zatca_einvoicing` ← **Yahan database name dalo!**
5. Save

## Quick Fix Steps

1. **Host name/address** field mein `zatca_einvoicing` ko **delete** karo
2. **`localhost`** type karo
3. Password dalo (agar save nahi kiya)
4. **Save** button click karo
5. Connect ho jayega!

## Summary

- **Host**: `localhost` (server ka address)
- **Port**: `5432` (PostgreSQL port)
- **Database**: `postgres` (connection ke liye, baad mein zatca_einvoicing create karenge)
- **Username**: `postgres`
- **Password**: Apna password

Database name (`zatca_einvoicing`) baad mein create karenge, pehle server se connect karo!
