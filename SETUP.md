# ZATCA E-Invoicing System - Setup Guide

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (or MySQL 8+)
- **Git** (optional)

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE zatca_einvoicing;
```

2. Copy the environment file:
```bash
cd backend
cp .env.example .env
```

3. Update `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=zatca_einvoicing
PORT=3001
NODE_ENV=development
```

### 3. Run Database Migrations

The system uses TypeORM with `synchronize: true` in development mode, so tables will be created automatically on first run.

**⚠️ IMPORTANT: Security Migrations**

For production or to enable full security protections, you MUST run the security migration:

```bash
cd backend
npm run build
npm run migration:run
```

This will apply:
- Database triggers to prevent invoice manipulation
- Constraints to ensure data integrity
- Protection for invoice items

**Note**: The security migration (`1700000000000-AddInvoiceProtectionTriggers.ts`) is critical for preventing invoice tampering. See `SECURITY.md` for details.

For development with auto-sync:
- Tables are created automatically
- Security triggers should still be applied manually or via migration

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### 1. Configure Company

1. Navigate to `http://localhost:3000/companies`
2. Add your company information including:
   - Company name
   - VAT registration number
   - Address details

### 2. Add Customers

1. Navigate to `http://localhost:3000/customers`
2. Add customers (B2B or B2C)
3. For B2C customers, QR codes will be generated automatically

### 3. Create Invoices

1. Navigate to `http://localhost:3000/invoices`
2. Create a new invoice with:
   - Select company and customer
   - Add invoice items
   - VAT will be calculated automatically (default 15%)

### 4. Issue Invoice

1. Review the draft invoice
2. Click "Issue Invoice" to:
   - Generate QR code (for B2C)
   - Generate UBL 2.1 XML
   - Generate PDF
   - Create hash chain
   - Mark invoice as immutable

## API Endpoints

### Companies
- `GET /companies` - List all companies
- `POST /companies` - Create company
- `GET /companies/:id` - Get company
- `PATCH /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Invoices
- `GET /invoices` - List all invoices
- `POST /invoices` - Create invoice (draft)
- `GET /invoices/:id` - Get invoice
- `PATCH /invoices/:id` - Update invoice (only if draft)
- `PUT /invoices/:id/issue` - Issue invoice (makes it immutable)
- `DELETE /invoices/:id` - Delete invoice (only if draft)
- `GET /invoices/validate-hash-chain/:companyId` - Validate hash chain integrity

## Features Implemented

✅ **Electronic Invoice Generation**
- Structured invoice creation through software
- No handwritten invoices allowed

✅ **VAT Compliance**
- Mandatory VAT fields
- Automatic VAT calculation (15% default for Saudi Arabia)
- VAT amount tracking

✅ **QR Code Generation**
- TLV format encoding for simplified invoices (B2C)
- Base64 encoded QR code images
- Required fields: Seller Name, VAT Number, Timestamp, Invoice Total, VAT Total

✅ **XML Generation (UBL 2.1)**
- Standard UBL 2.1 format
- Audit-ready structured data
- Compatible with future Phase 2 integration

✅ **PDF Invoice Rendering**
- Professional invoice layout
- Includes QR code for B2C invoices
- All mandatory fields displayed

✅ **Hash Chaining**
- SHA-256 hash generation
- Chain linking with previous invoice
- Tamper detection capability

✅ **Invoice Immutability**
- Draft invoices can be modified
- Issued invoices are immutable
- Prevents modification after issuance

✅ **Audit Logging**
- Complete audit trail
- Tracks all invoice operations
- Entity-level logging

## Storage Structure

Generated files are stored in:
```
storage/
├── xml/          # UBL 2.1 XML files
├── pdf/          # PDF invoice files
└── invoices/      # Additional invoice data
```

## ZATCA SDK Validation

To validate generated XML invoices using ZATCA SDK:

1. Download ZATCA SDK from the developer portal
2. Install Java 21 or 22
3. Run `install.bat` to configure environment
4. Use CLI validation command:
```bash
java -jar zatca-sdk.jar validate invoice.xml
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Conflicts
- Backend default: 3001 (change in `backend/.env`)
- Frontend default: 3000 (change in `frontend/package.json`)

### Missing Dependencies
- Run `npm install` in both `backend` and `frontend` directories
- Clear `node_modules` and reinstall if issues persist

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Disable `synchronize: true` in database config
3. Use proper database migrations
4. Configure proper storage paths
5. Set up reverse proxy (nginx) for frontend
6. Use process manager (PM2) for backend
7. Configure SSL certificates
8. Set up backup strategy for database and storage

## Next Steps (Phase 2 Readiness)

The architecture is designed to support Phase 2 features:
- ZATCA API integration
- Invoice clearance
- Digital signatures
- Cryptographic stamps
- Certificate management

## Support

For issues or questions, refer to:
- ZATCA Developer Portal
- UBL 2.1 Documentation
- NestJS Documentation
- Next.js Documentation
