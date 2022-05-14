import { BadRequestException, Body, Controller, Get, Head, Header, Headers, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Userdto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
        @Param("email") email : string
    ) {
        const result = await this.userService.getListFriends(email)
        if (!result){
            throw new BadRequestException("user not have friends")
        }
        return result
    }
    @Get('sendings/:email')
    async getSendings(
        @Param("email") email : string
    ) {
        const result = await this.userService.getSendings(email)
        if (!result){
            throw new BadRequestException("user not have sendings")
        }
        return result
    }
    @Get('recevied/:email')
    async getReceived(
        @Param("email") email : string
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
    @Get('all/:email')
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
    @Post('denyrequest')
    async denyrequest(
        @Headers("email") email : string,
        @Body("fremail") fremail : string
    ) {
        return await this.userService.revokerequest(fremail, email)
    }
    @Get('getuserbio/:email/:fremail') 
    async getUserBio (
        @Param("email") email : string,
        @Param("fremail") fremail : string
    ){
        const result1 = await this.userService.getUserBio(fremail);
        const result2 = await this.userService.checkListFriends(email, fremail)
        const result3 = await this.userService.checkSendingRequest(email, fremail)
        const result4 = await this.userService.checkReceivedRequest(email)
        let status = "none"
        if (result2){
            if (result2.listfriends.indexOf(fremail) >= 0){
                status = "friend"
            }
        }
        else if (result3) {
            if (result3.sendingRequests.indexOf(fremail) >= 0){
                status = "sending"
            }
        }
        else if (result4) {
            if (result4.receivedRequest.indexOf(fremail) >= 0){
                status = "recevied"
            } 
        }

        if (result1) {
                return {
                    ...result1,
                    biostatus : "yes",
                    checked: status
                }
        }
        return {
            biostatus : "no",
            checked: status
        }
    }
    @Post("postavatar")
    @UseInterceptors(FileInterceptor('image'))
    async setUserBio(
        @UploadedFile() file : any, @Body() body : any
    ){
        console.log(file);
        console.log(body)
    } 
    @Post("acceptrequest")
    async acceptRequest(
        @Headers("email") email : string,
        @Body("fremail") fremail : string
    ) {
        return await this.userService.acceptRequest(email, fremail)
    }
}
