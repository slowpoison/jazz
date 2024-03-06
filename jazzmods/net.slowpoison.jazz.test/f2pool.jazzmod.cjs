/**
 * @fileoverview F2Pool API implementation
 */

const JazzMod = require.main.require('./jazz-mod.cjs');
const JsonDataSource = require.main.require('./data-sources/json-data-source.cjs');

class F2Pool extends JazzMod {
  constructor(jazz, pkgName, params) {
    super(jazz, pkgName, params);
    this.dataSource = new JsonDataSource();
  }

  async genFillSvg(svg) {
    // grab user and worker
    var user = this.paramsObj.user;
    var worker = this.paramsObj.worker;

    // create the URL and grab the data
    var request = {};
    request.url = `https://api.f2pool.com/bitcoin/${user}/${worker}`;
    request.headers = {
      'F2P-API-SECRET': this.jazz.getSecret('f2poolV1ApiKey')
    };
    var dataObj = await this.dataSource.genDataObject(request);
    // var data = dataObj.hashrate_history.mapWithKeys((v, k) => [v, k]);
    var data = Object.entries(dataObj.hashrate_history);

    // Add X axis -> it is a date format
    var xScale = d3.scaleTime()
      .domain(d3.extent(data, e => new Date(e[0])))
      .range([0, this.width]);
    svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(xScale));

    // Add Y axis
    var yScale = d3.scaleLinear()
      .domain([
        d3.min(data, e => e[1]),
        d3.max(data, e => e[1])])
      .range([this.height, 0]);
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
                .x(e => xScale(new Date(e[0])))
                .y(e => yScale(e[1])))
  }
}

module.exports = F2Pool;