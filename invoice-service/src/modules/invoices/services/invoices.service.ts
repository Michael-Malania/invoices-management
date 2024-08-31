import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';
import { CreateInvoiceDto } from '../dtos/create-invoice-body-dto';
// import { getOneInvoiceByIdDto } from '../dtos/getOneById-invoice-dto';
import { Request } from 'express';
import { InvoiceGetAllQuery } from '../dtos/getAll-invoice-query';
import { DatabaseRepo } from '../../../utils/db/services/db.service';
import { InvoiceItem } from '../schemas/invoice-items.schema';
import { CreateInvoiceRespDto } from '../dtos/create-invoice-resp-dto';
import {
  GetAllInvoicesRespDataDto,
  GetAllInvoicesRespDto,
} from '../dtos/getAll-invoice-resp-dto';
import {
  GetOneInvoiceByIdRespDataDto,
  GetOneInvoiceByIdRespDto,
} from '../dtos/getOneById-invoice-dto';

@Injectable()
export class InvoicesService {
  constructor(
    private databaseRepo: DatabaseRepo,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(InvoiceItem.name) private invoiceItemModel: Model<InvoiceItem>,
  ) {}

  async create(body: CreateInvoiceDto): Promise<CreateInvoiceRespDto> {
    const createdInvoiceItems = await this.databaseRepo.createMany(
      body.items,
      this.invoiceItemModel,
    );

    const updatedBody = {
      ...body,
      items:
        createdInvoiceItems
          ?.filter(
            (
              item,
            ): item is InvoiceItem & { _id: NonNullable<InvoiceItem['_id']> } =>
              item._id !== undefined,
          )
          .map((item) => item._id) || [],
    };

    const createdInvoice = await this.databaseRepo.create(
      updatedBody,
      this.invoiceModel,
    );

    return {
      success: true,
      data: createdInvoice,
    };
  }

  async findById(
    request: Request & { invoice: Invoice },
  ): Promise<GetOneInvoiceByIdRespDto> {
    const invoice = request.invoice;

    const itemsFullData = (await this.databaseRepo.getOneContent(
      { _id: invoice._id },
      this.invoiceModel,
      undefined,
      {
        path: 'items',
        model: this.invoiceItemModel,
        select: 'sku qt',
      },
    )) as GetOneInvoiceByIdRespDataDto;

    return {
      success: true,
      data: itemsFullData,
    };
  }
  async findAll(query: InvoiceGetAllQuery): Promise<GetAllInvoicesRespDto> {
    const finalQuery: {
      date?: { $gte: Date; $lte: Date };
      customer?: string;
    } = {};

    if (query.startDate && query.endDate) {
      finalQuery.date = { $gte: query.startDate, $lte: query.endDate };
    }

    if (query.customer) {
      finalQuery.customer = query.customer;
    }

    const itemsFullData = (await this.databaseRepo.getAllContent(
      finalQuery,
      this.invoiceModel,
      undefined,
      {
        path: 'items',
        model: this.invoiceItemModel,
        select: 'sku qt',
      },
    )) as GetAllInvoicesRespDataDto[];

    return {
      success: true,
      data: itemsFullData,
    };
  }

  async generateDailySalesReport(startDate: Date, endDate: Date) {
    const invoices = await this.databaseRepo.getAllContent(
      {
        date: { $gte: startDate, $lte: endDate },
      },
      this.invoiceModel,
      undefined,
      {
        path: 'items',
        model: this.invoiceItemModel,
        select: 'sku qt',
      },
    );

    let totalSales = 0;
    const itemSales: { [key: string]: number } = {};

    for (const invoice of invoices) {
      totalSales += invoice.amount ?? 0;
      if (invoice.items && Array.isArray(invoice.items)) {
        for (const item of invoice.items) {
          if (
            item &&
            typeof item === 'object' &&
            'sku' in item &&
            'qt' in item
          ) {
            const invoiceItem = item as InvoiceItem;
            if (invoiceItem.sku && typeof invoiceItem.qt === 'number') {
              if (itemSales[invoiceItem.sku]) {
                itemSales[invoiceItem.sku] += invoiceItem.qt;
              } else {
                itemSales[invoiceItem.sku] = invoiceItem.qt;
              }
            }
          }
        }
      }
    }

    return {
      totalSales,
      itemSales: Object.entries(itemSales).map(([sku, quantity]) => ({
        sku,
        quantity,
      })),
    };
  }
}
