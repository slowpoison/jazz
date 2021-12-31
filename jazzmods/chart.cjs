/*
 * Chart.js
 *
 * Base Chart class
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */


const JazzElement = require('../jazz-element.cjs')
class Chart extends JazzElement {
  // nothing here for now
  d3 = globalThis.d3;
}

module.exports = Chart;
