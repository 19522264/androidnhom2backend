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
            //console.log(users)
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
            //console.log(users)
        }
        if (users.length !== 0) return users
        return null
    }
    async createSendings(email: string, fremail: string){
        const find = await this.prismaService.userSendingRequest.findUnique({where: {email: email}})
        const find1 = await this.prismaService.userreceivedRequest.findUnique({where: {email: fremail}})
        let status = ""
        if (find) {
            if (find.sendingRequests.indexOf(fremail) < 0) {
                const update = await this.prismaService.userSendingRequest.update({where: {email: email}, 
                    data:{
                        sendingRequests: {push : fremail}
                    }})
                if (update) status = "sending your request"
                status =  "fail"
           }
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
            if (find1.receivedRequest.indexOf(email) < 0) {
                const update = await this.prismaService.userreceivedRequest.update({where: {email: fremail}, data: {
                    receivedRequest: {push: email}
                }})
                if (update) status = "sending your request"
                else status =  "fail"
            }
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
        const sending = await this.prismaService.userSendingRequest.findUnique({where: {email: email}})
        const receiving = await this.prismaService.userreceivedRequest.findUnique({where: {email: fremail}})
        console.log(sending) 
        console.log(receiving)
        let return_ = "begin"
        if (sending) {
            const result = await this.prismaService.userSendingRequest.update({ where: {email: email}, data: {
                sendingRequests: sending.sendingRequests.filter((e) => e !== fremail)
            }})
            return_ = "checkpoint 1"
        }
        if (receiving) {
            const result = await this.prismaService.userreceivedRequest.update({where: {email: fremail}, data:{
                receivedRequest: receiving.receivedRequest.filter((e) => e !== email)
            }})
            return_ = "checkpoint 2"
        }
        return return_
    }
    async getUserBio(femail: string){
        return await this.prismaService.userbio.findFirst({where: {email: femail}})
    }
    async checkListFriends(email: string, fremail: string) {
        return await this.prismaService.userlistfriends.findFirst({
            where: {
                email: email, 
                listfriends: {
                    has: fremail
                }
            }
        })
    }
    async checkSendingRequest(email :string, femail: string){
        return await this.prismaService.userSendingRequest.findFirst({
            where: {
                email: email,
                sendingRequests: {
                    has: femail
                }
            }
        })
    }
    async checkReceivedRequest(email: string, femail: string) {
        return await this.prismaService.userreceivedRequest.findFirst({
            where: {
                email: email,
                receivedRequest: {
                    has: femail
                }
            }
        })
    }
    async CreateNewListFriend(email : string, fremail : string) {
        return await this.prismaService.userlistfriends.create({data: {email: email, listfriends: fremail}})
    }
    async AddIntoListFriend(email: string, fremail: string){
        const check = await this.prismaService.userlistfriends.findFirst({where: {email: email}})
        if (check.listfriends.indexOf(fremail) < 0)
            return await this.prismaService.userlistfriends.update({where: {email: email}, data: {listfriends: {push: fremail}}})
        return null
    }
    async acceptRequest(email: string, fremail: string){
        const revoke  = await this.revokerequest(fremail, email)
        if (revoke === "checkpoint 2"){
            const result1 = await this.prismaService.userlistfriends.findUnique({where: {email: email}})
            const result2 = await this.prismaService.userlistfriends.findUnique({where: {email : fremail}})
            let result3 = null
            let result4 = null
            if (!result1){
                result3 = await this.CreateNewListFriend(email, fremail);
            }
            else{
                result3 = await this.AddIntoListFriend(email, fremail);
            }
            if (!result2){
                result4 = await this.CreateNewListFriend(fremail, email);
            }
            else{
                result4 = await this.AddIntoListFriend(fremail, email);
            }
            if (result4 && result3){
                const arr = [email, fremail]
                const time = new Date()
                await this.prismaService.lastestmessage.create({
                    data: {
                        participants: arr,
                        text: "Các bạn đang kết nối trên Exping",
                        system: true,
                        sentBy: "system",
                        createAt: time
                    }
                })
                await this.prismaService.messages.create({
                    data:{
                        id: "-1",
                        participants: arr,
                        text: "Các bạn đang kết nối trên Exping",
                        system: true,
                        sentBy: "system",
                        createAt: time,
                    }
                })
                return "OK"
            }
            return "try again"
        }
        return "try again"
    }
    async getMyBio(email: string){
        const user = await this.prismaService.userbio.findUnique({where: {email: email}})
        if (user) return user
        return "none"
    }
    async updateMyBio(email : string, intro : string, school : string, from : string, gender : string, birthDay  : Date){
        const find = await this.prismaService.userbio.findUnique({
            where: {
                email: email
            }
        })
        if (find){
            const result = await this.prismaService.userbio.update({
                where: {email: email}, data: {
                    intro: intro,
                    from: from,
                    gender: gender,
                    birthDay: birthDay,
                    school: school
                }})
            return "ok"
        }
        else {
            const result = await this.prismaService.userbio.create({
                data:{
                    email: email,
                    from: from,
                    gender: gender,
                    birthDay: birthDay,
                    school: school
                }
            })
            return "ok"
        }
        return "error"
    }
    async getAllFriends(email: string){
        const result = await this.prismaService.userlistfriends.findUnique({
            where: {
                email: email
            },
            select: {
                listfriends: true
            }
        })
        let users = []
        if (result) {
            if (result.listfriends.length > 0){
                for (const index of result.listfriends){
                    const user = await this.prismaService.userprofile.findUnique({
                        where: {
                            email: index
                        }
                    })
                    users.push(user)
                }
            }
        }
        return users
    }
    async  getBarBadge(email : string){
        const friends = await this.prismaService.userlistfriends.findUnique({
            where: {
                email: email
            }
        })
        const sendings = await this.prismaService.userSendingRequest.findUnique({
            where: {
                email: email
            }
        })
        const received = await this.prismaService.userreceivedRequest.findUnique({
            where: {
                email
            }
        })
        let result = {
            sendings: 0,
            received: 0,
            friends: 0
        }
        if (friends) {
            result.friends = friends.listfriends.length
        }
        if (sendings) {
            result.sendings = sendings.sendingRequests.length
        }
        if (received){
            result.received = received.receivedRequest.length
        }
        return result
    }
}
