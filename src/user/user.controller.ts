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
        return this.userService.createUser(email, displayName, photoURL)
    }
    @Get('search/:keyword')
    async Search(
        @Headers("email") email : string,
        @Param("keyword") keyword : string,
    ){
        return this.userService.searchUsers(keyword, email)
    }
    @Post('myfriends')
    async getListFriends(
        @Headers("email") email : string
    ) {
        const result = await this.userService.getListFriends(email)
        if (!result){
            throw new BadRequestException("user not have friends")
        }
        return result
    }
    @Post('sendings')
    async getSendings(
        @Headers("email") email : string
    ) {
        const result = await this.userService.getSendings(email)
        if (!result){
            throw new BadRequestException("user not have sendings")
        }
        return result
    }
    @Post('recevied')
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
        return this.userService.createSendings(email, fremail)
    }
}
