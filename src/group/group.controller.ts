import { AzureStorageFileInterceptor, AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { JwtGuard } from 'src/auth/guard';
import { GroupService } from './group.service';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly azureService: AzureStorageService
    ){}
    @Post('creategroupinfo')
    @UseInterceptors(
        AzureStorageFileInterceptor('avatar', null, {
            containerName: 'avatar'
        })
    )
    async uploadProfile(
        @UploadedFile() file : UploadedFileMetadata,
        @Body('data') data : string
    ){
        let url = "none"
        if (file) {
            file = {
                ...file,
                originalname: `group${nanoid()}.jpg`
            }
            url = await this.azureService.upload(file, {
                containerName: 'avatar'
            })
        }
        return await this.groupService.createGroupInfo(data, url)
    }
    @Get('getallmess/:email')
    async getAllMess(
        @Param('email') email : string
    ){
        return await this.groupService.getAllMess(email)
    }
    @Get('getmessages/:groupid')
    async getMessages(
        @Param('groupid') groupid : string
    ){
        return await this.groupService.getAllMessages(groupid)
    }
    @Post('sendgroupmess')
    async sendGroupMess(
        @Body('groupid') groupid : string,
        @Body('sentBy') sentBy : string,
        @Body('createdAt') createdAt : Date,
        @Body('text') text : string,
    ){
        return await this.groupService.sendGroupTextMss(groupid, sentBy, createdAt, text)
    }
    @Post('sendimgmess')
    @UseInterceptors(
        AzureStorageFileInterceptor('file', null, {
            containerName: 'image'
        })
    )
    async sendImgMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body('data') data : string
    ){
        let url = "none"
        if (file) {
            file = {
                ...file,
                originalname: `group${nanoid()}.jpg`
            }
            url = await this.azureService.upload(file, {
                containerName: 'image'
            })
        }
        return await this.groupService.sendImgMess(data, url)
    }
    
    @Post('sendvidmess')
    @UseInterceptors(
        AzureStorageFileInterceptor('file', null, {
            containerName: 'videos'
        })
    )
    async sendVidMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body('data') data : string
    ){
        let url = "none"
        if (file) {
            file = {
                ...file,
                originalname: `group${nanoid()}.jpg`
            }
            url = await this.azureService.upload(file, {
                containerName: 'videos'
            })
        }
        return await this.groupService.sendvidMess(data, url)
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

        file = {
            ...file,
            originalname: `group${nanoid()}`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'attachment',
        })
        return await this.groupService.sendDocMess(data, url)
    }
    @Post('sendaudiomess')
    @UseInterceptors(
        AzureStorageFileInterceptor('file', null, {
            containerName: 'audio'
        })
    )
    async sendaudioMess(
        @UploadedFile() file : UploadedFileMetadata,
        @Body("data") data: string
    ){
        
        file = {
            ...file,
            originalname: `group${nanoid()}`
        }
        const url = await this.azureService.upload(file, {
            containerName: 'audio',
        })
        return await this.groupService.sendAudioMess(data, url)
    }
    @Post('sendgifmessage')
    async sendGifMess(
        @Body("groupid") groupid : string,
        @Body("createdAt") createdAt : Date,
        @Body("sentBy") sentBy : string,
        @Body("gif") gif : string,
    ){
        return await this.groupService.sendgifMess(groupid, createdAt, sentBy, gif)
    }
    @Get('getlistmember/:list')
    async getListMember(
        @Param('list') list : string
    ) {
        return await this.groupService.getListMember(list)
    }
    @Get('getimagelist/:groupid')
    async getImageList(
        @Param('groupid') groupid : string
    ){
        return await this.groupService.getImageList(groupid)
    }
    @Get('getvideolist/:groupid')
    async getVidList(
        @Param('groupid') groupid : string
    ){
        return await this.groupService.getVidList(groupid)
    }
    @Get('getdoclist/:groupid')
    async getDoceList(
        @Param('groupid') groupid : string
    ){
        return await this.groupService.getDocList(groupid)
    }
}
