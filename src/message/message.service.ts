import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService) {}
    async getLastestMessages(email : string){
        const mess = await this.prismaService.lastestmessage.findMany({
            where: {
                participants: {
                    has: email
                }
            },
            orderBy:{
                createAt: 'desc'
            }
        })
        let result = []
        for (const index of mess){
            const fremail = index.participants.find((e) => e !== email)
            const res = await this.prismaService.userprofile.findUnique({
                where: {
                    email: fremail
                },
                select:{
                    photoURL: true,
                    displayName: true
                }
            })
            result.push({
                ...index,
                partnerPhotoURL: res.photoURL,
                partnerName: res.displayName
            })
        }
        return result
    }
    async getMess(email: string){
        return await this.prismaService.messages.findMany({
            where:{
                participants: {
                    has: email
                }
            },
            orderBy: {
                createAt: 'desc'
            }
        })
    }
}
