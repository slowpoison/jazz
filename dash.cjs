/*
 * dash.cjs
 *
 * Dash definition
 *
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const Logger = require('./logger.cjs').getLogger();

class Dash {
  constructor(jazz, dashObj) {
    this.jazz = jazz;
    this.d3n = jazz.d3n;
    this.dashObj = dashObj;
  }

  async genToJson() {
    // TODO remember that this could already be existing and we're just returning
    // a copy
    return {
      dashId: this.dashObj.dashId,
      style: this.dashObj.styleUrl,
      jazzMods: await Promise.all(
          this.dashObj.jazzMods.map(async (m) => await m.genUrl()))
    };
  }
}

module.exports = Dash;
