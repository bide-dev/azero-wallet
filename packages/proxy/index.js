const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const options = {
  target: 'https://test.azero.dev',
  changeOrigin: true,
  onProxyReq(_proxyReq, req, res) {
    // eslint-disable-next-line no-empty-function
    cors()(req, res, () => {});
  },
  onError(_err, _req, res) {
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
