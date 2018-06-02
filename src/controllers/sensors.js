const Controller = require('./../core/controller');
const SensorsModel = require('./../models/sensors');
const SocketService = require('./../services/socket');
const log = require('./../libs/log');

/**
 * Sensors controller
 */
class SensorsController extends Controller {
  /**
   * Constructor of sensors controller
   * @param {{}} router - express router  instance
   * @param {string} path - root controller path
   */
  constructor(router, path) {
    super();

    // set controller fields
    this.router = router;
    this.path = path;
    this.model = new SensorsModel();

    // set controller listeners
    this.router.get(`/${this.path}/data`, this.handleDataGetting.bind(this));
    this.router.post(`/${this.path}/data`, this.handleDataAdding.bind(this));
  }

  /**
   * Method for handling get sensors data request
   * @param {{}} req - request instance
   * @param {{}} res - response instance
   */
  async handleDataGetting(req, res) {
    const queries = req.query || {};
    const response = await this.model.getData(queries);
    if (response.error) {
      return this.reject(res, response.error, response.meta);
    }
    return this.resolve(res, response.data, response.meta);
  }

  /**
   * Method for handling add sensors data request
   * @param {{}} req - request instance
   * @param {{}} res - response instance
   */
  async handleDataAdding(req, res) {
    // check input params
    const { data } = req.body;
    log.info('Get sensors data: ', { data });
    if (!Array.isArray(data)) {
      return this.reject(res, 'Data is required.', { code: 400 });
    }

    // add data to database
    const response = await this.model.addData(data);
    if (response.error) {
      this.reject(res, response.error, response.meta);
    }
    this.resolve(res, response.data, response.meta);

    // broadcast actual data
    const socket = new SocketService();
    return socket.broadcastSensorsData();
  }
}

module.exports = SensorsController;
