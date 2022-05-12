import { BadRequestException, Body, Controller, Get, Head, Header, Headers, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Userdto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get(":email")
    async getUser(
        @Param("email") email : string,
        @Res({passthrough: true}) response : Response
    ) : Promise<any> {
        const userinfo = await this.userService.getUserInfo(email);
        if (!userinfo) {
           throw new BadRequestException("userinfo not found")
        }
        return userinfo
    }
    @Post()
    async createUserInfo(
        @Body("email") email : string,
        @Body("displayName") displayName : string,
        @Body("photoURL") photoURL: string
    ) {
        return await this.userService.createUser(email, displayName, photoURL)
    }
    @Get('search/:email/:keyword')
    async Search(
        @Param("email") email : string,
        @Param("keyword") keyword : string,
    ){
        return await this.userService.searchUsers(keyword, email)
    }
    @Get('myfriends/:email')
    async getListFriends(
        @Headers("email") email : string
    ) {
        const result = await this.userService.getListFriends(email)
        if (!result){
            throw new BadRequestException("user not have friends")
        }
        return result
    }
    @Get('sendings')
    async getSendings(
        @Headers("email") email : string
    ) {
        const result = await this.userService.getSendings(email)
        if (!result){
            throw new BadRequestException("user not have sendings")
        }
        return result
    }
    @Get('recevied')
    async getReceived(
        @Headers("email") email : string
    ) {
        const result = await this.userService.getReceived(email)
        if (!result){
            throw new BadRequestException("user not have received")
        }
        return result
    }
    @Post('sendingrequest')
    async createSending(
        @Headers("email") email : string,
        @Body("fremail") fremail : string
    ){
        return await this.userService.createSendings(email, fremail)
    }
    @Get('all')
    async getAllUser(
        @Headers("email") email : string,
    ){
        return await this.userService.getAllUsers(email)
    }
    @Post('revokerequest')
    async revokerequest(
        @Headers("email") email : string,
        @Body("fremail") fremail : string
    ) {
        return await this.userService.revokerequest(email, fremail)
    }
    @Get('getuserbio/:email/:fremail') 
    async getUserBio (
        @Param("email") email : string,
        @Param("fremail") fremail : string
    ){
        const result1 = await this.userService.getUserBio(fremail);
        const result2 = await this.userService.checkListFriends(email, fremail)
        if (result1) {
                return {
                    ...result1,
                    checked: result2.listfriends.indexOf(fremail)
                }
        }
        else {
            throw new BadRequestException("user bio")
        }
    }
}
