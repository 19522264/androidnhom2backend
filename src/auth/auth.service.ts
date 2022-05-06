import { BadRequestException, Body, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Userdto } from 'src/user/dto/user.dto';
@Injectable()
export class AuthService {
    constructor(private prismaService : PrismaService){}
    async registerUser(userdto: Userdto) {
        const user = await this.prismaService.users.findFirst({where: { email: userdto.email }})
        //console.log((await user).email)
        if (user){
            throw new BadRequestException('user existed')
        }
        return await this.prismaService.users.create({data: 
        {
            email: userdto.email,
            password: userdto.password
        }})
    }
    async findUser(Email: string) {
        return await this.prismaService.users.findFirst({where: {
            email: Email
        }})
    }
}
