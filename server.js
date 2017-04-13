/*jshint esversion: 6 */
const net = require('net');
const readline = require('readline');

const users = [];
const connections = [];

const colors = {
  HEADER : '\033[95m',
  OKBLUE : '\033[94m',
  OKGREEN : '\033[92m',
  WARNING : '\033[93m',
  FAIL : '\033[91m',
  ENDC : '\033[0m',
  BOLD : '\033[1m',
  UNDERLINE : '\033[4m'
};

const greeting =
  `You find yourself connected to...\n
  ${colors.HEADER}.__________________________________________________________________.
  |    _   _            _             ____                           |
  |   | | | | __ _  ___| | _____ _ __/ ___| _ __   __ _  ___ ___     |
  |   | |_| |/ _\` |/ __| |/ / _ \\\ \'__\\\___ \\\| \'_ \\\ / _\` |/ __/ _ \\\    |
  |   |  _  | (_| | (__|   <  __/ |   ___) | |_) | (_| | (__| __/    |
  |   |_| |_|\\\__,_|\\\___|_|\\\_\\\___|_|  |____/| .__/ \\\__,_|\\\___\\\___|    |
  |                                        |_|                       |
  |__________________________________________________________________|
  |__________________________________________________________________|${colors.ENDC}
  Hosted at whatever arbitrary location the admin chooses.\n\n`;

const server = net.createServer((c) => {

  function getUserIndex() { return connections.indexOf(c); }

  function generateName() { return `anon${(Math.floor(Math.random() * 1e+10))}`; }

  function greetUser() {
    let tempName = generateName();
    c.write(greeting);
    c.write('\033[93mYour current name is: ' + tempName + '\033[0m\n');
    c.write('Use "/name <name>" to rename yourself.\n');
    c.write('Or type /help to get a list of all commands!\n\n');
    connections[getUserIndex()].username = tempName;

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

  // events
  c.on('data', (data) => {
    process.stdout.write(`${connections[getUserIndex()].username}: ${data.toString()}`);
    for (let i = 0; i < connections.length; ++i) {
      connections[i].write(`${connections[getUserIndex()].username}: ${data}`);
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
    process.stdout.write(`${connections[getUserIndex()].username} has disconnected.\n`);
    for (let i = 0; i < connections.length; ++i) {
      if (connections[i] !== c) {
        connections[i].write(`${connections[getUserIndex()].username} has disconnected.\n`);
      }
    }

    connections.splice(getUserIndex(), 1);
  });

});

// listen on port 3113
server.listen(3113, () => {
  console.log('Server successfully started.');
});