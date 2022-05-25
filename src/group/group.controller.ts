import { AzureStorageFileInterceptor, AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
}
