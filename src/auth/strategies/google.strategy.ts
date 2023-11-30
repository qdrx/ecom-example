import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { IGoogleProfile } from './interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('googleOauth.clientId'),
      clientSecret: configService.get('googleOauth.secret'),
      callbackURL: configService.get('googleOauth.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: IGoogleProfile,
    done: (err: Error, user: { id: number }) => void,
  ) {
    const user = await this.authService.validateUserWithGoogle(profile);
    console.log(user);
    if (user) {
      return done(null, user);
    }
    return done(null, user);
  }
}
