import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Userdto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prismaService : PrismaService){}

    async getUserInfo(email : string){
        return await this.prismaService.userprofile.findFirst({where: {email: email}})
    }
    async createUser(email: string, displayName : string, photoURL : string){
        return await this.prismaService.userprofile.create({data:
            {
                email: email,
                displayName: displayName,
                photoURL: photoURL,
            }
        }) 
    }
    async searchUsers(keyword: string, email: string) {
        return await this.prismaService.userprofile.findMany({where: {
            OR: [
                {
                    email: {
                        contains: keyword
                    }
                },
                {
                    displayName: {
                        contains: keyword
                    }
                }
            ],
            AND: [
                {
                    email: {
                        not: email
                    }
                }
            ]
        }})
    }
    async getListFriends(email: string) {
        return await this.prismaService.userlistfriends.findUnique({
            where: {
                email: email
            }
        })
    }
    async getSendings(email: string) {
        return await this.prismaService.userSendingRequest.findUnique({
            where: {
                email : email
            }
        })
    }
    async getReceived(email: string) {
        return await this.prismaService.userreceivedRequest.findUnique({
            where: {
                email : email
            }
        })
    }
}
