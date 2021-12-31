const Chart = require('./chart.cjs');
class LineChart extends Chart {
  async genUrl() {
    return '/jazz/e/line-chart.svg'
  }

  get(svg, dataObject, style) {
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
