// monitor.js - Tiện ích giám sát mạng
const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');

function logRequest(url, method = 'GET') {
	const u = new URL(url);
	const lib = u.protocol === 'https:' ? https : http;
	const start = Date.now();
	const req = lib.request({
		method,
		hostname: u.hostname,
		port: u.port || (u.protocol === 'https:' ? 443 : 80),
		path: u.pathname + u.search,
		headers: { 'User-Agent': 'MonitorScript' }
	}, (res) => {
		let size = 0;
		res.on('data', chunk => size += chunk.length);
		res.on('end', () => {
			const duration = Date.now() - start;
			const type = u.pathname.startsWith('/api/') ? 'dynamic' : 'static';
			console.log(`[${method}] ${url} | ${type} | Status: ${res.statusCode} | Size: ${size} bytes | Time: ${duration} ms`);
		});
	});
	req.on('error', err => {
		console.error(`[ERROR] ${method} ${url}:`, err.message);
	});
	req.end();
}

// Kiểm thử: giám sát các loại request
function runMonitor() {
	const targets = [
		'http://localhost:3000/', // static
		'http://localhost:3000/style.css', // static
		'http://localhost:3000/api/info', // dynamic
		'http://localhost:3000/khong-ton-tai' // 404
	];
	targets.forEach(url => logRequest(url));
}

if (require.main === module) {
	runMonitor();
}
