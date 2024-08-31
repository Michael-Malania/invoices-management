import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SalesInvoceDto } from '../dtos/invoice.items.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {
  }

  async sendDailySalesReport(report: SalesInvoceDto) {
    interface ItemSale {
      sku: string;
      quantity: number;
    }

    const tableRows = report.itemSales
      ? report.itemSales
          .map(
            (item: ItemSale) => `
        <tr>
          <td>${item.sku}</td>
          <td>${item.quantity}</td>
        </tr>
      `,
          )
          .join('')
      : '';

    const htmlContent = `
      <h2>Daily Sales Report</h2>
      <p><strong>Total Sales:</strong> $${report.totalSales.toFixed(2)}</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>SKU</th>
          <th>Quantity</th>
        </tr>
        ${tableRows}
      </table>
    `;
          console.log({
            to: process.env.MAILER_TO,
            subject: 'Daily Sales Report',
            text: 'Here you can review your daily sales report.',
          })
    await this.mailerService.sendMail({
      to: process.env.MAILER_TO,
      subject: 'Daily Sales Report',
      text: 'Here you can review your daily sales report.',
      html: htmlContent,
    });
  }
}
