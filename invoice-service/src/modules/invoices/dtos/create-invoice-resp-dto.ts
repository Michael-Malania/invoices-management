import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateInvoiceRespDataDto {
  @ApiProperty()
  public readonly customer!: string;

  @ApiProperty()
  public readonly amount!: number;

  @ApiProperty()
  public readonly reference!: string;

  @ApiProperty()
  public readonly date!: Date;

  @ApiProperty({ type: [String] })
  public readonly items!: Types.ObjectId[];

  @ApiProperty({ required: false, type: String })
  public readonly _id?: Types.ObjectId | undefined;
}

export class CreateInvoiceRespDto {
  @ApiProperty()
  public readonly success!: boolean;

  @ApiProperty({ type: CreateInvoiceRespDataDto })
  public readonly data!: CreateInvoiceRespDataDto | null;
}
