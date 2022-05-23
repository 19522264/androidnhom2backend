import { AzureStorageFileInterceptor, AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { Body, Controller, Get, Header, Headers, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { get } from 'http';
import { JwtGuard } from 'src/auth/guard';
import { MessageService } from './message.service';

@Controller('message')
@UseGuards(JwtGuard)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly azureService: AzureStorageService
    ) {}
    @Get('lastmessages')
    async getMessages(
        @Headers("email") email : string
    ){
        return await this.messageService.getLastestMessages(email)
    }
    @Get('getmess/:email/:fremail')
    async getMyMess(
        @Param("email") email : string,
        @Param("fremail") fremail : string
    ){
        return await this.messageService.getMess(email, fremail)
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
    @Post('sendimagemess')
    @UseInterceptors(
        AzureStorageFileInterceptor('image', null, {
            containerName: 'image'
        })
    )
    async sendImgMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body("data") data: string
    ){
        const dataparsed = JSON.parse(data)
        const name = dataparsed.sentBy > dataparsed.sendTo ? dataparsed.sentBy + dataparsed.sendTo : dataparsed.sendTo + dataparsed.sentBy
        file = {
            ...file,
            originalname: `${name + new Date()}.jpg`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'image'
        })
        return await this.messageService.sendImgMess(dataparsed.participants, dataparsed.createdAt, dataparsed.sentBy, dataparsed.sendTo, url, dataparsed.type)
    }
    @Post('sendvideomess')
    @UseInterceptors(
        AzureStorageFileInterceptor('video', null, {
            containerName: 'videos'
        })
    )
    async sendVideoMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body("data") data: string
    ){
        const dataparsed = JSON.parse(data)
        const name = dataparsed.sentBy > dataparsed.sendTo ? dataparsed.sentBy + dataparsed.sendTo : dataparsed.sendTo + dataparsed.sentBy
        file = {
            ...file,
            originalname: `${name + new Date()}.mp4`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'videos'
        })
        return await this.messageService.sendvideomess(dataparsed.participants, dataparsed.createdAt, dataparsed.sentBy, dataparsed.sendTo, url, dataparsed.type)
    }
    @Post('senddocmess')
    @UseInterceptors(
        AzureStorageFileInterceptor('file', null, {
            containerName: 'attachment'
        })
    )
    async sendDocMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body("data") data: string
    ){
        console.log(file)
        const dataparsed = JSON.parse(data)
        const name = dataparsed.sentBy > dataparsed.sendTo ? dataparsed.sentBy + dataparsed.sendTo : dataparsed.sendTo + dataparsed.sentBy
        file = {
            ...file,
            originalname: `${dataparsed.attachmentname + new Date()}`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'attachment',
        })
        return await this.messageService.sendDocMess(dataparsed.participants, dataparsed.createdAt, dataparsed.sentBy, dataparsed.sendTo, url, dataparsed.type, dataparsed.attachmentname)
    }
    @Post('sendaudiomess')
    @UseInterceptors(
        AzureStorageFileInterceptor('audio', null, {
            containerName: 'audio'
        })
    )
    async sendaudioMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body("data") data: string
    ){
        console.log(file)
        const dataparsed = JSON.parse(data)
        const name = dataparsed.sentBy > dataparsed.sendTo ? dataparsed.sentBy + dataparsed.sendTo : dataparsed.sendTo + dataparsed.sentBy
        file = {
            ...file,
            originalname: `${dataparsed.attachmentname + new Date()}`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'audio',
        })
        return await this.messageService.sendAudioMess(dataparsed.participants, dataparsed.createdAt, dataparsed.sentBy, dataparsed.sendTo, url, dataparsed.type)
    }
}
