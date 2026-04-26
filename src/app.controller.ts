import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcomeMessage() {
    return {
      message: 'Welcome to BuildHut API! 🚀',
      status: 'success',
      version: '1.0.0',
      developer: 'FARHAN-NAEEM'
    };
  }
}