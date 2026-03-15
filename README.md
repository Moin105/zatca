# ZATCA Phase 1 E-Invoicing System

A compliant electronic invoicing system for Saudi Arabia's ZATCA (Zakat, Tax and Customs Authority) Phase 1 requirements.

## Architecture

- **Frontend**: Next.js (React) - User interface for invoice creation and management
- **Backend**: NestJS (TypeScript) - Business logic and API
- **Database**: PostgreSQL - Structured invoice records
- **Storage**: PDF and XML files for audit readiness

## Features

- ✅ Electronic invoice generation
- ✅ Mandatory VAT field validation
- ✅ QR code generation for simplified invoices (TLV format)
- ✅ XML generation (UBL 2.1 format)
- ✅ PDF invoice rendering
- ✅ Hash chaining for tamper detection
- ✅ Invoice immutability after issuance
- ✅ Audit logging

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Development

```bash
# Start backend (NestJS)
npm run dev:backend

# Start frontend (Next.js) - in another terminal
npm run dev:frontend
```

### Database Setup

1. Create a PostgreSQL database
2. Update database credentials in `backend/.env`
3. Run migrations:
```bash
cd backend
npm run migration:run
```

## Project Structure

```
zatca/
├── backend/          # NestJS API
├── frontend/         # Next.js application
└── README.md
```

## ZATCA Compliance

This system implements Phase 1 requirements:
- Electronic invoice generation (no handwritten invoices)
- Structured data formats (XML, JSON)
- QR codes for simplified invoices
- Secure digital storage
- Immutability after issuance
- Audit trail

## License

Private - For internal use only
