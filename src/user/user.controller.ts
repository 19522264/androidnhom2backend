import { Body, Controller, Get, Head, Param, Post } from '@nestjs/common';
import { Userdto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get(":email")
    async getUser(@Param("email") email : string){
        return this.userService.getUserInfo(email);
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
