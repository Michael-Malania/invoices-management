import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { InvoicesService } from '../services/invoices.service';
import { CreateInvoiceDto } from '../dtos/create-invoice-body-dto';
import { Invoice } from '../schemas/invoice.schema';
import { Request as expressRequest } from 'express';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetOneInvoiceByIdRespDto } from '../dtos/getOneById-invoice-dto';
import { InvoiceGetAllQuery } from '../dtos/getAll-invoice-query';
import { GetAllInvoicesRespDto } from '../dtos/getAll-invoice-resp-dto';
import { CreateInvoiceRespDto } from '../dtos/create-invoice-resp-dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a invoice' })
  @ApiOkResponse({ type: CreateInvoiceRespDto })
  createInvoice(
    @Body(ValidationPipe) createInvoiceDto: CreateInvoiceDto,
  ): Promise<CreateInvoiceRespDto> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get(':invoiceId')
  @ApiParam({ name: 'invoiceId', type: 'string' })
  @ApiOperation({ summary: 'Get one invoice by invoice id' })
  @ApiOkResponse({ type: GetOneInvoiceByIdRespDto })
  findById(
    @Request() request: expressRequest & { invoice: Invoice },
  ): Promise<GetOneInvoiceByIdRespDto> {
    return this.invoicesService.findById(request);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get All invoices' })
  @ApiOkResponse({ type: GetAllInvoicesRespDto })
  findAll(
    @Query(ValidationPipe) query: InvoiceGetAllQuery,
  ): Promise<GetAllInvoicesRespDto> {
    return this.invoicesService.findAll(query);
  }
}
