const Chart = require('./chart.cjs');
class LineChart extends Chart {

  get(svg, data, style, xScale, yScale) {
    var path = this.#getPath(svg, data, style, xScale, yScale);
    return path;
  }
     
  // TODO should we really be passing an svg here?
  #getPath(svg, data, style, xScale, yScale) {
    console.log('xScale', xScale, 'yscale', yScale);
    return svg.append('path')
      .datum(data)
      .attr("fill", style.fill)
      .attr("stroke", style.strokeColor)
      .attr("stroke-width", style.strokeWidth)
      .attr("d",
          d3.line()
          .x(d => xScale(new Date(d.date))) // TODO make it generic. no date
          .y(d => yScale(+d.value))); // make it generic. remove +
  }
}

module.exports = LineChart;
