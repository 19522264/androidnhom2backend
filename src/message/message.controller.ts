import { Body, Controller, Get, Header, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { JwtGuard } from 'src/auth/guard';
import { MessageService } from './message.service';

@Controller('message')
@UseGuards(JwtGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
    @Get('lastmessages')
    async getMessages(
        @Headers("email") email : string
    ){
        return await this.messageService.getLastestMessages(email)
    }
    @Get('getmess/:email')
    async getMyMess(
        @Param("email") email : string
    ){
        return await this.messageService.getMess(email)
    }
    @Post('sendmessage')
    async sendMess(
        @Body("participants") participants : [],
        @Body("createdAt") createdAt : Date,
        @Body("sentBy") sentBy : string,
        @Body("sendTo") sendTo : string,
        @Body("text") text : string,
        @Body("type") type : string,
    ){
        return await this.messageService.sendMess(participants, createdAt, sentBy, sendTo, text, type)
    }
}
