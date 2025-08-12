// client.js - HTTP Client tự xây dựng
const http = require('http');
const https = require('https');
const { URL } = require('url');

class SimpleHttpClient {
	constructor() {}

	request(method, url, options = {}) {
		return new Promise((resolve, reject) => {
			const u = new URL(url);
			const lib = u.protocol === 'https:' ? https : http;
			const reqOptions = {
				method,
				hostname: u.hostname,
				port: u.port || (u.protocol === 'https:' ? 443 : 80),
				path: u.pathname + u.search,
				headers: options.headers || {},
				timeout: options.timeout || 5000
			};
			const req = lib.request(reqOptions, (res) => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => {
					resolve({
						status: res.statusCode,
						headers: res.headers,
						body: data
					});
				});
			});
			req.on('error', reject);
			if (options.body) {
				req.write(options.body);
			}
			req.end();
		});
	}

	async get(url, headers = {}) {
		console.log(`[GET] ${url}`);
		return await this.request('GET', url, { headers });
	}

	async post(url, body, headers = {}) {
		console.log(`[POST] ${url}`);
		if (typeof body === 'object') {
			body = JSON.stringify(body);
			headers['Content-Type'] = 'application/json';
		}
		return await this.request('POST', url, { headers, body });
	}
}

// Kiểm thử các trường hợp
async function runTests() {
	const client = new SimpleHttpClient();
	try {
		// 1. GET tới server cục bộ
		const local = await client.get('http://localhost:3000/api/info');
		console.log('Local server response:', local);

		// 2. GET tới external API (GitHub)
		const github = await client.get('https://api.github.com/', {
			'User-Agent': 'Lab01-Client',
			'Accept': 'application/vnd.github.v3+json'
		});
		console.log('GitHub API response:', github.status);

		// 3. POST tới JSONPlaceholder
		const postRes = await client.post('https://jsonplaceholder.typicode.com/posts', {
			title: 'lab01', body: 'test', userId: 20
		});
		console.log('POST JSONPlaceholder:', postRes.status, postRes.body);

		// 4. Lỗi server không khả dụng
		try {
			await client.get('http://localhost:9999/');
		} catch (err) {
			console.error('Server unavailable:', err.message);
		}
	} catch (err) {
		console.error('Test error:', err);
	}
}

if (require.main === module) {
	runTests();
}
