import { BadRequestException, Body, ForbiddenException, Injectable, Post } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { emit } from 'process';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Userdto } from 'src/user/dto/user.dto';
@Injectable()
export class AuthService {
    constructor(private prismaService : PrismaService, private mailService: MailService){}
    async registerUser(userdto: Userdto) {
        const user = await this.prismaService.users.findFirst({where: { email: userdto.email }})
        if (user){
            throw new BadRequestException('user existed')
        }
        try{
            const token = Math.floor(1000 + Math.random() * 9000).toString()
            const result =  await this.prismaService.users.create({data: 
                {
                    email: userdto.email,
                    password: userdto.password,
                    confirm: token
            }})
            await this.mailService.sendUserConfirmation(userdto.email, token);
            return result
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                  throw new ForbiddenException('Credential taken');
                }
              }
            throw error;
        }
    }
    async findUser(Email: string) {
        return await this.prismaService.users.findFirst({where: {
            email: Email
        }})
    }
    async conFirmUser(email : string, token : string){
        const result = await this.prismaService.users.findUnique({
            where: {
                email: email
            }
        })
        if (result.confirm !== 'confirmed' && result.confirm === token) {
            const result1 = await this.prismaService.users.update({
                where: {
                    email: email
                },
                data: {
                    confirm : 'confirmed'
                }
            })
            return "Xác thực  thành công"
        }
        throw new BadRequestException("Hết hạn")
    }
}
