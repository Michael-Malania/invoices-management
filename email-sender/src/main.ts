import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.RMQ,
//       options: {
//         urls: [process.env.RABBITMQ_HOST || 'amqp://localhost:5672'],
//         queueOptions: {
//           durable: false,
//         },
//       },
//     },
//   );

//   app.listen();
//   console.log(
//     'Microservice is listening on RabbitMQ queue: daily_sales_report',
//   );
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://172.25.0.2:5672'],
      queue: 'daily_sales_report',
      queueOptions: {
        durable: false,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Microservice API')
    .setDescription('The microservice API description')
    .setVersion('1.0')
    .addServer('http://localhost:3001', 'DEV Local')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(3001);

}
bootstrap();
