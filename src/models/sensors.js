const Sequelize = require('sequelize');
const Model = require('./../core/model');
const db = require('./../libs/db');

// define constants
const TABLE_NAME = 'sensors_data';
const SENSORS = new Map([
  [0, { id: 0, name: 'Освітленність', unit: 'лк' }],
  [1, { id: 1, name: 'Температура', unit: '°C' }],
  [2, { id: 2, name: 'Напруга', unit: 'В' }],
  [3, { id: 3, name: 'Струм', unit: 'А' }],
  [4, { id: 4, name: 'Активна потужність', unit: 'Вт' }],
  [5, { id: 5, name: 'Реактивна потужність', unit: 'Вар' }],
]);

/**
 * Sensors model
 */
class SensorsModel extends Model {
  /**
   * Constructor of sensors model
  */
  constructor() {
    super();

    // handle singleton
    if (SensorsModel.singleton) {
      return SensorsModel.singleton;
    }

    // init model
    this.source = initSequelizeModel();
    SensorsModel.singleton = this;
  }

  /**
   * Method for adding sensor data
   * @param {Array} data - array of sensors data
   * @return {Promise.<{}>}
   */
  async addData(data) {
    // prepare data
    const normalizedData = data.map(({ id, value }) => {
      const sensor = SENSORS.get(id);
      return {
        value,
        unit: sensor.unit,
        sensorId: id,
        sensorName: sensor.name,
        timestamp: Date.now(),
      };
    });

    // send data to database
    try {
      await this.source.bulkCreate(normalizedData);
      return this.resolve({ created: true });
    } catch (e) {
      const input = { data };
      const meta = { code: 500, stack: e.stack, input };
      return this.reject('Cannot add sensor data.', meta);
    }
  }

  async getData(queries) {
    // prepare select options
    const options = {};
    if (queries.dateFrom) {
      options.timestamp = options.timestamp || {};
      options.timestamp[Sequelize.Op.gt] = queries.dateFrom;
    }
    if (queries.dateTo) {
      options.timestamp = options.timestamp || {};
      options.timestamp[Sequelize.Op.lt] = queries.dateTo;
    }
    if (typeof queries.sensorId !== 'undefined') {
      options.sensorId = queries.sensorId;
    }

    // request data
    try {
      const response = await this.source.findAll({
        where: { ...options },
        raw: true,
        offset: queries.offset,
        limit: queries.limit,
        order: [['id', 'DESC']],
      });
      return this.resolve(response || []);
    } catch (e) {
      const input = { queries };
      const meta = { code: 500, stack: e.stack, input };
      return this.reject('Cannot select sensors data.', meta);
    }
  }
}

/**
 * Helper for defining sequelize source model
*/
function initSequelizeModel() {
  return db.define(TABLE_NAME, {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sensorId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    sensorName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: Sequelize.DataTypes.DOUBLE,
    },
  });
}

module.exports = SensorsModel;
module.exports.SENSORS = SENSORS;
