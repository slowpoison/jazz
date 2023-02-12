/*
 * data-source.cjs
 *
 * Base class for Data Sources
 *
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const { DataSourceAccessors } = require('./jazz-data-sources-loader.cjs');
const JazzDataSourcesLoader = require('./jazz-data-sources-loader.cjs');

class DataSource {
  #sourceUrl;

  constructor(sourceUrl) {
    this.#sourceUrl = sourceUrl;
  }

  /**
   * @returns {String} the data formatted as a json string
   */
  async genDataBuffer() {
    var data = await this.#genDataBufferFromCache();
    if (data != null) {
      return data;
    }

    return this.#genDataBufferFromSource();
  }

  async #genDataBufferFromCache() {
    // TODO implement this
    return null;
  }

  async #genDataBufferFromSource() {
    // find out accessor type
    var accessorType = DataSource.#getAccessorTypeFromName(this.#sourceUrl);
    if (accessorType == null) {
      accessorType = 'FILE';
    }

    // download data
    var accessor = JazzDataSourcesLoader.getDataSourceAccessor(accessorType);
    var dataBuffer = await accessor.genGet(this.#sourceUrl);

    return dataBuffer;
  }


  async #genLoad() {
  }

  async #genLoadFromCache() {
    // TODO implement this
    return false;
  }

  async genDownloadSource() {
    // download based on accessor?

    // return content as a string
  }

  #genLoadFromSource() {
    this.ds = DataSource.#loadFromSource(this.type, this.source);
  }

  static #getDataSourceTypeFromName(dataSourceName) {
    if (dataSourceName == null) {
      return 'Unknown';
    }

    if (typeof dataSourceName == 'String') {
      if (dataSourceName.endsWith('.csv')) {
        return 'CSV';
      }
    }
  }

  async #genHasNextRow() {
    Logger.throwError('Child class should implement this method');
  }

  static #loadFromSource(type, source) {
  }

  // FIXME tokenize the type (look for a colon) and then search in a map
  static #getAccessorTypeFromName(dataSourceUrl) {
    if (dataSourceUrl == null) {
      return null;
    }

    if (typeof dataSourceUrl == 'string') {
      if (dataSourceUrl.startsWith('https')) {
        return 'HTTPS';
      } else if (dataSourceUrl.startsWith('http')) {
        return 'HTTP';
      } else if (dataSourceUrl.startsWith('file')) {
        return 'FILE';
      }
    }
  }

  onData(onDataCallback) {
    this.genDataBuffer().then(data => onDataCallback(data));
  }
}

module.exports = DataSource;