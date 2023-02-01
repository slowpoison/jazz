/**
 * HTTP Data Source Accessor
 * @license MIT
 * @author 2023 Vishal Verma <vish@slowpoison.net>
 */

class HttpDataSourceAccessor {
  static async genGet(url) {
    const fetch = await import('node-fetch');
    var response = await fetch(url);
    return await response.json();
  }
}

module.exports = HttpDataSourceAccessor;