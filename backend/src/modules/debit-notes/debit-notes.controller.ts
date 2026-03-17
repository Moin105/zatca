import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DebitNotesService } from './debit-notes.service';
import { CreateDebitNoteDto } from './dto/create-debit-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('debit-notes')
@UseGuards(JwtAuthGuard)
export class DebitNotesController {
  constructor(private readonly debitNotesService: DebitNotesService) {}

  @Post()
  create(@Body() dto: CreateDebitNoteDto) {
    return this.debitNotesService.create(dto);
  }

  @Get()
  findAll() {
    return this.debitNotesService.findAll();
  }

  @Get('by-invoice/:invoiceId')
  findByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.debitNotesService.findByInvoiceId(invoiceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debitNotesService.findOne(id);
  }

  @Post(':id/issue')
  issue(@Param('id') id: string) {
    return this.debitNotesService.issue(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debitNotesService.remove(id);
  }
}
