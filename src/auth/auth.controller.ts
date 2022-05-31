import { BadRequestException, Controller, Get, Header, Headers, Param, Res } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Userdto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService,
        private userService: UserService
        ){}
    @Post("register")
    async register(
        @Body("email") email: string,
        @Body("password") password: string){
            const hashedPassword =  bcrypt.hashSync(password, 12);
            const user = await this.authService.registerUser(new Userdto(email, hashedPassword))
            if (!user){
                throw new BadRequestException("user existed")
            }
            const jwt = this.jwtService.signAsync(user);
            return jwt
    }
    @Post("login")
    async login(
        @Body("email") email: string,
        @Body("password") password: string,
        @Res({passthrough: true}) response: Response
        ){
            const user = await this.authService.findUser(email)
            if (!user){
                throw new BadRequestException("invalid user")
            }
            if (!await bcrypt.compare(password, user.password)){
                throw new BadRequestException("invalid user")
            }
            const jwt = this.jwtService.signAsync(user)
            return jwt
    }
    @Get("getwhenrestartapp")
    async getwhenrestartapp(
        @Headers("Authorization") auth : string,
        @Headers("email") email: string
    ){
        return await this.userService.getUserInfo(email)
    }
    @Get("confirm/:email/:token")
    async confirmToken(
        @Param("email") email : string,
        @Param("token") token : string
    ){
        return await this.authService.conFirmUser(email, token)
    }
    @Get("accountstatus/:email")
    async getAccountStatus(
        @Param("email") email : string
    ){
        const user = await this.authService.findUser(email)
        if (user.confirm !== "confirmed") return "not confirmed"
        return user.confirm
    }
    @Post('forgotpass')
    async forgotPassword(
        @Body('email') email : string
    ){
        return await this.authService.resetPasswordEmail(email)
    }
    @Post('checkotp')
    async checkotp(
        @Body('otp') opt : string,
        @Body('email') email : string
    ){
        return await this.authService.checkOtp(opt, email)
    }
    @Post('resetpassword')
    async resetPassword(
        @Body('email') email : string,
        @Body('password') password : string
    ){
        const hashedPassword =  bcrypt.hashSync(password, 12);
        return await this.authService.resetPassword(email, hashedPassword)
    }
}
