import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { UserRoles } from '../../common/enums';


export class CreateGoogleUserDto {
  // THIS DTO IS NOT DESIGNED TO BE USED IN CONTROLLER

  googleId?: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsPhoneNumber()
  phone: string;

  roles?: UserRoles[];
}
