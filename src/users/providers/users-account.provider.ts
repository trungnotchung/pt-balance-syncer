import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HashingProvider } from 'src/auth/providers/hashing.provider';

import { UserRole } from '../constants/user.constant';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAccount } from '../schemas/user-account.schema';

@Injectable()
export class UserAccountProvider {
  constructor(
    @InjectModel(UserAccount.name)
    private readonly userAccountModel: Model<UserAccount>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async findUserByUsername(
    username: string,
  ): Promise<UserAccount | undefined> {
    return this.userAccountModel.findOne({ username });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserAccount> {
    try {
      const existingUser = await this.findUserByUsername(
        createUserDto.username,
      );

      // Handle exception
      if (existingUser) {
        throw new BadRequestException(
          'The user already exists, please try another username.',
        );
      }

      // Create a new user
      const newUser = await this.userAccountModel.create({
        username: createUserDto.username,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
        role: UserRole.USER,
      });

      await newUser.save();
      return newUser;
    } catch (error) {
      console.log(`Error creating user: ${error}`);
      throw error;
    }
  }
}
