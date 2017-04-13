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
  process.stdout.write('\033[1m\\ --------------- HELP --------------- \\\033[0m\n');
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
  process.stdout.write(`Disconnected from server.`);
}

function parseInput() {
  const chunk = process.stdin.read();
  if (chunk !== null) {

    // commands
    if (chunk.indexOf('/') === 0) {
      switch (chunk.toString().slice(1)) {
        case 'clear\n':
          clearScreen();
          break;
        case 'help\n':
          clearLine();
          printHelp();
          break;
        default:
        // possibly a server-side command
          console.log(chunk.slice(1))
          client.write(chunk);
      }
    // if not a command, send our data to server
    } else {
      client.write(chunk);
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearScreenDown(process.stdout);
    }
  }
}

const commands = ['/clear - clears the terminal window.\n',
                  '/help - prints a list of commands\n',
                  '/exit - disconnect from server\n',
                  '/name <name> - change your current name to <name>\n'];

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