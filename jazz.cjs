/*
 * Jazz.cjs
 *
 * Main Jazz class
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */
const D3Node = require('slowpoison-d3-node');
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
  selector: '#jazz',
  container: '<div id="container"><div id="jazz"></div></div>'
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

/*
var svg = d3n.createSVG()
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");
          */

class Jazz {
  async genChart() {
    /*
    var lineChart = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(
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

        var dataObject = createDataObject(data, xScale, yScale);

        var component = new Mods['LineChart'](this);
        var style = {
          fill: 'none',
          strokeColor: 'steelblue',
          strokeWidth: 1.5
        };
        component.get(svg, dataObject, style);

        //console.log(d3n.svgString())
        });
        */

    var svgPie = d3n.createSVG()
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    // generate pie-chart. TODO create parallely with line chart? :)
    var pieData = {BTC: 50, ETH: 40, LTC: 10};
    var component = new Mods['PieChart'](this);
    var style = {
          fill: 'none',
          strokeColor: 'steelblue',
          radius: Math.min(width, height) / 2 - 10,
          strokeWidth: 1.5
        };
    var dataObject = createDataObject(pieData);
    component.get(svgPie, dataObject, style);

    console.log(d3n.svgStrings())
    return d3n.svgStrings().join('');
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

function createDataObject(data, xScale, yScale) {
  var dataObject = {
    data: data,
    defaultComponent: function() { return data; }
  };

  if (xScale != null) {
    dataObject.xComponent = function() {
      return d => xScale(new Date(d.date));
    };
  }

  if (yScale != null) {
    dataObject.yComponent = function() {
      return d => yScale(+d.value);
    };
    dataObject.defaultComponent = dataObject.yComponent;
  }

  return dataObject;
}

module.exports = Jazz;
