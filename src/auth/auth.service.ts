import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto';
import { hashUtils } from '../utils/hashUtils.util';
import { ServiceException } from '../common/exceptions';
import { User } from '../database/entities';
import { IGoogleProfile } from './strategies/interfaces';
import { UserRoles } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new ServiceException('Incorrect email or password', 403);
    const validPassword = await hashUtils.compareHashData(
      password,
      user.passwordHash,
    );
    if (validPassword) {
      return user;
    }
    throw new ServiceException('Incorrect email or password', 403);
  }

  async registerUser(dto: RegisterUserDto) {
    try {
      await this.userService.create(dto);
      return { message: 'User is successfully registered' };
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async matchRoles(userRoles: string[], requiredRoles: string[]) {
    return userRoles.some((role) => requiredRoles.includes(role));
  }

  async validateUserWithGoogle(profile: IGoogleProfile) {
    const user = await this.userService.findOneByEmail(profile.emails[0].value);
    if (!user) {
      return await this.userService.createGoogleUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        password: 'GOOGLE_OAUTH',
        phone: null,
        roles: [UserRoles.uncompleted],
      });
    }
    return user;
  }
}
