/**
 * @fileoverview data source accessor base class
 * @author: Vishal Verma <vish@slowpoison.net>
 * @copyright: 2023, Vishal Verma
 */

const Logger = require('./logger.cjs');

class DataSourceAccessor {
  async genGet(url) {
    Logger.throwError('child class must implement genGet()')
  }
}

module.exports = DataSourceAccessor;