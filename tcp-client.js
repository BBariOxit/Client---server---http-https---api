// tcp-client.js - Custom TCP client
const net = require('net');
const client = net.createConnection({ port: 4000 }, () => {
  console.log('Đã kết nối tới TCP server!');
  client.write('Xin chào server!');
});
client.on('data', (data) => {
  console.log('Server trả về:', data.toString());
});
client.on('end', () => {
  console.log('Đã ngắt kết nối từ server');
});
