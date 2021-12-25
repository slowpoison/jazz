/*
 * Jazz.cjs
 *
 * Main Jazz class
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */
const D3Node = require('d3-node');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

globalThis.document = new JSDOM('<!DOCTYPE html>').window.document;

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    //globalThis.Headers = Headers;
    //globalThis.Request = Request;
    //globalThis.Response = Response;
}

const options = {
  selector: '#chart',
  container: '<div id="container"><div id="chart"></div></div>'
};
const d3n = new D3Node(options); // initializes D3 with container element
const d3 = d3n.d3;
globalThis.d3 = d3;

// Load all Jazz Modules
const Mods = {};
loadJazzModules();

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
		width = 460 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

var svg = d3n.createSVG()
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");

class Jazz {
  async genChart() {
    return await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(
        function(data) {

        // Add X axis -> it is a date format
        var xScale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale));

        // Add Y axis
        var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.value)])
        .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(yScale));

        var component = new Mods['LineChart'](this);
        var style = {
          fill: 'none',
          strokeColor: 'steelblue',
          strokeWidth: 1.5
        };
        console.log('yScale', yScale);
        component.get(svg, data, style, xScale, yScale);

        console.log(d3n.svgString())
        return d3n.svgString()
        });
  }
}

function loadJazzModules() {
  var Path = require('path');
  var jazzmodsDir = Path.join(__dirname, "jazzmods");
  require("fs").readdirSync(jazzmodsDir)
    .filter(fileName => fileName.endsWith('.cjs'))
    .forEach(fileName => {
        var m = require(Path.join(jazzmodsDir, fileName));
        if (Mods[m.name] != null)
          throw new Error(`Module ${m.name} already exists`);
        Mods[m.name] = m;
    });
}

module.exports = Jazz;
