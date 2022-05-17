import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
@Module({
  imports: [JwtModule.register({
    secret: 'secret'
  }), MailModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
