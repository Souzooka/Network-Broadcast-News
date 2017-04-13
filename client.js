const net = require('net');
const process = require('process');
const client = net.connect({port: 3113, host : '10.0.1.19'}, () => {
  // initial code
  console.log('Successfully connected to server.\n');
});

// events
client.on('data', (data) => {
  process.stdout.write(data.toString());
});

client.on('end', () => {
  console.log('disconnected from server');
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    client.write(chunk);
  }
});