const { proxy, close } = require('fast-proxy')({
  base: 'https://test.azero.dev',
});
const gateway = require('restana')();

// Middleware function for logging incoming requests
/**
 *
 * @param req
 * @param res
 * @param next
 */
function logRequest(req, res, next) {
  console.log(`Request: ${req.method} ${req.url}`);
  const originalResEnd = res.end;
  res.end = function () {
    console.log(`Response: ${res.statusCode} - ${req.method} ${req.url}`);
    originalResEnd.apply(this, arguments);
  };
  next();
}

gateway.use(logRequest); // Add the logging middleware

gateway.all('/', function (req, res) {
  proxy(req, res, req.url, {});
});

gateway.start(3000, () => {
  console.log('Proxy server listening on http://localhost:3000');
});
