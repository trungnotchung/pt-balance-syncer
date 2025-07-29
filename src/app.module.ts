import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config';
import { SyncModule } from './sync/sync.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig().url, {
      dbName: databaseConfig().databaseName,
    }),
    UsersModule,
    SyncModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
