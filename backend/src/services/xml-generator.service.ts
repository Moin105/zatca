import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { Invoice } from '../entities/invoice.entity';
import { Company } from '../entities/company.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class XmlGeneratorService {
  /**
   * Generate UBL 2.1 XML invoice
   */
  generateUBLInvoice(
    invoice: Invoice,
    company: Company,
    customer: Customer,
  ): string {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('Invoice', {
        xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
        'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
      });

    // Invoice ID
    root.ele('cbc:ID').txt(invoice.invoiceNumber);

    // Issue Date
    root.ele('cbc:IssueDate').txt(
      invoice.issueDateTime.toISOString().split('T')[0]
    );

    // Issue Time
    root.ele('cbc:IssueTime').txt(
      invoice.issueDateTime.toISOString().split('T')[1].split('.')[0]
    );

    // Invoice Type Code
    root.ele('cbc:InvoiceTypeCode').txt('388');

    // Document Currency Code (SAR)
    root.ele('cbc:DocumentCurrencyCode').txt('SAR');

    // Accounting Supplier Party
    const supplierParty = root.ele('cac:AccountingSupplierParty');
    const supplierPartyParty = supplierParty.ele('cac:Party');
    supplierPartyParty.ele('cac:PartyName').ele('cbc:Name').txt(company.name);
    
    const supplierPartyTaxScheme = supplierPartyParty
      .ele('cac:PartyTaxScheme');
    supplierPartyTaxScheme.ele('cbc:CompanyID').txt(company.vatNumber);
    supplierPartyTaxScheme.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');

    // Accounting Customer Party
    const customerParty = root.ele('cac:AccountingCustomerParty');
    const customerPartyParty = customerParty.ele('cac:Party');
    customerPartyParty.ele('cac:PartyName').ele('cbc:Name').txt(customer.name);
    
    if (customer.vatNumber) {
      const customerPartyTaxScheme = customerPartyParty
        .ele('cac:PartyTaxScheme');
      customerPartyTaxScheme.ele('cbc:CompanyID').txt(customer.vatNumber);
      customerPartyTaxScheme.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');
    }

    // Invoice Lines
    const invoiceLines = root.ele('cac:InvoiceLine');
    invoice.items.forEach((item, index) => {
      const line = invoiceLines.ele('cac:InvoiceLine', { index: index + 1 });
      line.ele('cbc:ID').txt((index + 1).toString());
      line.ele('cbc:InvoicedQuantity', { unitCode: 'C62' }).txt(item.quantity.toString());
      line.ele('cbc:LineExtensionAmount', { currencyID: 'SAR' }).txt(item.lineTotal.toFixed(2));
      
      const itemElement = line.ele('cac:Item');
      itemElement.ele('cbc:Name').txt(item.name);
      if (item.description) {
        itemElement.ele('cbc:Description').txt(item.description);
      }

      const price = line.ele('cac:Price');
      price.ele('cbc:PriceAmount', { currencyID: 'SAR' }).txt(item.unitPrice.toFixed(2));

      const taxTotal = line.ele('cac:TaxTotal');
      taxTotal.ele('cbc:TaxAmount', { currencyID: 'SAR' }).txt(item.vatAmount.toFixed(2));
      const taxCategory = taxTotal.ele('cac:TaxSubtotal').ele('cac:TaxCategory');
      taxCategory.ele('cbc:ID').txt('S');
      taxCategory.ele('cbc:Percent').txt(item.vatRate.toString());
      taxCategory.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');
    });

    // Legal Monetary Total
    const legalMonetaryTotal = root.ele('cac:LegalMonetaryTotal');
    legalMonetaryTotal.ele('cbc:LineExtensionAmount', { currencyID: 'SAR' })
      .txt(invoice.subtotal.toFixed(2));
    legalMonetaryTotal.ele('cbc:TaxExclusiveAmount', { currencyID: 'SAR' })
      .txt(invoice.subtotal.toFixed(2));
    legalMonetaryTotal.ele('cbc:TaxInclusiveAmount', { currencyID: 'SAR' })
      .txt(invoice.totalAmount.toFixed(2));
    legalMonetaryTotal.ele('cbc:PayableAmount', { currencyID: 'SAR' })
      .txt(invoice.totalAmount.toFixed(2));

    // Tax Total
    const taxTotal = root.ele('cac:TaxTotal');
    taxTotal.ele('cbc:TaxAmount', { currencyID: 'SAR' })
      .txt(invoice.vatAmount.toFixed(2));
    const taxCategory = taxTotal.ele('cac:TaxSubtotal').ele('cac:TaxCategory');
    taxCategory.ele('cbc:ID').txt('S');
    taxCategory.ele('cbc:Percent').txt('15');
    taxCategory.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');

    return root.end({ prettyPrint: true });
  }
}
