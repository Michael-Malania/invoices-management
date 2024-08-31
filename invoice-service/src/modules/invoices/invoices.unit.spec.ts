import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './controllers/invoices.controller';
import { InvoicesService } from './services/invoices.service';
import { CreateInvoiceDto } from './dtos/create-invoice-body-dto';
import {
  CreateInvoiceRespDto,
  CreateInvoiceRespDataDto,
} from './dtos/create-invoice-resp-dto';
import { Types } from 'mongoose';
import {
  GetOneInvoiceByIdRespDataDto,
  GetOneInvoiceByIdRespDto,
} from './dtos/getOneById-invoice-dto';
import { InvoiceGetAllQuery } from './dtos/getAll-invoice-query';
import { GetAllInvoicesRespDto } from './dtos/getAll-invoice-resp-dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(), // Add this line
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('Should return a CreateInvoiceRespDto object when the invoice is created successfully', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'John Doe',
      amount: 100.0,
      reference: 'INV-001',
      date: new Date(),
      items: [
        { sku: 'ITEM-1', qt: 1 },
        { sku: 'ITEM-2', qt: 2 },
      ],
    };

    const expectedResultData: CreateInvoiceRespDataDto = {
      customer: 'John Doe',
      amount: 100.0,
      reference: 'INV-001',
      date: createInvoiceDto.date,
      items: [new Types.ObjectId(), new Types.ObjectId()],
      _id: new Types.ObjectId(),
    };

    const expectedResult: CreateInvoiceRespDto = {
      success: true,
      data: expectedResultData,
    };

    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValueOnce(expectedResult);

    const result = await controller.createInvoice(createInvoiceDto);

    expect(createSpy).toHaveBeenCalledWith(createInvoiceDto);
    expect(result).toEqual(expectedResult);
  });

  it('Should verify that the returned GetOneInvoiceByIdRespDto object matches the expected structure and contains the correct data', async () => {
    const mockRequest = {
      invoice: {
        _id: new Types.ObjectId(),
        customer: 'John Doe',
        amount: 100.0,
        reference: 'INV-001',
        date: new Date(),
        items: [
          { _id: new Types.ObjectId(), sku: 'ITEM-1', qt: 1 },
          { _id: new Types.ObjectId(), sku: 'ITEM-2', qt: 2 },
        ],
      },
    };

    const expectedResultData: GetOneInvoiceByIdRespDataDto = {
      _id: mockRequest.invoice._id,
      customer: mockRequest.invoice.customer,
      amount: mockRequest.invoice.amount,
      reference: mockRequest.invoice.reference,
      date: mockRequest.invoice.date,
      items: mockRequest.invoice.items.map((item) => ({
        _id: item._id.toString(),
        sku: item.sku,
        qt: item.qt,
      })),
    };

    const expectedResult: GetOneInvoiceByIdRespDto = {
      success: true,
      data: expectedResultData,
    };

    const findByIdSpy = jest
      .spyOn(service, 'findById')
      .mockResolvedValueOnce(expectedResult);

    const result = await controller.findById(mockRequest as any);

    expect(findByIdSpy).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(expectedResult);
  });

  it('should Get all invoices', async () => {
    const expectedResult = new GetAllInvoicesRespDto();

    const mockQuery: InvoiceGetAllQuery = {
      startDate: new Date('2023-05-01T00:00:00.000Z'),
      endDate: new Date('2023-05-31T23:59:59.999Z'),
      customer: 'John Doe',
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

    const result = await controller.findAll(mockQuery);

    expect(result).toEqual(expect.objectContaining(expectedResult));
    expect(service.findAll).toHaveBeenCalledWith(mockQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should Get all invoices with startDate and endDate but no customer', async () => {
    const expectedResult = new GetAllInvoicesRespDto();
    const mockQuery: InvoiceGetAllQuery = {
      startDate: new Date('2023-05-01T00:00:00.000Z'),
      endDate: new Date('2023-05-31T23:59:59.999Z'),
    };
    jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);
    const result = await controller.findAll(mockQuery);
    expect(result).toEqual(expect.objectContaining(expectedResult));
    expect(service.findAll).toHaveBeenCalledWith(mockQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should Get all invoices with customer but no startDate and endDate', async () => {
    const expectedResult = new GetAllInvoicesRespDto();
    const mockQuery: InvoiceGetAllQuery = {
      customer: 'John Doe',
    };
    jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);
    const result = await controller.findAll(mockQuery);
    expect(result).toEqual(expect.objectContaining(expectedResult));
    expect(service.findAll).toHaveBeenCalledWith(mockQuery);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should get one invoice by id', async () => {
    const expectedResult = new GetOneInvoiceByIdRespDto();
    const mockRequest = {
      invoice: { _id: new Types.ObjectId() },
    };
    jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);
    const result = await controller.findById(mockRequest as any);
    expect(result).toEqual(expect.objectContaining(expectedResult));
    expect(service.findById).toHaveBeenCalledWith(mockRequest);
    expect(service.findById).toHaveBeenCalledTimes(1);
  });

  it('should create an invoice', async () => {
    const expectedResult = new CreateInvoiceRespDto();
    const mockCreateInvoiceDto: CreateInvoiceDto = {
      customer: 'Jane Doe',
      amount: 200.0,
      reference: 'INV-002',
      date: new Date(),
      items: [{ sku: 'ITEM-3', qt: 3 }],
    };
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
    const result = await controller.createInvoice(mockCreateInvoiceDto);
    expect(result).toEqual(expect.objectContaining(expectedResult));
    expect(service.create).toHaveBeenCalledWith(mockCreateInvoiceDto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the invoiceId is not a valid ObjectId', async () => {
    const invalidInvoiceId = 'invalid-id';
    const mockRequest: any = { params: { invoiceId: invalidInvoiceId } };

    const findByIdSpy = jest
      .spyOn(service, 'findById')
      .mockRejectedValueOnce(new Error('Invalid ObjectId'));

    await expect(controller.findById(mockRequest)).rejects.toThrow(
      'Invalid ObjectId',
    );
    expect(findByIdSpy).toHaveBeenCalledWith(mockRequest);
  });

  it('should throw an error when qt is negative or zero in CreateInvoiceDto', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'John Doe',
      amount: 100.0,
      reference: 'INV-001',
      date: new Date(),
      items: [
        { sku: 'ITEM-1', qt: -1 },
        { sku: 'ITEM-2', qt: 0 },
      ],
    };

    const createSpy = jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(
        new Error('Item quantity must be a positive number'),
      );

    await expect(controller.createInvoice(createInvoiceDto)).rejects.toThrow(
      'Item quantity must be a positive number',
    );
    expect(createSpy).toHaveBeenCalledWith(createInvoiceDto);
  });

  it('should throw an error when the request object does not contain an invoice property', async () => {
    const mockRequest: any = {};

    const findByIdSpy = jest
      .spyOn(service, 'findById')
      .mockRejectedValueOnce(
        new Error('Request object does not contain an invoice property'),
      );

    await expect(controller.findById(mockRequest)).rejects.toThrow(
      'Request object does not contain an invoice property',
    );
    expect(findByIdSpy).toHaveBeenCalledWith(mockRequest);
  });
});
