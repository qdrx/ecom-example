import { Reflector } from '@nestjs/core';
import { UserRoles } from '../common/enums';

export const Roles = Reflector.createDecorator<UserRoles[]>();
