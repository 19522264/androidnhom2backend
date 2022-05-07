import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Userdto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prismaService : PrismaService){}

    async getUserInfo(email : string){
        return await this.prismaService.users.findFirst({where: {email: email}})
    }
    async createUser(userdto: Userdto){
        return await this.prismaService.users.create({data:
            {
                password: userdto.password,
                email: userdto.email
            }
        })
        
    }
}
