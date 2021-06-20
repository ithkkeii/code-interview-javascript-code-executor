import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { exec } from 'child_process';
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
    const name = Date.now();
    const memory = '100m';
    const cpus = '0.01';
    const volume = `${__dirname}/temp/${1}:/user-code`;
    const statement = `docker run --name ${name} --memory='${memory}' --cpus='${cpus}' --rm -v ${volume} javascript:latest node user-code/run.js`;

    const child = exec(statement);
    child.stderr.on('data', (data) => {
      `child err: ${console.log(data)}`;
    });
    child.stdout.on('data', (data) => {
      // console.log('data', data);
    });

    return 'Hello World';
  }
}
