import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Sync } from "./schemas/sync.schema";
import { Model } from "mongoose";

@Injectable()
export class SyncService {
	constructor(
		@InjectModel(Sync.name) private syncModel: Model<Sync>
	) {}
}