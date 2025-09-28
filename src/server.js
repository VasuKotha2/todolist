const express = require('express');
const path = require('path');       // <-- required for static files
const { createLogger } = require('./middleware/logger');
const todosRouter = require('./routes/todos');
const client = require('prom-client');

function createApp(options = {}) {
  const app = express();
  app.use(express.json());

  // Logger
  const logger = createLogger(options.loggerOptions);
  app.use(logger);

  // Prometheus metrics
  client.collectDefaultMetrics({ prefix: 'node_todos_' });
  const requestCounter = new client.Counter({
    name: 'node_todos_http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
  });
  const requestDuration = new client.Histogram({
    name: 'node_todos_http_request_duration_seconds',
    help: 'Request duration in seconds',
    labelNames: ['method', 'route', 'status']
  });
  app.use((req, res, next) => {
    const end = requestDuration.startTimer();
    res.on('finish', () => {
      requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode
      });
      end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
    });
    next();
  });

  // Serve static files from public/
  app.use(express.static(path.join(__dirname, '../public')));

  // Default route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Health check
  app.get('/healthz', (req, res) => {
    const commit = process.env.COMMIT_SHA || 'dev';
    res.json({ status: 'ok', commit });
  });

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', client.register.contentType);
      res.send(await client.register.metrics());
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Todos API
  const db = options.db || require('./db/memory');
  app.use('/api/v1/todos', todosRouter(db));

  return app;
}

// Start server if run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = createApp;
