const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const base = path.join(__dirname, 'public');

function getContentType(ext) {
  switch (ext) {
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    default: return 'text/html';
  }
}

const server = http.createServer((req, res) => {
  let filePath = path.join(base, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': getContentType(ext), 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
