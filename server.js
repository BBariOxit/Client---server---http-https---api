// server.js
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const express = require('express');

const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === '1'; // nhiệm vụ thưởng

const app = express();

// 1) Middleware gán Request-Id & custom headers
app.use((req, res, next) => {
  const reqId = crypto.randomUUID();
  res.setHeader('X-Request-Id', reqId);
  res.setHeader('X-Server-Name', 'Lab01-Server');
  // Ví dụ header cache: static nên cache, API thì no-store
  // Với API ta set trong route, còn ở đây set chung safe defaults
  res.setHeader('X-Powered-By', 'Node.js/Express');
  next();
});

// 2) Static files
app.use(express.static(path.join(__dirname, 'public'), {
  // Cho phép cache static 1 giờ
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// 3) API endpoint
app.get('/api/info', (req, res) => {
  // API -> không cache
  res.setHeader('Cache-Control', 'no-store');

  const data = {
    serverTimestamp: new Date().toISOString(),
    uptimeSec: process.uptime(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    cpuCount: os.cpus()?.length || 0,
    totalMemMB: Math.round(os.totalmem() / 1024 / 1024),
    freeMemMB: Math.round(os.freemem() / 1024 / 1024),
    // Echo 1 số thông tin client gửi lên
    clientHeaders: {
      'user-agent': req.headers['user-agent'],
      'x-client-name': req.headers['x-client-name'] || null
    }
  };

  res.status(200).json(data);
});

// 4) Route test 500 (giúp demo error handling)
app.get('/api/boom', (req, res, next) => {
  next(new Error('Boom! Something went wrong.'));
});

// 5) 404 handler (sau tất cả route)
app.use((req, res, next) => {
  res.status(404);
  // Trả theo Accept header
  if (req.accepts('html')) {
    return res.send(`
      <h1>404 Not Found</h1>
      <p>Không tìm thấy: ${req.originalUrl}</p>
    `);
  }
  if (req.accepts('json')) {
    return res.json({ error: 'Not Found', path: req.originalUrl });
  }
  return res.type('txt').send('Not Found');
});

// 6) Global error handler (500)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 7) Khởi động HTTP/HTTPS server
function start() {
  if (USE_HTTPS) {
    // Nhiệm vụ thưởng: tạo cert trong ./certs
    const key = fs.readFileSync(path.join(__dirname, 'certs', 'server.key'));
    const cert = fs.readFileSync(path.join(__dirname, 'certs', 'server.crt'));
    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`HTTPS server running at https://localhost:${PORT}`);
    });
  } else {
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP server running at http://localhost:${PORT}`);
    });
  }

  // WebSocket demo (ws package)
  const WebSocket = require('ws');
  const wsServer = new WebSocket.Server({ port: 3001 });
  wsServer.on('connection', (ws) => {
    ws.send('Chào mừng đến với WebSocket server!');
    ws.on('message', (msg) => {
      ws.send(`Server nhận: ${msg}`);
    });
  });
  console.log('WebSocket server running at ws://localhost:3001');
}

start();