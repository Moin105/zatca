import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Invoice } from '../entities/invoice.entity';
import { Company } from '../entities/company.entity';
import { Customer } from '../entities/customer.entity';
import { CreditNote } from '../entities/credit-note.entity';
import { DebitNote } from '../entities/debit-note.entity';
import * as fs from 'fs';
import * as path from 'path';

interface DocumentForPdf {
  invoiceNumber?: string;
  noteNumber?: string;
  issueDateTime: Date;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  qrCode?: string | null;
  items: Array<{ name: string; quantity: number; unitPrice: number; vatRate: number; lineTotal: number }>;
}

@Injectable()
export class PdfGeneratorService {
  /**
   * Generate PDF for invoice or note. documentTypeLabel: e.g. "Tax Invoice", "Simplified Tax Invoice", "Credit Note", "Debit Note".
   */
  async generateInvoicePDF(
    invoice: Invoice,
    company: Company,
    customer: Customer,
    outputPath: string,
    documentTypeLabel: string = 'Tax Invoice',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header – ZATCA Phase 1: invoice type description
      doc.fontSize(20).text(documentTypeLabel.toUpperCase(), { align: 'center' });
      doc.moveDown();

      // Company Information
      doc.fontSize(14).text(company.name, { align: 'left' });
      if (company.address) {
        doc.fontSize(10).text(company.address);
      }
      if (company.city) {
        doc.fontSize(10).text(`${company.city}, ${company.postalCode || ''}`);
      }
      doc.fontSize(10).text(`VAT Number: ${company.vatNumber}`);
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.fontSize(10).text(
        `Issue Date: ${invoice.issueDateTime.toLocaleDateString('en-GB')} ${invoice.issueDateTime.toLocaleTimeString('en-GB')}`
      );
      doc.moveDown();

      // Customer Information
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.fontSize(10).text(customer.name);
      if (customer.address) {
        doc.fontSize(10).text(customer.address);
      }
      if (customer.vatNumber) {
        doc.fontSize(10).text(`VAT Number: ${customer.vatNumber}`);
      }
      doc.moveDown();

      // Invoice Items Table
      doc.fontSize(12).text('Items:', { underline: true });
      doc.moveDown(0.5);

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(10);
      doc.text('Description', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Price', 350, tableTop);
      doc.text('VAT %', 420, tableTop);
      doc.text('Total', 480, tableTop);

      // Table Rows
      let yPosition = tableTop + 20;
      invoice.items.forEach((item) => {
        doc.text(item.name, 50, yPosition);
        doc.text(item.quantity.toString(), 300, yPosition);
        doc.text(item.unitPrice.toFixed(2), 350, yPosition);
        doc.text(`${item.vatRate}%`, 420, yPosition);
        doc.text(item.lineTotal.toFixed(2), 480, yPosition);
        yPosition += 20;
      });

      // Totals
      yPosition += 10;
      doc.text('Subtotal:', 350, yPosition);
      doc.text(invoice.subtotal.toFixed(2), 480, yPosition);
      yPosition += 15;
      doc.text('VAT Amount:', 350, yPosition);
      doc.text(invoice.vatAmount.toFixed(2), 480, yPosition);
      yPosition += 15;
      doc.fontSize(12).text('Total Amount:', 350, yPosition);
      doc.fontSize(12).text(invoice.totalAmount.toFixed(2), 480, yPosition);

      // QR Code (if available)
      if (invoice.qrCode) {
        doc.moveDown(2);
        doc.fontSize(10).text('QR Code:', { align: 'center' });
        // Extract base64 data and embed image
        const base64Data = invoice.qrCode.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        doc.image(imageBuffer, {
          fit: [150, 150],
          align: 'center',
        });
      }

      // Footer
      doc.fontSize(8)
        .text(
          'This is an electronically generated invoice. No signature required.',
          { align: 'center' },
          doc.page.height - 50
        );

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  async generateCreditNotePDF(
    note: CreditNote,
    company: Company,
    customer: Customer,
    outputPath: string,
  ): Promise<string> {
    const doc: DocumentForPdf = {
      noteNumber: note.noteNumber,
      issueDateTime: note.issueDateTime,
      subtotal: Number(note.subtotal),
      vatAmount: Number(note.vatAmount),
      totalAmount: Number(note.totalAmount),
      qrCode: note.qrCode,
      items: note.items || [],
    };
    return this.generateNotePdf(doc, company, customer, outputPath, 'Credit Note');
  }

  async generateDebitNotePDF(
    note: DebitNote,
    company: Company,
    customer: Customer,
    outputPath: string,
  ): Promise<string> {
    const doc: DocumentForPdf = {
      noteNumber: note.noteNumber,
      issueDateTime: note.issueDateTime,
      subtotal: Number(note.subtotal),
      vatAmount: Number(note.vatAmount),
      totalAmount: Number(note.totalAmount),
      qrCode: note.qrCode,
      items: note.items || [],
    };
    return this.generateNotePdf(doc, company, customer, outputPath, 'Debit Note');
  }

  private async generateNotePdf(
    doc: DocumentForPdf,
    company: Company,
    customer: Customer,
    outputPath: string,
    documentTypeLabel: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const pdf = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(outputPath);
      pdf.pipe(stream);

      const docNumber = doc.noteNumber ?? doc.invoiceNumber ?? '';
      pdf.fontSize(20).text(documentTypeLabel.toUpperCase(), { align: 'center' });
      pdf.moveDown();
      pdf.fontSize(14).text(company.name);
      if (company.address) pdf.fontSize(10).text(company.address);
      if (company.city) pdf.fontSize(10).text(`${company.city}, ${company.postalCode || ''}`);
      pdf.fontSize(10).text(`VAT Number: ${company.vatNumber}`);
      pdf.moveDown();
      pdf.fontSize(12).text(`Document Number: ${docNumber}`);
      pdf.fontSize(10).text(
        `Issue Date: ${new Date(doc.issueDateTime).toLocaleDateString('en-GB')} ${new Date(doc.issueDateTime).toLocaleTimeString('en-GB')}`,
      );
      pdf.moveDown();
      pdf.fontSize(12).text('Bill To:', { underline: true });
      pdf.fontSize(10).text(customer.name);
      if (customer.address) pdf.fontSize(10).text(customer.address);
      if (customer.vatNumber) pdf.fontSize(10).text(`VAT Number: ${customer.vatNumber}`);
      pdf.moveDown();
      pdf.fontSize(12).text('Items:', { underline: true });
      pdf.moveDown(0.5);
      const tableTop = pdf.y;
      pdf.fontSize(10);
      pdf.text('Description', 50, tableTop);
      pdf.text('Qty', 300, tableTop);
      pdf.text('Unit Price', 350, tableTop);
      pdf.text('VAT %', 420, tableTop);
      pdf.text('Total', 480, tableTop);
      let y = tableTop + 20;
      doc.items.forEach((item) => {
        pdf.text(item.name, 50, y);
        pdf.text(item.quantity.toString(), 300, y);
        pdf.text(Number(item.unitPrice).toFixed(2), 350, y);
        pdf.text(`${item.vatRate}%`, 420, y);
        pdf.text(Number(item.lineTotal).toFixed(2), 480, y);
        y += 20;
      });
      y += 10;
      pdf.text('Subtotal:', 350, y);
      pdf.text(doc.subtotal.toFixed(2), 480, y);
      y += 15;
      pdf.text('VAT Amount:', 350, y);
      pdf.text(doc.vatAmount.toFixed(2), 480, y);
      y += 15;
      pdf.fontSize(12).text('Total Amount:', 350, y);
      pdf.fontSize(12).text(doc.totalAmount.toFixed(2), 480, y);
      if (doc.qrCode) {
        pdf.moveDown(2);
        pdf.fontSize(10).text('QR Code:', { align: 'center' });
        const base64 = doc.qrCode.replace(/^data:image\/png;base64,/, '');
        pdf.image(Buffer.from(base64, 'base64'), { fit: [150, 150], align: 'center' });
      }
      pdf.fontSize(8).text('Electronically generated. No signature required.', { align: 'center' }, pdf.page.height - 50);
      pdf.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }
}
