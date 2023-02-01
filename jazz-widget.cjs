/*
 * jazz-widget.cjs
 *
 * Individual element, that's capable of being loaded from the client
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

class JazzWidget {
  constructor() {
    this.d3 = globalThis.d3;
  }

  async genUrl() {
    throw new Error(`Class ${this.classname} should implement genUrl`)
  }

  async genSvg() {
    var svg = this.d3.create('svg')
      .attr("class", "chart lineChart")
      .append("g");

    this.genAddToSvg(svg);
    return svg;
  }

  async genAddToSvg() {
    throw new Error(`Class ${this.classname} should implement genUrl`)
  }
}

module.exports = JazzWidget;
