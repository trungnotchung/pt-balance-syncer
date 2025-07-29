import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';

import { UserBalanceProvider } from './providers/users-balance.provider';
import { UsersService } from './providers/users.service';
import { UserBalance, UserBalanceSchema } from './schemas/user-balance.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserBalance.name,
        schema: UserBalanceSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserBalanceProvider],
  exports: [UsersService],
})
export class UsersModule {}
