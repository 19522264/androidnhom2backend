import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          port: 587,
          requireTLS: true,
          auth: {
            user: 'expingteam@gmail.com',
            pass: 'exping!exping',
          }
        },
        defaults: {
          from: `No Reply expingteam@gmail.com`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
              strict: false
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
