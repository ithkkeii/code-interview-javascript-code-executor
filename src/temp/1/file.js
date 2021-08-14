/* eslint-disable @typescript-eslint/no-var-requires */
const { readFile } = require('fs/promises');
const { isPrime } = require('./is-prime');

process.on('message', (inputs) => {
  const sum = (arr) => {
    return arr.reduce((a, b) => a + b, 1);
  };

  const result = sum(JSON.parse(inputs));

  process.send(result);

  process.exit();
});
