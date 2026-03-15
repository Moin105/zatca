import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Invoice } from '../entities/invoice.entity';
import { Company } from '../entities/company.entity';
import { Customer } from '../entities/customer.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
  /**
   * Generate PDF invoice
   */
  async generateInvoicePDF(
    invoice: Invoice,
    company: Company,
    customer: Customer,
    outputPath: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
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
}
