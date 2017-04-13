/*jshint esversion: 6 */
const net = require('net');
const process = require('process');
const readline = require('readline');

function clearScreen() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

function clearLine() {
  readline.moveCursor(process.stdout, 0, -1);
  readline.clearScreenDown(process.stdout);
}

function printHelp() {
  process.stdout.write(`\n${colors.BOLD}\\ --------------- HELP --------------- \\${colors.ENDC}\n`);
  for (let i in commands) {
    process.stdout.write(commands[i]);
  }
  process.stdout.write(`\n`);
}

function printData(data) {
  process.stdout.write(`${data.toString()}`);
}

function printConnect() {
  process.stdout.write(`Successfully connected to server.\n`);
}

function printDisconnect() {
  process.stdout.write(`Disconnected from server.\n`);
}

function parseInput() {
  let chunk = process.stdin.read();
  if (chunk !== null) {

    // commands
    if (chunk.indexOf('/') === 0) {
      clearLine();
      chunk = chunk.toString().slice(0, chunk.toString().length-1);
      let commandArgs = chunk.toString().split(' ');
      switch (commandArgs[0]) {
        case '/clear':
          clearScreen();
          break;
        case '/help':
          printHelp();
          break;
        case '/exit':
          client.end();
          break;
        default:
        // possibly a server-side command
          client.write(chunk);
      }
    // if not a command, send our data to server
    } else {
      clearLine();
      client.write(chunk);
    }
  }
}

const commands = ['/clear - clears the terminal window.\n',
                  '/help - prints a list of commands\n',
                  '/exit - disconnect from server\n',
                  '/name <name> - change your current name to <name>\n'];

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

const client = net.connect({port: 3113, host : '10.0.1.19'}, () => {
  // initial code
  clearScreen();
  printConnect();
});

// events
client.on('data', (data) => {
  printData(data);
});

client.on('end', () => {
  printDisconnect();
});

process.stdin.on('readable', () => {
  parseInput();
});