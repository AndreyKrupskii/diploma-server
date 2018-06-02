/**
 * Basic controller
 */
class Controller {
  /**
   * Method for success response
   * @param {{}} res - response instance
   * @param {*} data - response data
   * @param {*} [meta] - response meta
   */
  resolve(res, data, meta = {}) {
    res.status(200).json({ data, meta: { code: 200, ...meta } });
  }

  /**
   * Method for fail response
   * @param {{}} res - response instance
   * @param {*} error - response error
   * @param {*} [meta] - response meta
   */
  reject(res, error, meta = {}) {
    if (meta.stack) {
      delete meta.stack;
    }
    res.status(meta.code || 500).json({ error, meta });
  }
}

module.exports = Controller;
