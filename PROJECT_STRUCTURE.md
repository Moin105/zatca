# Project Structure

```
zatca/
├── backend/                          # NestJS Backend API
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   └── database.config.ts    # Database configuration
│   │   ├── entities/                 # TypeORM entities
│   │   │   ├── company.entity.ts
│   │   │   ├── customer.entity.ts
│   │   │   ├── invoice.entity.ts
│   │   │   ├── invoice-item.entity.ts
│   │   │   └── audit-log.entity.ts
│   │   ├── modules/                  # Feature modules
│   │   │   ├── companies/
│   │   │   │   ├── companies.module.ts
│   │   │   │   ├── companies.controller.ts
│   │   │   │   ├── companies.service.ts
│   │   │   │   └── dto/
│   │   │   ├── customers/
│   │   │   │   ├── customers.module.ts
│   │   │   │   ├── customers.controller.ts
│   │   │   │   ├── customers.service.ts
│   │   │   │   └── dto/
│   │   │   ├── invoices/
│   │   │   │   ├── invoices.module.ts
│   │   │   │   ├── invoices.controller.ts
│   │   │   │   ├── invoices.service.ts
│   │   │   │   └── dto/
│   │   │   └── audit-logs/
│   │   │       ├── audit-logs.module.ts
│   │   │       └── audit-logs.service.ts
│   │   ├── services/                 # Shared services
│   │   │   ├── qr-code.service.ts   # QR code generation (TLV)
│   │   │   ├── hash-chain.service.ts # Hash chaining
│   │   │   ├── xml-generator.service.ts # UBL 2.1 XML
│   │   │   └── pdf-generator.service.ts # PDF generation
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/                         # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── companies/
│   │   │   └── page.tsx              # Companies list
│   │   ├── customers/
│   │   │   └── page.tsx              # Customers list
│   │   └── invoices/
│   │       └── page.tsx              # Invoices list
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── storage/                          # Generated files (created at runtime)
│   ├── xml/                          # UBL 2.1 XML files
│   ├── pdf/                          # PDF invoice files
│   └── invoices/                     # Additional invoice data
│
├── package.json                      # Root package.json
├── README.md                         # Main documentation
├── SETUP.md                          # Setup instructions
└── PROJECT_STRUCTURE.md             # This file
```

## Key Components

### Backend Services

1. **QR Code Service** (`qr-code.service.ts`)
   - Generates TLV-encoded QR codes for simplified invoices
   - Base64 encodes QR code images
   - Required for B2C invoices

2. **Hash Chain Service** (`hash-chain.service.ts`)
   - Implements SHA-256 hash chaining
   - Links each invoice to previous invoice hash
   - Provides tamper detection

3. **XML Generator Service** (`xml-generator.service.ts`)
   - Generates UBL 2.1 compliant XML
   - Audit-ready structured format
   - Phase 2 compatible

4. **PDF Generator Service** (`pdf-generator.service.ts`)
   - Creates professional PDF invoices
   - Includes QR codes for B2C
   - All mandatory fields displayed

### Database Entities

1. **Company** - Seller company information
2. **Customer** - Customer data (B2B/B2C)
3. **Invoice** - Main invoice records with hash chain
4. **InvoiceItem** - Individual line items
5. **AuditLog** - Complete audit trail

### API Endpoints

- `/companies` - Company management
- `/customers` - Customer management
- `/invoices` - Invoice CRUD operations
- `/invoices/:id/issue` - Issue invoice (makes immutable)
- `/invoices/validate-hash-chain/:companyId` - Validate integrity

## Data Flow

1. **Invoice Creation**
   - User creates draft invoice via frontend
   - Backend calculates VAT and totals
   - Invoice stored as DRAFT status

2. **Invoice Issuance**
   - User issues invoice
   - System generates:
     - QR code (B2C only)
     - UBL 2.1 XML
     - PDF document
     - Hash chain link
   - Invoice marked as ISSUED and IMMUTABLE

3. **Hash Chain Validation**
   - System validates chain integrity
   - Detects any tampering
   - Returns validation result

## Security Features

- Invoice immutability after issuance
- Hash chaining for tamper detection
- Complete audit logging
- Structured data storage (XML)
- Secure file storage
