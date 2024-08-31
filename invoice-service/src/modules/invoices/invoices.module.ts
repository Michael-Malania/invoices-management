import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from './services/invoices.service';
import { InvoicesController } from './controllers/invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { DatabaseRepo } from '../../utils/db/services/db.service';
import { ResolveInvoiceId } from './middlewares/invoiceId.middleware';
import { InvoiceItem, InvoiceItemSchema } from './schemas/invoice-items.schema';
import { DailySalesReportCron } from './cron/daily-sales-report.cron';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([
      { name: InvoiceItem.name, schema: InvoiceItemSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, DatabaseRepo, DailySalesReportCron],
})
export class InvoicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResolveInvoiceId)
      .exclude({ path: 'invoices', method: RequestMethod.GET })
      .forRoutes({
        path: 'invoices/:invoiceId',
        method: RequestMethod.GET,
      });
  }
}
