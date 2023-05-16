const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const options = {
  target: 'https://test.azero.dev',
  changeOrigin: true,
  onProxyReq(proxyReq, req, res) {
    console.log(`Request: ${req.method} ${req.url}`);
    cors()(req, res, () => {});
  },
  onProxyRes(proxyRes, req, res) {
    console.log(`Response: ${proxyRes.statusCode} - ${req.method} ${req.url}`);

    if (req.method === 'OPTIONS' && proxyRes.statusCode !== 200) {
      res.writeHead(200, proxyRes.headers);
      res.end();
      return;
    }

    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    proxyRes.on('data', (chunk) => {
      res.write(chunk);
    });

    proxyRes.on('end', () => {
      res.end();
    });
  },
  onError(err, req, res) {
    console.error(`Error: ${err.message} - ${req.method} ${req.url}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(
      'Something went wrong. And we are reporting a custom error message.',
    );
  },
};

const proxy = createProxyMiddleware(options);

const server = http.createServer((req, res) => {
  proxy(req, res);
});

server.listen(3000, () => {
  console.log('Proxy server listening on http://localhost:3000');
});
