import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { CustomLoggerProvider } from './utils/logging/logger.provider';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      typeof process.env.DB_URI === 'string' ? process.env.DB_URI : '',
      {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        dbName: process.env.DB_NAME,
      },
    ),
    InvoicesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLoggerProvider,
    {
      provide: APP_FILTER,
      useClass: CustomLoggerProvider,
    },
  ],
})
export class AppModule {}
