const log = require('./../libs/log');

/**
 * Basic model
 */
class Model {
  /**
   * Method for resolving model response
   * @param {*} data - resolved data
   * @param {{}} [meta] - response meta data
   * @return {{data: {}, meta: {}}}
   */
  resolve(data, meta = {}) {
    return { data, meta };
  }

  /**
   * Method for rejecting model response
   * @param {*} error - rejected error message
   * @param {{}} [meta] - response meta data
   * @returns {{error: {}, meta: {}}}
   */
  reject(error, { stack, ...meta } = {}) {
    log.error(error, meta);
    log.error(stack);
    return { error, meta };
  }
}

module.exports = Model;
