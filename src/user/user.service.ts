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
        let users = []
        const lists =  await this.prismaService.userSendingRequest.findUnique({
            where: {
                email : email
            },
            select: {
                sendingRequests: true
            }
        })
        if (lists) {
            for(const index of lists.sendingRequests){
                const user = await this.prismaService.userprofile.findUnique({
                    where: {
                        email: index
                    }
                })
                users.push(user)
            }
            console.log(users)
        }
        if (users.length !== 0) return users
        return null
    }
    async getReceived(email: string) {
        let users = []
        const lists =  await this.prismaService.userreceivedRequest.findUnique({
            where: {
                email : email
            },
            select: {
                receivedRequest: true
            }
        })
        if (lists) {
            for(const index of lists.receivedRequest){
                const user = await this.prismaService.userprofile.findUnique({
                    where: {
                        email: index
                    }
                })
                users.push(user)
            }
            console.log(users)
        }
        if (users.length !== 0) return users
        return null
    }
    async createSendings(email: string, fremail: string){
        const find = await this.prismaService.userSendingRequest.findUnique({where: {email: email}})
        const find1 = await this.prismaService.userreceivedRequest.findUnique({where: {email: fremail}})
        let status = ""
        if (find) {
            const update = await this.prismaService.userSendingRequest.update({where: {email: email}, 
                data:{
                    sendingRequests: {push : fremail}
            }})
            if (update) status = "sending your request"
            status =  "fail"
        }
        else {
            const create = await this.prismaService.userSendingRequest.create({data:{
                email: email,
                sendingRequests: fremail
            }})
            if (create) status =  "sending your request"
            else status = "fail"
        }
        if (find1){
            const update = await this.prismaService.userreceivedRequest.update({where: {email: fremail}, data: {
                receivedRequest: {push: email}
            }})
            if (update) status = "sending your request"
            else status =  "fail"
        }
        else {
            const create = await this.prismaService.userreceivedRequest.create({data: {
                email: fremail,
                receivedRequest: email
            }})
            if (create) status = "sending your request"
            else status = "fail"
        }
        return status
    }
    async getAllUsers(email: string) {
        return await this.prismaService.userprofile.findMany({where: {
            email: {not: email}
        }})
    }
    async revokerequest(email: string, fremail: string){
        const {sendingRequests} = await this.prismaService.userSendingRequest.findUnique({where: {email: email}, select: {sendingRequests: true}})
        const result = await this.prismaService.userSendingRequest.update({ where: {email: email}, data: {
            sendingRequests: sendingRequests.filter((e) => e !== fremail)
        }})
        return result
    }
    async getUserBio(femail: string){
        return await this.prismaService.userbio.findFirst({where: {email: femail}})
    }
    async checkListFriends(email: string, fremail: string) {
        return await this.prismaService.userlistfriends.findFirst({
            where: {
                email: email, 
            }
        })
    }
}
