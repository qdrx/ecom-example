import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateUserDto)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
