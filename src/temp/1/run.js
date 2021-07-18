/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('child_process');
const { readFile } = require('fs/promises');
const chai = require('chai');

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

  const x = result.map((r, index) => {
    const assert = chai.assert;

    const assertFnc = new Function(`return ${asserts[index]}`)();

    try {
      assertFnc(assert, r);
      return true;
    } catch (error) {
      const { actual, expected } = error;
      return false;
    }
  });

  console.log(x);
};

run();
