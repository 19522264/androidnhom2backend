import { AzureStorageModule, AzureStorageService } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports:[
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName : process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'image'
    })
  ],
  controllers: [MessageController],
  providers: [MessageService, AzureStorageService]
})
export class MessageModule {}
