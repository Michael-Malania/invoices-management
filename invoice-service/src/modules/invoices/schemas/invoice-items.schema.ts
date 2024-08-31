import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export type InvoiceItemDocument = InvoiceItem & Document;

@Schema({
  collection: process.env.INVOICE_ITEM_COLLECTION_NAME,
  versionKey: false,
})
export class InvoiceItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  sku!: string;

  @Prop({ required: true })
  qt!: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
