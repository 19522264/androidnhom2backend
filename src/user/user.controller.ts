import { Body, Controller, Get, Head, Param, Post } from '@nestjs/common';
import { Userdto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }
    @Post()
    getUser(
        @Body("email") email:  string
    ){
        return this.userService.getUserInfo(email)
    }
}
