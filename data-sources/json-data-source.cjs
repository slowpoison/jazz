/**
 * @fileoverview JSON data source
 */

const DataSource = require.main.require('./data-source.cjs');

class JsonDataSource extends DataSource {
  constructor(source) {
    super(source);
  }

  async genDataObject(dataRef) {
    return JSON.parse(await this.genDataBuffer(dataRef));
  }
}

module.exports = JsonDataSource;