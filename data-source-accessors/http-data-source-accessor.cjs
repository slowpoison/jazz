/**
 * HTTP Data Source Accessor
 * @license MIT
 * @author 2023 Vishal Verma <vish@slowpoison.net>
 */
const DataSourceAccessor = require('../data-source-accessor.cjs');

class HttpDataSourceAccessor extends DataSourceAccessor {
  static async genGet(url) {
    var response = await fetch(url);
    var text = await response.text();
    return text;
  }
}

module.exports = HttpDataSourceAccessor;