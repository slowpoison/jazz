const Chart = require('./chart.cjs');
class PieChart extends Chart {

  get(svg, dataObject, style) {
    var pie = d3.pie().value(d => d[1]);

    // TODO how to land this in the proper spot in the chart? There could
    // be multiple of these. Ideally, would love to return this, without
    // a care for where it lands up and the higher level chart can insert
    // it at the right element, probably using the correct #element-id.
    return svg
      .selectAll('whatever')
      .data(pie(Object.entries(dataObject.defaultComponent())))
      .join('path')
      .attr("d", d3.arc()
          .innerRadius(0)
          .outerRadius(style.radius))
      .attr("fill", style.fill)
      .attr("stroke", style.strokeColor)
      .attr("stroke-width", style.strokeWidth);
  }
}

module.exports = PieChart;
