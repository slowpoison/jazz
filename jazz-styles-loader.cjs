/*
 * jazz-styles-loader
 *
 * Loads styles from file
 * Copyright(c) 2022, Vishal Verma <vish@slowpoison.net>
 */

const Fs = require('fs/promises');
class JazzStylesLoader {
  static async genLoadStyle(jazz, style) {
    return 
      Fs.readFile(path.join(__dirname, 'dashboards', 'public', 'styles', style), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      })
  }
}

module.exports = JazzStylesLoader;
