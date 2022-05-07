import { BadRequestException, Body, Controller, Get, Head, Param, Post, Res } from '@nestjs/common';
import { Userdto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
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
}
