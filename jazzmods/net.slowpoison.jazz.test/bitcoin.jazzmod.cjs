/**
 * bitcoin.jazzmod.cjs
 * 
 * Bitcoin Jazz Module
 * Copyright (C) 2023, Vishal Verma <vish@slowpoison.net>
 */

const JazzMod = require.main.require('./jazz-mod.cjs');
const CSVDataSource = require.main.require('./data-sources/csv-data-source.cjs');

class Bitcoin extends JazzMod {
  constructor(jazz, pkgName) {
    super(jazz, pkgName);
    this.dataSource = new CSVDataSource();
  }

  async genSvg() {
    var thisMod = this;
    var svg =  d3.create('svg');
    svg
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv")
      .then(function (data) {
        // Add X axis -> it is a date format
        var xScale = d3.scaleTime()
          .domain(d3.extent(data, d => new Date(d.date)))
          .range([0, thisMod.width]);
        svg.append("g")
          .attr("transform", "translate(0," + thisMod.height + ")")
          .call(d3.axisBottom(xScale));

        // Add Y axis
        var yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => +d.value)])
          .range([thisMod.height, 0]);
        svg
          .append("g")
          .call(d3.axisLeft(yScale));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d",
                    d3.line()
                    .x(d => xScale(new Date(d.date)))
                    .y(d => yScale(+d.value)))

        });

    return svg;
  }
}

module.exports = Bitcoin;