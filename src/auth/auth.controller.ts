import { BadRequestException, Controller, Res } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Userdto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
        ){}
    @Post("register")
    async register(
        @Body("email") email: string,
        @Body("password") password: string){
            const hashedPassword =  bcrypt.hashSync(password, 12);
            return this.authService.registerUser(new Userdto(email, hashedPassword))
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
            
            //response.cookie('jwt' , jwt, {httpOnly: true})
            return jwt
        }
}
