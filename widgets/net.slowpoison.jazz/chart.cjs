/*
 * Chart.js
 *
 * Base Chart class
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */
const JazzWidget = require.main.require('./jazz-widget.cjs');
const Logger = require.main.require('./logger.cjs').getLogger();
class Chart extends JazzWidget {
  // nothing here for now
  constructor() {
    super();
  }

  // TODO think about a better method name
  async genAddToSvg(svg) {
	// TODO - data and width should come from the parent class
	// Add X axis -> it is a date format
	var xScale = this.d3.scaleTime()
		.domain(this.d3.extent(this.dataSource, d => new Date(d.date)))
		//.domain(this.d3.extent(data, d => new Date(d.date)))
		.range([0, style.width]);
	svg.append("g")
		//FIXME .attr("transform", "translate(0," + height + ")")
		.call(this.d3.axisBottom(xScale));
	// Add Y axis
	var yScale = this.d3.scaleLinear()
		.domain([0, this.d3.max(data, d => +d.value)])
		.range([style.height, 0]);
	svg.append("g")
		.call(this.d3.axisLeft(yScale));
    this.#genAddToSvgImpl(svg, data);
  }


  async #genAddToSvgImpl(svg) {
    Logger.throwError("Child class should implement #genAddToSvgImpl()");
  }
}
module.exports = Chart;