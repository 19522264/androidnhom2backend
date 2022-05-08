import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { GcloudservicesService } from './gcloudservices/gcloudservices.service';

@Global()
@Module({
  imports: [UserModule, PrismaModule,  
     ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, GcloudservicesService],
})
export class AppModule {}
