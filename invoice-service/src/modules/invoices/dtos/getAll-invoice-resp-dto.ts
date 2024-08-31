import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetAllInvoicesRespItemsDto {
  @ApiProperty()
  public readonly _id!: string;
  @ApiProperty()
  public readonly sku!: string;
  @ApiProperty()
  public readonly qt!: number;
}

export class GetAllInvoicesRespDataDto {
  @ApiProperty({ type: String, format: 'ObjectId' })
  public readonly _id?: Types.ObjectId | undefined;
  @ApiProperty()
  public readonly customer?: string;
  @ApiProperty()
  public readonly amount?: number;
  @ApiProperty()
  public readonly reference?: string;
  @ApiProperty({ type: Date })
  public readonly date?: Date;
  @ApiProperty({ type: [GetAllInvoicesRespItemsDto] })
  public readonly items?: GetAllInvoicesRespItemsDto[] | null;
}

export class GetAllInvoicesRespDto {
  @ApiProperty()
  public readonly success!: boolean;
  @ApiProperty({ type: [GetAllInvoicesRespDataDto] })
  public readonly data!: GetAllInvoicesRespDataDto[] | null;
}
