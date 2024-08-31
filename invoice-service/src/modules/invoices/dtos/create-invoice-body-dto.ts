import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray } from 'class-validator';

export class InvoiceItemDto {
  @ApiProperty({ required: true })
  @IsString()
  public readonly sku!: string;

  @ApiProperty({ required: true })
  @IsNumber()
  public readonly qt!: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ required: true })
  @IsString()
  public readonly customer!: string;

  @ApiProperty({ required: true })
  @IsNumber()
  public readonly amount!: number;

  @ApiProperty({ required: true })
  @IsString()
  public readonly reference!: string;

  @ApiProperty({ type: Date, default: Date.now, required: true })
  public readonly date!: Date;

  @ApiProperty({ type: [InvoiceItemDto], required: true })
  @IsArray()
  public readonly items!: InvoiceItemDto[];
}
