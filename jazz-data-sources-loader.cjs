/*
 * JazzDataSourcesLoader.cjs
 *
 * Loader for Jazz data sources
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const Logger = require('./logger.cjs').getLogger();
const Path = require('path');
const Fs = require('fs/promises');
const JAZZ_DATA_SOURCE_ACCESSORS_DIR = Path.join(__dirname, "data-source-accessors");
const JAZZ_DATA_SOURCES_DIR = Path.join(__dirname, "data-sources");

class JazzDataSourcesLoader {
  static DataSources = {};
  static DataSourceAccessors = {};

  static getDataSourceAccessor(name) {
    // TODO load on demand
    return this.DataSourceAccessors[name];
  }

  static async genLoadDataSources() {
    var dataSourceAccessors = await Fs.readdir(JAZZ_DATA_SOURCE_ACCESSORS_DIR);
    await Promise.all(
      dataSourceAccessors.map(
        dsa => JazzDataSourcesLoader.#genLoadDataSourceAccessor(dsa)));

    var dataSources = await Fs.readdir(JAZZ_DATA_SOURCES_DIR);
    this.DataSources = await Promise.all(
      dataSources.map(
        ds => JazzDataSourcesLoader.#genLoadDataSource(ds)));
  }

  /**
   * Loads a data source accessor from a the given javascript file
   * @param {String} dsaFile 
   */
  static async #genLoadDataSourceAccessor(dsaFile) {
    var name = dsaFile.split('-')[0];
    if (name == null) {
      Logger.throwError(`Invalid data source accessor name {dsaFile}`);
    }
    name = name.toUpperCase();

    if (JazzDataSourcesLoader.DataSourceAccessors[name] == undefined) {
      try {
        // extract name from dsaFile
        JazzDataSourcesLoader.DataSourceAccessors[name] =
         require(Path.join(JAZZ_DATA_SOURCE_ACCESSORS_DIR, dsaFile));
        Logger.info(`Loaded DataSourceAccessor ${name}`);
      } catch (e) {
        Logger.throwError(`Couldn't load data source accessor`, e);
      }
    }
  }

  static async #genLoadDataSource(dsSourceFileName) {
    var type = dsSourceFileName.split('-')[0];
    if (type == null) {
      Logger.throwError(`Invalid data source name {dsFile}`);
    }

    if (JazzDataSourcesLoader.DataSources[type] == undefined) {
      try {
        JazzDataSourcesLoader.DataSources[type] =
         require(Path.join(JAZZ_DATA_SOURCES_DIR, dsSourceFileName));
      } catch (e) {
        Logger.error(`Couldn't load data source`, e);
        return;
      }
    }
    Logger.info(`Loaded ${type} data source`);
  }

  static async #genStoreRemoteData(source, res) {
      // store the response body in a local file
      const fs = require('fs');
      const file = fs.createWriteStream("file.csv");
      res.body.pipe(file);
      file.close()
  }
}

module.exports = JazzDataSourcesLoader;