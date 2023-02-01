/*
 * jazz-styles-loader
 *
 * Loads styles from file
 * Copyright(c) 2022, Vishal Verma <vish@slowpoison.net>
 */

class JazzStylesLoader {
  static async genLoadStyle(jazz, style) {
    // FIXME
    return {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60 },
      width: 400,
      height: 390
    };
  }
}

module.exports = JazzStylesLoader;
