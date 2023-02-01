/*
 * csv-data-source.cjs
 *
 * CSV Data Source
 * Copyright(c) 2021-2023, Vishal Verma <vish@slowpoison.net>
 */

const DataSource = require('../data-source.cjs');
const fetch = import('node-fetch');
const Logger = require.main.require('./logger.cjs').getLogger();

class CSVDataSource extends DataSource {
  constructor(source) {
    super(source);
  }

  /**
   * Loads the CSV file from the source and returns a String containing the CSV
   */
  async genLoad() {
    // load the CSV file from the source using fetch
    
    // TODO what does fetch do with long responses?
    return(res.body);
  }

  async #genLoadCSV() {
    const csv = require('csvtojson');
    const csvFilePath = this.source;
    const jsonArray = await csv().fromFile(csvFilePath);
    return jsonArray;
  }

  static async #genLoadCSVFromURL(url) {

  }
  
  async #genHasNextRow() {
    return this.csvFileGenerator.hasNextRow();
  }

  async foo() {
   const readStream = request.get(this.source); 
    const csv = require('csvtojson');
    const csvFilePath = this.source;
    const jsonArray = await csv().fromStream(csvFilePath);
    return jsonArray;
  }

  async #genLoadCSVFromStream() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromStream(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromBuffer() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromString(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromObject() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromObject(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromString() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromString(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromJSON() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromJSON(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromNDJSON() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromNDJSON(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromCSV() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromCSV(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromTSV() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromTSV(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromYAML() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromYAML(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromXML() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromXML(this.source);
    return jsonArray;
  }

  async #genLoadCSVFromHTML() {
    const csv = require('csvtojson');
    const jsonArray = await csv().fromHTML(this.source);
    return jsonArray;
  }
}

module.exports = CSVDataSource;