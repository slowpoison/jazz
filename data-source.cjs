/*
 * data-source.cjs
 *
 * Base class for Data Sources
 *
 * Copyright(c) 2021-24, Vishal Verma <vish@slowpoison.net>
 */

const JazzDataSourcesLoader = require('./jazz-data-sources-loader.cjs');

class DataSource {
  #sourceSpec;

  constructor(sourceSpec) {
    this.#sourceSpec = sourceSpec;
  }

  /**
   * @returns {Buffer} the data buffer backing this data source
   */
  async genDataBuffer(sourceSpec = null) {
    if (sourceSpec == null) {
      sourceSpec = this.#sourceSpec;
    }

    var data = await this.#genDataBufferFromCache(sourceSpec);
    if (data != null) {
      return data;
    }

    return this.#genDataBufferFromSource(sourceSpec);
  }

  async #genDataBufferFromCache(source = null) {
    // TODO implement this
    return null;
  }

  async #genDataBufferFromSource(sourceSpec) {
    // find out accessor type
    var accessorType = DataSource.#getAccessorTypeFromName(sourceSpec);
    if (accessorType == null) {
      accessorType = 'FILE';
    }

    // download data
    var accessor = JazzDataSourcesLoader.getDataSourceAccessor(accessorType);
    var dataBuffer = await accessor.genGet(sourceSpec);

    return dataBuffer;
  }


  // TODO implement or remove this
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
  static #getAccessorTypeFromName(sourceSpec) {
    var url = sourceSpec.url;
    if (url == null) {
      return null;
    }

    if (typeof url == 'string') {
      if (url.startsWith('https')) {
        return 'HTTPS';
      } else if (url.startsWith('http')) {
        return 'HTTP';
      } else if (url.startsWith('file')) {
        return 'FILE';
      }
    }
  }

  onData(onDataCallback) {
    this.genDataBuffer().then(data => onDataCallback(data));
  }
}

module.exports = DataSource;