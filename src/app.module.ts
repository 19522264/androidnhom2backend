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
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { GroupModule } from './group/group.module';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';

@Global()
@Module({
  imports: [UserModule, PrismaModule,  
     ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, MessageModule, MailModule, GroupModule],
  controllers: [AppController, UserController, MessageController, MailController, GroupController],
  providers: [AppService, UserService, GcloudservicesService, MessageService, GroupService],
})
export class AppModule {}
