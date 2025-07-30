import { UserRole } from 'src/users/constants/user.constant';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}
