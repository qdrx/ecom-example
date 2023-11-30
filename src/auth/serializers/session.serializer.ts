import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { User } from '../../database/entities';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(
    user: any,
    done: (err: Error, user: { id: number }) => void,
  ): any {
    done(null, { id: user.id });
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, user: User) => void,
  ): Promise<void> {
    const user = await this.userService.findOneById(payload.id);
    done(null, user);
  }
}
