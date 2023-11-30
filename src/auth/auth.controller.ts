import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { GoogleGuard, LocalGuard } from './guards';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async signUpLocal(@Req() req: Request, @Body() dto: RegisterUserDto) {
    return await this.authService.registerUser(dto);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  async loginLocal(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  googleLoginCallback(@Req() req, @Res() res) {
    const { user } = req;
    res.redirect(`/api/users/${user.id}`);
  }
}
