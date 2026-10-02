const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTS = [5000, 8080, 5500, 8000, 3001, 3000];
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/sirajventures.html';
  
  const filePath = path.join(ROOT, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      res.end(data);
    }
  });
});

function tryListen(index) {
  if (index >= PORTS.length) {
    console.error('No available ports found.');
    return;
  }
  const port = PORTS[index];
  server.listen(port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Siraj Ventures is running locally!`);
    console.log(`👉 Open: http://localhost:${port}/`);
    console.log(`=================================================\n`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      tryListen(index + 1);
    } else {
      console.error(err);
    }
  });
}

tryListen(0);
