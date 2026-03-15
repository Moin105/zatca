import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Invoice, InvoiceStatus } from '../../entities/invoice.entity';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { Company } from '../../entities/company.entity';
import { Customer } from '../../entities/customer.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { IssueInvoiceDto } from './dto/issue-invoice.dto';
import { QrCodeService } from '../../services/qr-code.service';
import { HashChainService } from '../../services/hash-chain.service';
import { XmlGeneratorService } from '../../services/xml-generator.service';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../../entities/audit-log.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
    private qrCodeService: QrCodeService,
    private hashChainService: HashChainService,
    private xmlGeneratorService: XmlGeneratorService,
    private pdfGeneratorService: PdfGeneratorService,
    private auditLogsService: AuditLogsService,
    private configService: ConfigService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Validate company and customer exist
    const company = await this.companyRepository.findOne({
      where: { id: createInvoiceDto.companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const customer = await this.customerRepository.findOne({
      where: { id: createInvoiceDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Calculate totals
    let subtotal = 0;
    const items = createInvoiceDto.items.map((itemDto) => {
      const vatRate = itemDto.vatRate || 15; // Default 15% VAT for Saudi Arabia
      const lineTotal = itemDto.quantity * itemDto.unitPrice;
      const vatAmount = (lineTotal * vatRate) / 100;
      subtotal += lineTotal;

      return this.invoiceItemRepository.create({
        name: itemDto.name,
        description: itemDto.description,
        quantity: itemDto.quantity,
        unitPrice: itemDto.unitPrice,
        vatRate,
        vatAmount,
        lineTotal: lineTotal + vatAmount,
      });
    });

    const vatAmount = items.reduce((sum, item) => sum + item.vatAmount, 0);
    const totalAmount = subtotal + vatAmount;

    // Generate invoice number if not provided
    const invoiceNumber =
      createInvoiceDto.invoiceNumber ||
      `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create invoice
    const invoice = this.invoiceRepository.create({
      invoiceNumber,
      issueDateTime: createInvoiceDto.issueDateTime || new Date(),
      companyId: createInvoiceDto.companyId,
      customerId: createInvoiceDto.customerId,
      subtotal,
      vatAmount,
      totalAmount,
      status: InvoiceStatus.DRAFT,
      items,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Log audit
    await this.auditLogsService.create({
      entityType: 'invoice',
      entityId: savedInvoice.id,
      action: AuditAction.CREATE,
      description: `Invoice ${invoiceNumber} created`,
    });

    return this.findOne(savedInvoice.id);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['company', 'customer', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['company', 'customer', 'items'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Check immutability
    if (invoice.immutableFlag) {
      throw new BadRequestException('Invoice is immutable and cannot be modified');
    }

    if (invoice.status === InvoiceStatus.ISSUED) {
      throw new BadRequestException('Issued invoices cannot be modified');
    }

    // Explicitly prevent modification of protected fields that should never change
    const protectedFields = [
      'currentHash',
      'previousHash',
      'status',
      'immutableFlag',
      'invoiceNumber',
      'xmlContent',
      'xmlPath',
      'pdfPath',
      'qrCode',
      'qrCodeData',
    ];

    for (const field of protectedFields) {
      if ((updateInvoiceDto as any)[field] !== undefined) {
        throw new BadRequestException(
          `Field '${field}' is protected and cannot be modified directly`,
        );
      }
    }

    // Update items if provided
    if (updateInvoiceDto.items) {
      // Delete existing items
      await this.invoiceItemRepository.delete({ invoiceId: id });

      // Calculate new totals
      let subtotal = 0;
      const items = updateInvoiceDto.items.map((itemDto) => {
        const vatRate = itemDto.vatRate || 15;
        const lineTotal = itemDto.quantity * itemDto.unitPrice;
        const vatAmount = (lineTotal * vatRate) / 100;
        subtotal += lineTotal;

        return this.invoiceItemRepository.create({
          invoiceId: id,
          name: itemDto.name,
          description: itemDto.description,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          vatRate,
          vatAmount,
          lineTotal: lineTotal + vatAmount,
        });
      });

      const vatAmount = items.reduce((sum, item) => sum + item.vatAmount, 0);
      const totalAmount = subtotal + vatAmount;

      invoice.subtotal = subtotal;
      invoice.vatAmount = vatAmount;
      invoice.totalAmount = totalAmount;
      invoice.items = await this.invoiceItemRepository.save(items);
    }

    // Update other fields
    if (updateInvoiceDto.issueDateTime) {
      invoice.issueDateTime = new Date(updateInvoiceDto.issueDateTime);
    }

    const updatedInvoice = await this.invoiceRepository.save(invoice);

    // Log audit
    await this.auditLogsService.create({
      entityType: 'invoice',
      entityId: id,
      action: AuditAction.UPDATE,
      description: `Invoice ${invoice.invoiceNumber} updated`,
    });

    return this.findOne(updatedInvoice.id);
  }

  async issue(id: string, issueInvoiceDto: IssueInvoiceDto): Promise<Invoice> {
    try {
      const invoice = await this.findOne(id);

      if (invoice.status === InvoiceStatus.ISSUED) {
        throw new BadRequestException('Invoice is already issued');
      }

      if (invoice.immutableFlag) {
        throw new BadRequestException('Invoice is immutable');
      }

      if (!invoice.company) {
        throw new BadRequestException('Company information is missing');
      }

      if (!invoice.customer) {
        throw new BadRequestException('Customer information is missing');
      }

      const company = invoice.company;
      const customer = invoice.customer;

      // Get previous hash for chaining
      const previousHash = await this.hashChainService.getPreviousInvoiceHash(
        invoice.companyId,
      );

      // Generate current hash
      const currentHash = this.hashChainService.generateInvoiceHash(
        invoice,
        previousHash,
      );

      invoice.previousHash = previousHash;
      invoice.currentHash = currentHash;

      // Generate QR code for simplified invoices (B2C)
      if (customer.type && customer.type === 'B2C') {
        try {
          const qrCode = await this.qrCodeService.generateInvoiceQRCode(
            company.name,
            company.vatNumber,
            invoice.issueDateTime,
            invoice.totalAmount,
            invoice.vatAmount,
          );
          invoice.qrCode = qrCode.image;
          invoice.qrCodeData = qrCode.tlvData;
        } catch (error) {
          console.error('Error generating QR code:', error);
          // Continue without QR code if generation fails
        }
      }

      // Generate XML
      let xmlContent: string;
      try {
        xmlContent = this.xmlGeneratorService.generateUBLInvoice(
          invoice,
          company,
          customer,
        );
        invoice.xmlContent = xmlContent;

        // Save XML file
        const storagePath = this.configService.get<string>('STORAGE_PATH', './storage');
        const xmlPath = path.join(
          storagePath,
          'xml',
          `${invoice.invoiceNumber}.xml`,
        );
        const xmlDir = path.dirname(xmlPath);
        if (!fs.existsSync(xmlDir)) {
          fs.mkdirSync(xmlDir, { recursive: true });
        }
        fs.writeFileSync(xmlPath, xmlContent, 'utf-8');
        invoice.xmlPath = xmlPath;
      } catch (error) {
        console.error('Error generating XML:', error);
        // Continue without XML file if generation fails
      }

      // Generate PDF
      try {
        const storagePath = this.configService.get<string>('STORAGE_PATH', './storage');
        const pdfPath = path.join(
          storagePath,
          'pdf',
          `${invoice.invoiceNumber}.pdf`,
        );
        const pdfDir = path.dirname(pdfPath);
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }
        await this.pdfGeneratorService.generateInvoicePDF(
          invoice,
          company,
          customer,
          pdfPath,
        );
        invoice.pdfPath = pdfPath;
      } catch (error) {
        console.error('Error generating PDF:', error);
        // Continue without PDF file if generation fails
      }

      // Prepare all fields to update
      // Use update() instead of save() to bypass BeforeUpdate hook
      const updateData: any = {
        status: InvoiceStatus.ISSUED,
        immutableFlag: true,
        previousHash: previousHash,
        currentHash: currentHash,
      };

      // Add optional fields if they exist
      if (invoice.qrCode) {
        updateData.qrCode = invoice.qrCode;
        updateData.qrCodeData = invoice.qrCodeData;
      }

      if (invoice.xmlContent) {
        updateData.xmlContent = invoice.xmlContent;
      }

      if (invoice.xmlPath) {
        updateData.xmlPath = invoice.xmlPath;
      }

      if (invoice.pdfPath) {
        updateData.pdfPath = invoice.pdfPath;
      }

      // Use update() to bypass BeforeUpdate hook
      await this.invoiceRepository.update(id, updateData);

      // Fetch the updated invoice
      const issuedInvoice = await this.findOne(id);

      // Log audit
      try {
        await this.auditLogsService.create({
          entityType: 'invoice',
          entityId: id,
          action: AuditAction.ISSUE,
          description: `Invoice ${invoice.invoiceNumber} issued`,
          metadata: {
            invoiceNumber: invoice.invoiceNumber,
            totalAmount: invoice.totalAmount,
            hash: currentHash,
          },
        });
      } catch (error) {
        console.error('Error creating audit log:', error);
        // Continue even if audit log fails
      }

      return issuedInvoice;
    } catch (error) {
      console.error('Error issuing invoice:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to issue invoice: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);

    if (invoice.immutableFlag || invoice.status === InvoiceStatus.ISSUED) {
      throw new BadRequestException('Issued invoices cannot be deleted');
    }

    await this.invoiceRepository.remove(invoice);

    // Log audit
    await this.auditLogsService.create({
      entityType: 'invoice',
      entityId: id,
      action: AuditAction.DELETE,
      description: `Invoice ${invoice.invoiceNumber} deleted`,
    });
  }

  async validateHashChain(companyId: string): Promise<boolean> {
    return await this.hashChainService.validateHashChain(companyId);
  }
}
