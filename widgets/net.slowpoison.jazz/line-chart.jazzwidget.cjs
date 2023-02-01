/*
 * line-chart.jazzwidget.cjs
 *
 * Line chart implementation
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */

const Chart = require('./chart.cjs');
class LineChart extends Chart {
  constructor() {
    super();
  }

  async genUrl() {
    return '/jazz/p/net.slowpoison.jazz.test/e/LineChart/1.svg';
  }

  async #genAddToSvgImpl(svg, dataObject, style) {
    return svg.append('path')
      .datum(dataObject.data)
      // TODO probably could apply styles automatically
      .attr("fill", style.fill)
      .attr("stroke", style.strokeColor)
      .attr("stroke-width", style.strokeWidth)
      .attr("d",
          d3.line()
          .x(dataObject.xComponent())
          .y(dataObject.yComponent()));
  }
}

module.exports = LineChart;
