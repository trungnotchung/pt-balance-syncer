import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [
        appConfig,
        databaseConfig,
        ethereumConfig,
        contractsConfig,
        jwtConfig,
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      ...jwtConfig.asProvider(),
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
