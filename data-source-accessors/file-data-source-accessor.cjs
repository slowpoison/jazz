/**
 * @fileoverview File data source accessor
 * 
 * @author Vishal Verma <vish@slowpoison.net>
 * @copyright 2023
 */
const fs = require('fs');
const DataSourceAccessor = require('../data-source-accessor.cjs');

class FileDataSourceAccessor extends DataSourceAccessor {
  async genGet(dataSourceName) {
    return fs.readFileSync(dataSourceName);
  }
}

module.exports = FileDataSourceAccessor;