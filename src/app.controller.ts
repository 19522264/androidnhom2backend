import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService){}
  @Get()
  gethello(){
      return "Henoa"
  }
  @Get('school')
  async getSchool(){
    return await this.prismaService.school.findMany({select: {label: true, value: true}})
  }
}
