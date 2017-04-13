/*jshint esversion: 6 */
const net = require('net');
const readline = require('readline');

const connections = [];

const colors = {
  HEADER    :   '\033[95m',
  OKBLUE    :   '\033[94m',
  OKGREEN   :   '\033[92m',
  WARNING   :   '\033[93m',
  FAIL      :   '\033[91m',
  ENDC      :   '\033[0m',
  BOLD      :   '\033[1m',
  UNDERLINE :   '\033[4m'
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
    const connectionMsg = `${colors.OKGREEN}${tempName} has connected.${colors.ENDC}\n`;
    c.write(greeting);
    c.write(`${colors.WARNING}Your current name is: ${tempName}${colors.ENDC}\n`);
    c.write('Use "/name <name>" to rename yourself.\n');
    c.write('Or type /help to get a list of all commands!\n\n');
    connections[getUserIndex()].username = tempName;


    process.stdout.write(connectionMsg);
    for (let i = 0; i < connections.length; ++i) {
      if (connections[i] !== c) {
        connections[i].write(connectionMsg);
      }
    }
  }

  function addConnection() {
    connections.push(c);
  }

  function disconnectUser() {
    const disconnectionMsg = `${colors.FAIL}${connections[getUserIndex()].username} has disconnected.${colors.ENDC}\n`;
    process.stdout.write(disconnectionMsg);
    for (let i = 0; i < connections.length; ++i) {
      if (connections[i] !== c) {
        connections[i].write(disconnectionMsg);
      }
    }
    connections.splice(getUserIndex(), 1);
  }

  function printText() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      for (let i = 0; i < connections.length; ++i) {
        connections[i].write(`[ADMIN]: ${chunk}`);
      }
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearScreenDown(process.stdout);
      process.stdout.write(`[ADMIN]: ${chunk.toString()}`);
    }
  }

  function printData(data) {
    process.stdout.write(`${connections[getUserIndex()].username}: ${data.toString()}`);
    for (let i = 0; i < connections.length; ++i) {
      connections[i].write(`${connections[getUserIndex()].username}: ${data}`);
    }
  }

  function changeUserName(commandArgs) {
    if (!commandArgs[1]) {
      c.write(`${colors.WARNING}Usage: /name <name>${colors.ENDC}\n`);
      return -1;
    }
    if ( !(2 <= commandArgs[1].length <= 32) ) {
      c.write(`${colors.FAIL}Names must be between 2 and 32 characters in length.${colors.ENDC}\n`);
      return -1;
    }
    var unique = true;
      for (let i = 0; i < connections.length; ++i) {
        if (connections[i].username === commandArgs[1] || commandArgs[1].search(/(admin)/gi) !== -1) {
          unique = false;
          break;
        }
      }
    if (unique) {
      let nameChangeMsg = `${colors.OKBLUE}${connections[getUserIndex()].username}
                            has changed name to ${commandArgs[1]}${colors.ENDC}`;
      process.stdout.write(nameChangeMsg);
      for (let i = 0; i < connections.length; ++i) {
        if (connections[i] !== c) {
          connections[i].write(nameChangeMsg);
        }
      }
      c.write(`${colors.OKBLUE}Name successfully changed to ${commandArgs[1]}${colors.ENDC}\n`);
      connections[getUserIndex()].username = commandArgs[1];
    } else {
      c.write(`${colors.FAIL}Name is already taken.${colors.ENDC}\n`);
    }
  }

  function processCommand(chunk) {
    let commandArgs = chunk.toString().split(' ');
    console.log(commandArgs[0])
    switch (commandArgs[0]) {
      case '/name':
        changeUserName(commandArgs);
        break;
      default:
        c.write(`${colors.FAIL}${commandArgs[0]} is not a valid command.${colors.ENDC}\n`);
    }
  }

  addConnection();
  greetUser();

  // events
  c.on('data', (data) => {
    if (data.indexOf('/') === 0) {
      processCommand(data);
    } else {
      printData(data);
    }
  });

  process.stdin.on('readable', () => {
    printText();
  });

  c.on('end', () => {
    disconnectUser();
  });

});

// listen on port 3113
server.listen(3113, () => {
  console.log('Server successfully started.');
});