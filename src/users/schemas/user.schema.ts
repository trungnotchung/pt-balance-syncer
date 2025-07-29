import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserRole } from '../constants/user.constant';

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: UserRole,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
