import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Sync } from "./schemas/sync.schema";
import { Model } from "mongoose";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SyncService {
	constructor(
		@InjectModel(Sync.name)
		private readonly syncModel: Model<Sync>,
		private readonly usersService: UsersService
	) {
	}
}