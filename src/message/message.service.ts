import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService) {}
    async getLastestMessages(email : string){
        return await this.prismaService.lastestmessage.findMany({
            where: {
                participants: {
                    has: email
                }
            }
        })
    }
}
