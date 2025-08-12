// ws-demo.js - WebSocket server & client demo
const WebSocket = require('ws');

// WebSocket Server
const wss = new WebSocket.Server({ port: 3002 });
wss.on('connection', ws => {
  ws.send('Chào mừng đến với WebSocket server!');
  ws.on('message', msg => {
    ws.send(`Server nhận: ${msg}`);
  });
});
console.log('WebSocket server running at ws://localhost:3002');

// WebSocket Client (demo)
const wsClient = new WebSocket('ws://localhost:3002');
wsClient.on('open', () => {
  console.log('Client kết nối thành công!');
  wsClient.send('Xin chào server!');
});
wsClient.on('message', msg => {
  console.log('Server trả về:', msg);
});
