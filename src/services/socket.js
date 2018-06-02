const SensorsModel = require('./../models/sensors');

// define constants
const MESSAGE_SET_SENSORS_DATA = 'solar/server/SET_SENSORS_DATA';

/**
 * Socket service
 */
class SocketService {
  /**
   * Constructor of socket service
   * @param {{}} socket - socket instance
   */
  constructor(socket) {
    // handle singleton
    if (SocketService.singleton) {
      return SocketService.singleton;
    }

    // handle connection
    this.socket = socket;
    this.socket.on('connection', (client) => {
      new ClientHandler(client);
    });

    // save singleton
    SocketService.singleton = this;
  }

  /**
   * Method for broadcasting to all user actual sensors data
   */
  async broadcastSensorsData() {
    const sensorsData = await getSensorsData();
    this.socket.local.emit(MESSAGE_SET_SENSORS_DATA, sensorsData);
  }
}

/**
 * Client handler
 */
class ClientHandler {
  /**
   * Constructor of client handler
   */
  constructor(client) {
    this.client = client;
    this.model = new SensorsModel();
    this.handleConnect();
  }

  /**
   * Method for handling new client connection
   */
  async handleConnect() {
    const sensorsData = await getSensorsData();
    this.client.emit(MESSAGE_SET_SENSORS_DATA, sensorsData);
  }
}

/**
 * Helper for getting sensors data
 */
async function getSensorsData() {
  const model = new SensorsModel();
  const sensors = Array.from(SensorsModel.SENSORS.values());
  const sensorsData = (await Promise.all(sensors.map(async (sensor) => {
    const { data } = await model.getData({ sensorId: sensor.id, limit: 1 });
    if (data && data[0]) {
      return data[0];
    }
    return null;
  }))).filter(Boolean);
  return sensorsData;
}

module.exports = SocketService;
