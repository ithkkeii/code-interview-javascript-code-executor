/* eslint-disable @typescript-eslint/no-var-requires */
const { readFile } = require('fs/promises');
const { isPrime } = require('./is-prime');

process.on('message', (input) => {
  // const total = JSON.parse(input).reduce((a, b) => a + b, 1);
  const total = 10;

  process.send(total);

  process.exit();
});
