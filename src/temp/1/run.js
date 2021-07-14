/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('child_process');
const { readFile } = require('fs/promises');

const forkCompute = (input) =>
  new Promise(async (resolve, reject) => {
    const compute = fork(`${__dirname}/file.js`);

    compute.send(input);

    compute.on('message', (message) => {
      console.log(message);
      resolve(message);
      return;
    });
  });

const run = async () => {
  const fileContent = await readFile('user-code/input.txt');
  const inputs = fileContent.toString().split('\n');

  const result = inputs.map((input) => {
    return forkCompute(input);
  });

  await Promise.all(result);
};

run();
