import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InvoicesService } from '../services/invoices.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class DailySalesReportCron {
  private client: ClientProxy;

  constructor(private readonly invoicesService: InvoicesService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'daily_sales_report',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  @Cron('0 12 * * *')
  async handleDailySalesReport() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    console.log(`Generating daily sales report for ${yesterday.toISOString()}`);
    const salesReport = await this.invoicesService.generateDailySalesReport(
      yesterday,
      today,
    );

    await this.client.emit('daily_sales_report', salesReport);
  }
}
