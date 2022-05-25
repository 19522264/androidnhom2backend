import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
    constructor(private readonly prismaService: PrismaService){}
    
    async createGroupInfo(data : string, url : string) {
        const parsed = JSON.parse(data)
        parsed.participants.push(parsed.email)
        const arr = parsed.participants.sort().reverse()
        const result = await this.prismaService.groupinfo.create({
            data: {
                photoURL: url,
                participants: parsed.participants,
                groupname: parsed.displayName
            }
        })

        const result2 = await this.prismaService.groupmessages.create({
            data: {
                groupid: result.docid,
                createdAt: new Date(),
                system: true,
                text: "Các bạn hiện đang kết nối trên Exping"
            }
        })
        const result3 = await this.prismaService.groupmessages.create({
            data: {
                groupid: result.docid,
                createdAt: new Date(),
                system: true,
                text: "Các bạn hiện đang kết nối trên Exping"
            }
        })
        if (result && result2 && result3){
            return "created"
        }
        return "fail"
    }
    async getAllMess(email : string){
        const result = await this.prismaService.groupinfo.findMany({
            where:{ 
                participants : {
                    has: email
                }
            }
        })
        let messages = []
        if (result.length > 0) {
            for(const index of result){
                const mess = await this.prismaService.groupmessages.findFirst({
                    where:{
                        groupid: index.docid
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
                let sender = {
                    displayName: "system"
                }
                if (mess && !mess.system){
                    sender = await this.prismaService.userprofile.findUnique({
                        where: {
                            email: mess.sentBy
                        }
                    })
                } 
                console.log(sender)
                messages.push({
                    ...mess,
                    ...sender
                })
                
            }
        }
        return messages
    }
}
