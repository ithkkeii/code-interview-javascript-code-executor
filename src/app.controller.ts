import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, ms),
  );

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('javascript') // Our topic name
  async hi(@Payload() message) {
    console.log(message.value);
    await delay(5000);
    return 'Hello World';
  }
}
