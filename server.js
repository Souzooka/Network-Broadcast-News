/*jshint esversion: 6 */
const net = require('net');
const readline = require('readline');

const users = [];
const connections = [];

const greeting =
    'You find yourself connected to...\n'                                                  +
    '.__________________________________________________________________.\n'               +
    '|    _   _            _             ____                           |\n'               +
    '|   | | | | __ _  ___| | _____ _ __/ ___| _ __   __ _  ___ ___     |\n'               +
    '|   | |_| |/ _` |/ __| |/ / _ \\\ \'__\\\___ \\\| \'_ \\\ / _` |/ __/ _ \\\    |\n'   +
    '|   |  _  | (_| | (__|   <  __/ |   ___) | |_) | (_| | (__| __/    |\n'               +
    '|   |_| |_|\\\__,_|\\\___|_|\\\_\\\___|_|  |____/| .__/ \\\__,_|\\\___\\\___|    |\n' +
    '|                                        |_|                       |\n'               +
    '|__________________________________________________________________|\n'               +
    '|__________________________________________________________________|\n'               +
    'Hosted at whatever arbitrary location the admin chooses.\n\n'                         +
    'Please enter a name:\n\n';

const server = net.createServer((c) => {
  // initial code
  function greetUser() {
    let tempName = `user${(Math.floor(Math.random() * 100000))}`;


    c.write(greeting);

    process.stdout.write(`${tempName} has connected.\n`);
    for (let i = 0; i < connections.length; ++i) {
      if (connections[i] !== c) {
        connections[i].write(`${tempName} has connected.\n`);
      }
    }
  }

  function addConnection() {
    connections.push(c);
  }

  addConnection();
  greetUser();

  // c.write('Chat:\n\n');
  process.stdout.write(`Another user has connected.\n`);
  for (let i = 0; i < connections.length; ++i) {
    if (connections[i] !== c) {
      connections[i].write(`Another user has connected.\n`);
    }
  }

  // events
  c.on('data', (data) => {
    process.stdout.write(`User: ${data.toString()}`);
    for (let i = 0; i < connections.length; ++i) {
      if (connections[i] !== c) {
        connections[i].write(`User: ${data}`);
      }
    }
  });

  process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      for (let i = 0; i < connections.length; ++i) {
        connections[i].write(`[ADMIN]: ${chunk}`);
      }
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearScreenDown(process.stdout);
      process.stdout.write(`[ADMIN]: ${chunk.toString()}`);
    }
  });

  c.on('end', (data) => {
    const disconnectedIndex = connections.indexOf(c);
    connections.splice(disconnectedIndex, 1);

    process.stdout.write(`A user has disconnected.\n`);
    for (let i = 0; i < connections.length; ++i) {
      connections[i].write(`A user has disconnected.\n`);
    }
  });

});

// listen on port 3113

server.listen(3113, () => {
  console.log('Server successfully started.');
});