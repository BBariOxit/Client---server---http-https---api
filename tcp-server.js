// tcp-server.js - Custom TCP server
const net = require('net');
const server = net.createServer((socket) => {
  socket.write('Chào mừng đến với TCP server!\n');
  socket.on('data', (data) => {
    socket.write(`Server nhận: ${data}`);
  });
});
server.listen(4000, () => {
  console.log('TCP server running at port 4000');
});
