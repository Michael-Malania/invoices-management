// import { Injectable } from '@nestjs/common';
// import { EmailService } from './email.service';
// import { MessagePattern, Payload } from '@nestjs/microservices';

// @Injectable()
// export class EmailConsumerService {
//   constructor(private readonly emailService: EmailService) {}

//   @MessagePattern('daily_sales_report')
//   async handleDailySalesReport(@Payload() data: any) {
//     try {
//       await this.emailService.sendDailySalesReport(data);
//       console.log('Daily sales report email sent successfully');
//     } catch (error) {
//       console.error('Error sending daily sales report email:', error);
//     }
//   }
// }
