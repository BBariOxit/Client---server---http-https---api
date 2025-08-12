// benchmark.js - Performance benchmarking cho các file tĩnh với kích thước khác nhau
const http = require('http');
const fs = require('fs');
const path = require('path');

const files = ['public/style.css', 'public/script.js', 'public/index.html'];

function benchmark(file) {
  const url = `http://localhost:3000/${path.basename(file)}`;
  const start = Date.now();
  http.get(url, (res) => {
    let size = 0;
    res.on('data', chunk => size += chunk.length);
    res.on('end', () => {
      const duration = Date.now() - start;
      console.log(`${url}: ${size} bytes, ${duration} ms`);
    });
  });
}

files.forEach(benchmark);
