import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserBalance extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  balance: string;
}

export const UserBalanceSchema = SchemaFactory.createForClass(UserBalance);
