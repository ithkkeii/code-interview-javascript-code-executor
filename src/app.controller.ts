import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('javascript') // Our topic name
  async hi(@Payload() message) {
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
    // Docker run statement
    const statement = `docker run --name ${name} --memory='${memory}' --cpus='${cpus}' --rm -v ${volume} -v ${volume2} --network=host javascript:latest node user-code/run.js`;

    // Using challenge unique identifier
    const inputData = [
      [1, 2, 3, 4],
      [1, 0, 0, 0, 1],
    ];
    const assertionData = [
      'function(assert, x) { return assert.equal(x, 10); }',
      'function(assert, x) { return assert.equal(x, 2); }',
    ];

    const transformedInputData = inputData
      .map((d) => JSON.stringify(d))
      .join('\n');

    const transformedAssertData = assertionData.join('\n');

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
