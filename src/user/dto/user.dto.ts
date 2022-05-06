import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class Userdto{
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}