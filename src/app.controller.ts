import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { AppService } from './app.service';

// ? Split this interface properly
interface DeliveryContent {
  user: {
    id: number;
  };
  userListeningChannel: string;
  testInputs: string[];
  testAssertions: string[];
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('javascript') // Our topic name
  async hi(@Payload() message) {
    const deliveryContent: DeliveryContent = message.value;

    // Using challenge unique identifier
    const inputData = deliveryContent.testInputs;
    const assertionData = deliveryContent.testAssertions;

    const transformedInputData = inputData.join('\n');
    const transformedAssertData = assertionData.join('\n');

    // Container name
    const name = Date.now();
    // Provided memory scale at mega bytes
    const memory = '100m';
    // Provided cpu 1 = 100% = 1 core
    const cpus = '0.1';
    // Bind volume
    // const volume = `"$(pwd)"/temp/${1}:/user-code`;
    const folderPath =
      '/home/kei/data/project/code-interview/javascript-code-executor';
    const volume = `${folderPath}/src/temp/1:/user-code`;
    const volume2 = `${folderPath}/src/temp/node_modules:/user-code/node_modules`;

    // Unique channel that user is listening
    const uniqueChannel = `UNIQUE_CHANNEL=${deliveryContent.userListeningChannel}`;
    console.log(uniqueChannel);

    // Docker run statement
    const statement = `docker run --name ${name} --memory='${memory}' --cpus='${cpus}' --rm -e ${uniqueChannel} -v ${volume} -v ${volume2} --network=host javascript:latest node user-code/run.js`;

    await writeFile(`src/temp/1/input.txt`, transformedInputData);
    await writeFile(`src/temp/1/assert.txt`, transformedAssertData);

    const child = exec(statement);
    child.stderr.on('data', (data) => {
      `child err: ${console.log(data)}`;
    });
    child.stdout.on('data', (data) => {
      console.log('data', data);
    });

    return 'Hello World';
  }
}
