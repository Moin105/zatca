import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('credit-notes')
@UseGuards(JwtAuthGuard)
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  create(@Body() dto: CreateCreditNoteDto) {
    return this.creditNotesService.create(dto);
  }

  @Get()
  findAll() {
    return this.creditNotesService.findAll();
  }

  @Get('by-invoice/:invoiceId')
  findByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.creditNotesService.findByInvoiceId(invoiceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditNotesService.findOne(id);
  }

  @Post(':id/issue')
  issue(@Param('id') id: string) {
    return this.creditNotesService.issue(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditNotesService.remove(id);
  }
}
