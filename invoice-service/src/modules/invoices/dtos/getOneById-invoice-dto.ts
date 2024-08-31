import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetOneInvoiceByIdRespItemsDto {
  @ApiProperty()
  public readonly _id!: string;
  @ApiProperty()
  public readonly sku!: string;
  @ApiProperty()
  public readonly qt!: number;
}

export class GetOneInvoiceByIdRespDataDto {
  @ApiProperty({ type: String, format: 'ObjectId' })
  public readonly _id?: Types.ObjectId;
  @ApiProperty()
  public readonly customer?: string;
  @ApiProperty()
  public readonly amount?: number;
  @ApiProperty()
  public readonly reference?: string;
  @ApiProperty()
  public readonly date?: Date;
  @ApiProperty({ type: [GetOneInvoiceByIdRespItemsDto] })
  public readonly items?: GetOneInvoiceByIdRespItemsDto[] | null;
}

export class GetOneInvoiceByIdRespDto {
  @ApiProperty()
  public readonly success!: boolean;
  @ApiProperty({ type: GetOneInvoiceByIdRespDataDto })
  public readonly data!: GetOneInvoiceByIdRespDataDto;
}
