/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('child_process');
const { readFile } = require('fs/promises');

const forkCompute = (input) =>
  new Promise(async (resolve, reject) => {
    const compute = fork(`${__dirname}/file.js`);

    compute.send(input);

    compute.on('message', (message) => {
      resolve(message);
      return;
    });
  });

const run = async () => {
  const fileContent = await readFile('user-code/input.txt');
  const assertContent = await readFile('user-code/assert.txt');

  const asserts = assertContent.toString().split('\n');
  const inputs = fileContent.toString().split('\n');

  let resultPromise = inputs.map((input) => {
    return forkCompute(input);
  });

  const result = await Promise.all(resultPromise);

  result.map((r, index) => {
    const getFnc = new Function(`return ${asserts[index]}`);

    try {
      console.log(getFnc);
      getFnc(r);
    } catch (error) {
      console.log(error);
    }
  });
};

run();
