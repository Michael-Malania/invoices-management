import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../services/email.service';
import { SalesInvoceDto } from '../dtos/invoice.items.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {

  }
  @ApiOkResponse({ type: SalesInvoceDto })
  @ApiOperation({ summary: 'Send daily sales report' })
  @EventPattern('daily_sales_report')
  async handleDailySalesReport(@Payload(ValidationPipe) data: SalesInvoceDto) {
    console.log('Received daily sales report event');//
    await this.emailService.sendDailySalesReport(data);
  }
}
