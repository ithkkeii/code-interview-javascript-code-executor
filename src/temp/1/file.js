// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isPrime } = require('./is-prime');

process.on('message', () => {
  const result = isPrime(Math.random() * 1000);
  process.send(result);

  process.exit();
});
