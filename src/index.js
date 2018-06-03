const http = require('http');
const express = require('express');
const cors = require('cors');
const io = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const SensorsController = require('./controllers/sensors');
// const StationsController = require('./controllers/stations');
const SocketService = require('./services/socket');
const config = require('./libs/config');
const log = require('./libs/log');
const db = require('./libs/db');

// init app
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '250mb' }));

// init app http controllers
const router = express.Router();
new SensorsController(router, 'sensors');
// new StationsController(router, 'stations');
app.use(router);

// init app http error handler
app.use((err, req, res) => {
  log.error('Occurs an error:', { path: req.url, stack: err.stack });
  res.status(err.status || 500);
  res.send(err.message || 'Occurs internal server error.');
});

// init app
(async () => {
  // sync database
  await db.sync();

  // init app http server
  const server = http.createServer(app);
  const port = process.env.PORT || config.server.port;
  server.listen(port, () => {
    log.info(`Server listening on: ${port}.`);
  });

  // init app socket server
  const socket = io(server);
  new SocketService(socket);
})();
