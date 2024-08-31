import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './modules/email/services/email.service';
import {
  SalesInvoceDto,
  SalesInvoceItemSalesDto,
} from './modules/email/dtos/invoice.items.dto';
import { EmailController } from './modules/email/controllers/email.controller';

describe('EmailController', () => {
  let controller: EmailController;
  let module: TestingModule;
  let service: EmailService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendDailySalesReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
  });

  it('should call the emailService.sendDailySalesReport method with the provided data', async () => {
    const mockData: SalesInvoceDto = {
      totalSales: 0,
      itemSales: [],
    };
    const spy = jest.spyOn(service, 'sendDailySalesReport');

    await controller.handleDailySalesReport(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should handle case where data.itemSales contains duplicate items', async () => {
    const mockData: SalesInvoceDto = {
      totalSales: 100,
      itemSales: [
        {
          itemName: 'Item A',
          quantity: 2,
          totalPrice: 20,
          sku: 'SKU001',
        } as SalesInvoceItemSalesDto,
        {
          itemName: 'Item B',
          quantity: 1,
          totalPrice: 30,
          sku: 'SKU002',
        } as SalesInvoceItemSalesDto,
        {
          itemName: 'Item A',
          quantity: 3,
          totalPrice: 30,
          sku: 'SKU001',
        } as SalesInvoceItemSalesDto,
      ],
    };
    const spy = jest.spyOn(service, 'sendDailySalesReport');

    await controller.handleDailySalesReport(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should handle case where data.totalSales is negative', async () => {
    const mockData: SalesInvoceDto = {
      totalSales: -50,
      itemSales: [
        {
          itemName: 'Item A',
          quantity: 2,
          totalPrice: 20,
          sku: 'SKU001',
        } as SalesInvoceItemSalesDto,
        {
          itemName: 'Item B',
          quantity: 1,
          totalPrice: 30,
          sku: 'SKU002',
        } as SalesInvoceItemSalesDto,
      ],
    };
    const spy = jest.spyOn(service, 'sendDailySalesReport');

    await controller.handleDailySalesReport(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should handle case where data.itemSales is an empty array', async () => {
    const mockData: SalesInvoceDto = {
      totalSales: 100,
      itemSales: [],
    };
    const spy = jest.spyOn(service, 'sendDailySalesReport');

    await controller.handleDailySalesReport(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should handle case where data.itemSales contains a large number of items', async () => {
    const mockData: SalesInvoceDto = {
      totalSales: 1000000,
      itemSales: Array.from({ length: 10000 }, (_, index) => ({
        itemName: `Item ${index + 1}`,
        quantity: index + 1,
        totalPrice: (index + 1) * 10,
        sku: `SKU${index + 1}`,
      })),
    };
    const spy = jest.spyOn(service, 'sendDailySalesReport');

    await controller.handleDailySalesReport(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });
});
