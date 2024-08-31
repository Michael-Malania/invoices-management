import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  if (!process.env.SWAGGER_USERNAME) {
    console.log('Error: could not load SWAGGER_USERNAME');
  }

  // app.use(
  //   ['/docs', '/docs-json', '/docs-yaml'],
  //   basicAuth({
  //     challenge: true,
  //     users: {
  //       [process.env.SWAGGER_USERNAME || 'admin']:
  //         process.env.SWAGGER_PASSWORD || 'admin',
  //     },
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('Invoices API')
    .setDescription('Invoices API for managing invoices')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'DEV Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (!process.env.PORT) {
    console.log('Error: could not load PORT');
  }
  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.log(`Application running at ${await app.getUrl()}`);
}
bootstrap();
