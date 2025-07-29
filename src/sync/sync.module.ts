import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';

import { SyncTransfer, SyncTransferSchema } from './schemas/sync.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncTransfer.name, schema: SyncTransferSchema },
    ]),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            audience: jwtConfig.audience,
            issuer: jwtConfig.issuer,
            expiresIn: jwtConfig.accessTokenTtl,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
