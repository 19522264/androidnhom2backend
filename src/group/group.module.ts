import { AzureStorageModule, AzureStorageService } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName : process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'image'
    })
  ],
  controllers: [GroupController],
  providers: [GroupService, AzureStorageService]
})
export class GroupModule {}
