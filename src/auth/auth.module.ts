import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {AuthController} from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {LocalStrategy} from './strategies';
import {RolesGuard} from './guards';
import {SessionSerializer} from './serializers/session.serializer';
import {PassportModule} from '@nestjs/passport';
import {GoogleStrategy} from './strategies';
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({}),
        PassportModule.register({
            session: true,
        }),
        ConfigModule,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        GoogleStrategy,
        RolesGuard,
        SessionSerializer,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
}
