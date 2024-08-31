import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceGetAllQuery {
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.endDate !== undefined)
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.startDate !== undefined)
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.customer !== undefined)
  @IsString()
  customer?: string;
}
