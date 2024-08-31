import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export type InvoiceDocument = Invoice & Document;

// class InvoiceItem {
//   @Prop({ required: true })
//   sku!: string;

//   @Prop({ required: true })
//   qt!: number;
// }

@Schema({
  collection: process.env.INVOICE_COLLECTION_NAME,
  versionKey: false,
  timestamps: true,
})
export class Invoice {
  @Prop({ required: true })
  customer!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  reference!: string;

  @Prop({ default: Date.now })
  date!: Date;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId }],
    required: true,
  })
  items!: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id?: mongoose.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
