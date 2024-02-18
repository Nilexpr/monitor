import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/block')
  getBlock() {
    return this.appService.getBlock();
  }

  @Get('/run')
  runChild() {
    return this.appService.runChild();
  }
}