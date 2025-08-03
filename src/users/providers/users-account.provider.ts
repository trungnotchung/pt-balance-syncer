import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';

import { HashingProvider } from 'src/auth/providers/hashing.provider';

import { UserRole } from '../constants/user.constant';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAccount } from '../schemas/user-account.schema';

@Injectable()
export class UserAccountProvider {
  private readonly logger = new Logger(UserAccountProvider.name);

  constructor(
    @InjectModel(UserAccount.name)
    private readonly userAccountModel: Model<UserAccount>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async findUserByUsername(
    username: string,
  ): Promise<UserAccount | null> {
    return this.userAccountModel.findOne({ username });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserAccount> {
    const existing = await this.findUserByUsername(createUserDto.username);
    if (existing) {
      throw new ConflictException(
        'Username already exists. Please choose another one.',
      );
    }

    try {
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );
      const user = await this.userAccountModel.create({
        username: createUserDto.username,
        password: hashedPassword,
        role: UserRole.USER,
      });
      return user;
    } catch (err: any) {
      if (err instanceof mongo.MongoError && err.code === 11000) {
        throw new ConflictException(
          'Username already exists. Please choose another one.',
        );
      }

      this.logger.error('Unexpected error creating user', err.stack);
      throw new InternalServerErrorException(
        'Could not create user at this time.',
      );
    }
  }
}
