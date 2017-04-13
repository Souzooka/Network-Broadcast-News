const net = require('net');
const process = require('process');
const readline = require('readline');


const client = net.connect({port: 3113, host : '10.0.1.19'}, () => {
  // initial code
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  console.log('Successfully connected to server.\n');
});

// events
client.on('data', (data) => {
  process.stdout.write(`${data.toString()}`);
});

client.on('end', () => {
  console.log('disconnected from server');
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    client.write(chunk);
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);
    process.stdout.write(`Local user: ${chunk.toString()}`);
  }
});