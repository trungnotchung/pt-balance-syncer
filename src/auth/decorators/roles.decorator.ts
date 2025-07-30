import { Reflector } from '@nestjs/core';

import { UserRole } from 'src/users/constants/user.constant';

export const Roles = Reflector.createDecorator<UserRole[]>();
