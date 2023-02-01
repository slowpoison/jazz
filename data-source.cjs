/*
 * data-source.cjs
 *
 * Base class for Data Sources
 *
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const JazzDataSourcesLoader = require('./jazz-data-sources-loader.cjs');

class DataSource {
  static getSourceFor(dataSourceName) {
    var dsType = DataSource.#getDataSourceTypeFromName(dataSourceName);
    return JazzDataSourcesLoader.DataSources[type].load(source);
  }

  /**
   * Loads the data from the cache or from the source
   */
  async #genLoad() {
    if (!await this.#genLoadFromCache()) {
      this.#loadFromSource();
    }

    this.loaded = true;
  }

  #genLoadFromCache() {
    // TODO implement this
    return false;
  }

  #genLoadFromSource() {
    this.ds = DataSource.loadFromSource(this.type, this.source);
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
}

module.exports = DataSource;