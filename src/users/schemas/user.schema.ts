import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
	@Prop({
		type: String,
		required: true,
	})
	address: string;

	@Prop({
		type: String,
		required: true,
	})
	balance: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
