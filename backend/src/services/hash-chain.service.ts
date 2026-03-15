import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import * as crypto from 'crypto';

@Injectable()
export class HashChainService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Generate hash for invoice data
   */
  generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate invoice hash including previous invoice hash (hash chaining)
   */
  generateInvoiceHash(invoice: Invoice, previousHash: string | null): string {
    // Create a string representation of invoice data
    const invoiceData = JSON.stringify({
      invoiceNumber: invoice.invoiceNumber,
      issueDateTime: invoice.issueDateTime.toISOString(),
      companyId: invoice.companyId,
      customerId: invoice.customerId,
      subtotal: invoice.subtotal,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount,
      previousHash: previousHash || '',
    });

    // Combine with previous hash for chaining
    const dataToHash = previousHash 
      ? `${previousHash}${invoiceData}`
      : invoiceData;

    return this.generateHash(dataToHash);
  }

  /**
   * Get the hash of the most recent invoice (for chaining)
   */
  async getPreviousInvoiceHash(companyId: string): Promise<string | null> {
    const lastInvoice = await this.invoiceRepository.findOne({
      where: { 
        companyId,
        status: InvoiceStatus.ISSUED,
        immutableFlag: true,
      },
      order: { issueDateTime: 'DESC' },
    });

    return lastInvoice ? lastInvoice.currentHash : null;
  }

  /**
   * Validate hash chain integrity
   */
  async validateHashChain(companyId: string): Promise<boolean> {
    const invoices = await this.invoiceRepository.find({
      where: { 
        companyId,
        status: InvoiceStatus.ISSUED,
        immutableFlag: true,
      },
      order: { issueDateTime: 'ASC' },
    });

    if (invoices.length === 0) return true;

    let previousHash: string | null = null;

    for (const invoice of invoices) {
      const expectedHash = this.generateInvoiceHash(invoice, previousHash);
      
      if (expectedHash !== invoice.currentHash) {
        return false; // Chain broken - tampering detected
      }

      previousHash = invoice.currentHash;
    }

    return true;
  }
}
