const net = require('net');
const client = net.connect({port: 3113}, 'localhost', () => {
  // initial code
  console.log('Successfully connected to server.\n');
});

// events
client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('disconnected from server');
});