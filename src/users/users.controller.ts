import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { UserRoles } from '../common/enums';
import { Roles } from '../decorators/roles.decorator';
import { ServiceException } from '../common/exceptions';
import { Request } from 'express';
import { AuthentificatedGuard, RolesGuard } from '../auth/guards';
import { User } from '../database/entities';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthentificatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles([UserRoles.developer])
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<User[]> {
    return await this.usersService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string): Promise<User> {
    const findUser = await this.usersService.findOneById(+id);
    if (req.user['id'] == findUser.id) return findUser;
    throw new ForbiddenException();
  }

  @Put()
  update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const id = +req.user['id'];
      return this.usersService.update(id, updateUserDto);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { msg: 'Not implemented yet', id };
  }
}
