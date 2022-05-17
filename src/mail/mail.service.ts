
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}
    async sendUserConfirmation(email : string, token : string){
        const url = `http://localhost:2264/auth/confirm/${email}/${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: "Cảm ơn bạn đã sử dụng Exping",
            template: 'confirmation',
            context: {
                email: email,
                url
            }
        })
    }
}
