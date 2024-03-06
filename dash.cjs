/*
 * dash.cjs
 *
 * Dash definition
 *
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const Logger = require('./logger.cjs').getLogger();

const JazzRef = require('./jazz-ref.cjs');

class Dash {
  constructor(jazz, dashObj) {
    this.jazz = jazz;
    this.d3n = jazz.d3n;
    this.dashObj = dashObj;
  }

  async genToJson() {
    // TODO remember that this could already be existing and we're just returning
    // a copy
    var ret = {
      dashId: this.dashObj.dashId,
      styleRef: this.dashObj.styleRef,
      styleUrl: JazzRef.Style.makeUrl(this.dashObj.styleRef),
      jazzMods: this.dashObj.jazzMods.map(m => m.url())
    };
    return ret;
  }
}

module.exports = Dash;