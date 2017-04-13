const net = require('net');
const users = [];
const server = net.createServer((c) => {
  // initial code
  c.write('You find yourself connected to...\n');
  c.write('.__________________________________________________________________.\n'       +
  '|    _   _            _             ____                           |\n'               +
  '|   | | | | __ _  ___| | _____ _ __/ ___| _ __   __ _  ___ ___     |\n'               +
  '|   | |_| |/ _` |/ __| |/ / _ \\\ \'__\\\___ \\\| \'_ \\\ / _` |/ __/ _ \\\    |\n'   +
  '|   |  _  | (_| | (__|   <  __/ |   ___) | |_) | (_| | (__| __/    |\n'               +
  '|   |_| |_|\\\__,_|\\\___|_|\\\_\\\___|_|  |____/| .__/ \\\__,_|\\\___\\\___|    |\n' +
  '|                                        |_|                       |\n'               +
  '|__________________________________________________________________|\n');
  c.write('Hosted at whatever arbitrary location the admin chooses.\n\n');
  c.write('Chat:');

  // events
  c.on('data', (data) => {
    c.write(`User: ${data.toString()}`);
  });

});

// listen on port 3113

server.listen(3113, () => {
  console.log('Server successfully started.');
});