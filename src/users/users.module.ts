import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';

import { UserAccountProvider } from './providers/users-account.provider';
import { UserBalanceProvider } from './providers/users-balance.provider';
import { UsersService } from './providers/users.service';
import { UserAccount, UserAccountSchema } from './schemas/user-account.schema';
import { UserBalance, UserBalanceSchema } from './schemas/user-balance.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserBalance.name,
        schema: UserBalanceSchema,
      },
      {
        name: UserAccount.name,
        schema: UserAccountSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserBalanceProvider, UserAccountProvider],
  exports: [UsersService],
})
export class UsersModule {}
