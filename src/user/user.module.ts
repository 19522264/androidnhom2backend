import { AzureStorageModule, AzureStorageService } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports:[
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName : process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'avatar'
    })
  ],
  providers: [UserService, AzureStorageService],
  exports: [UserService, AzureStorageService],
})
export class UserModule {}
