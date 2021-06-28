/* eslint-disable @typescript-eslint/no-var-requires */
const { readFile } = require('fs/promises');
const { isPrime } = require('./is-prime');

process.on('message', async () => {
  const buffer = await readFile('input.txt');

  process.send(buffer);

  // const result = isPrime(Math.random() * 1000);
  // process.send(result);

  process.exit();
});
