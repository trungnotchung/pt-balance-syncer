import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import {
  appConfig,
  contractsConfig,
  databaseConfig,
  ethereumConfig,
  jwtConfig,
} from './config';
import { SyncModule } from './sync/sync.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        ethereumConfig,
        contractsConfig,
        jwtConfig,
      ],
    }),
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
