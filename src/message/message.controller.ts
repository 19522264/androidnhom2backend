import { Controller, Get, Header, Headers, UseGuards } from '@nestjs/common';
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
}
