const net = require('net');
const readline = require('readline');

const users = [];
const connections = [];
const server = net.createServer((c) => {
  // initial code
  connections.push(c);
  c.write('You find yourself connected to...\n');
  c.write(
  '.__________________________________________________________________.\n'       +
  '|    _   _            _             ____                           |\n'               +
  '|   | | | | __ _  ___| | _____ _ __/ ___| _ __   __ _  ___ ___     |\n'               +
  '|   | |_| |/ _` |/ __| |/ / _ \\\ \'__\\\___ \\\| \'_ \\\ / _` |/ __/ _ \\\    |\n'   +
  '|   |  _  | (_| | (__|   <  __/ |   ___) | |_) | (_| | (__| __/    |\n'               +
  '|   |_| |_|\\\__,_|\\\___|_|\\\_\\\___|_|  |____/| .__/ \\\__,_|\\\___\\\___|    |\n' +
  '|                                        |_|                       |\n'               +
  '|__________________________________________________________________|\n');
  c.write('Hosted at whatever arbitrary location the admin chooses.\n\n');
  c.write('Chat:\n');

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
  });

});

// listen on port 3113

server.listen(3113, () => {
  console.log('Server successfully started.');
});