
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}
    async sendUserConfirmation(email : string, token : string){
        const url = `http://nhom2androitht2022.eastasia.cloudapp.azure.com/auth/confirm/${email}/${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: "Xác thực tài khoản",
            template: 'confirmation',
            context: {
                email: email,
                url
            }
        })
    }
    async sendUserEmailReset(email: string, token: string){
        await this.mailerService.sendMail({
            to: email,
            subject: "Email yêu cầu đặt lại mật khẩu",
            template:  'resetemail',
            context: 
            {
                email: email,
                otp: token
            }
        })
    }
}
