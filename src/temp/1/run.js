/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('child_process');
const { readFile } = require('fs/promises');
const chai = require('chai');
const redis = require('redis');
const io = require('socket.io-client');
const axios = require('axios');

const connectSocketIOAsync = (io) => {
  const socket = io('http://localhost:3002');

  return new Promise((resolve, reject) => {
    socket.on('connect', () => resolve(socket));

    socket.on('error', () => reject());
  });
};

const forkCompute = (input, user, socket) =>
  new Promise(async (resolve, reject) => {
    const compute = fork(`${__dirname}/file.js`);

    compute.send(input);

    compute.on('message', (message) => {
      socket.emit('code-execute-result', JSON.stringify([user, message]));
      resolve(message);
      return;
    });
  });

const run = async () => {
  const user = 'user-123';

  let socket = null;

  try {
    socket = await connectSocketIOAsync(io);
  } catch (error) {
    console.log(error);
  }

  // const client = redis.createClient({
  //   url: `redis://${process.env.REDIS_HOST}:6380`,
  // });

  // client.on('error', (error) => console.log(error));

  try {
    const response = await axios.get(`http://localhost:3002/ping`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }

  const fileContent = await readFile('user-code/input.txt');
  const assertContent = await readFile('user-code/assert.txt');

  const asserts = assertContent.toString().split('\n');
  const inputs = fileContent.toString().split('\n');

  let resultPromise = inputs.map((input) => {
    return forkCompute(input, user, socket);
  });

  const result = await Promise.all(resultPromise);

  const x = result.map((r, index) => {
    const assert = chai.assert;

    const assertFnc = new Function(`return ${asserts[index]}`)();

    try {
      assertFnc(assert, r);
      return { state: true };
    } catch (error) {
      const { actual, expected } = error;
      return { state: false, reason: { actual, expected } };
    }
  });

  // x.forEach((r) => socket.emit(user, JSON.stringify(r)));
  result.forEach((r) => console.log(JSON.stringify(r)));
};

run();
