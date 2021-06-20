const isPrime = number => {
  // let isPrime = true;

  // for (let i = 3; i < number; i++) {
  //   if (number % i === 0) {
  //     isPrime = false;
  //     break;
  //   }
  // }

  // return isPrime;

  let sum = 0;
  for (let i = 0; i < number; i++) {
    sum += i;
  }
  return sum;
};

module.exports = { isPrime };
