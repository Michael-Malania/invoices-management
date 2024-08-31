import { NextFunction, Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DatabaseRepo } from '../../../utils/db/services/db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';
// import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class ResolveInvoiceId implements NestMiddleware {
  constructor(
    private databaseRepo: DatabaseRepo,
    @InjectModel(Invoice.name)
    private invoiceModel: mongoose.Model<InvoiceDocument>,
  ) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const { invoiceId } = request.params;

    if (!Types.ObjectId.isValid(invoiceId)) {
      console.error(`INVALID_INVOICE_ID, invoiceId: ${invoiceId}`);
      throw new HttpException(
        {
          message: 'Invalid invoice ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const invoiceData = await this.databaseRepo.findById(
      new mongoose.Types.ObjectId(invoiceId),
      this.invoiceModel,
    );

    if (!invoiceData || !Object.keys(invoiceData).length) {
      console.error(`NO_INVOICE_FOUND, invoiceId: ${invoiceId}`);
      throw new HttpException(
        {
          message: 'No invoice found for given ID',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // (request as any)['invoice'] = invoiceData;
    (request as Request & { invoice: Invoice })['invoice'] = invoiceData;

    next();
  }
}
