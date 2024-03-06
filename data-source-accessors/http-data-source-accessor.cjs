/**
 * HTTP Data Source Accessor
 * @license MIT
 * @author 2023 Vishal Verma <vish@slowpoison.net>
 */
const DataSourceAccessor = require('../data-source-accessor.cjs');

class HttpDataSourceAccessor extends DataSourceAccessor {
  static async genGet(sourceSpec) {
    var response = await fetch(sourceSpec.url, {
      method: sourceSpec.method != null ? sourceSpec.method : 'GET',
      headers: sourceSpec.headers != null ? sourceSpec.headers : {}
    });
    var text = await response.text();
    return text;
  }
}

module.exports = HttpDataSourceAccessor;