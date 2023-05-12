const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const apiProxy = createProxyMiddleware({
  target: 'https://test.azero.dev',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // Optional, to rewrite the path
});

app.use('/api', apiProxy);
app.listen(PORT, () => console.log(`Local proxy server running on port ${PORT}`));
