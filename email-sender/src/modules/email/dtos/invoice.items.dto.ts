import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SalesInvoceItemSalesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly sku!: string;

  @ApiProperty()
  @IsNumber()
  public readonly quantity!: number;
}

export class SalesInvoceDto {
  @ApiProperty()
  @IsNumber()
  public readonly totalSales!: number;

  @ApiProperty({ type: [SalesInvoceItemSalesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesInvoceItemSalesDto)
  public readonly itemSales!: SalesInvoceItemSalesDto[] | null;
}
