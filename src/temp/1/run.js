/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('child_process');

const input = [1, 2, 3, 4, 5, 6, 7, 8];

const forkCompute = () =>
  new Promise((resolve, reject) => {
    const compute = fork(`${__dirname}/file.js`);

    compute.send('start');

    compute.on('message', (message) => {
      console.log(message);
      resolve(message);
      return;
    });
  });

const run = async () => {
  const x = input.map((i) => {
    return forkCompute();
  });

  await Promise.all(x);
};

run();
