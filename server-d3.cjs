const D3Node = require('d3-node');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

globalThis.document = new JSDOM('<!DOCTYPE html>').window.document;

//import fetch from 'node-fetch';

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    //globalThis.Headers = Headers;
    //globalThis.Request = Request;
    //globalThis.Response = Response;
}

//const d3n = new D3Node();
//d3n.createSVG(10, 20).append('g');
//console.log(d3n.svgString());

const options = { selector: '#chart', container: '<div id="container"><div id="chart"></div></div>' }
const d3n = new D3Node(options) // initializes D3 with container element
const d3 = d3n.d3

const canvasModule = require('canvas');
const d3nc = new D3Node({canvasModule});
const canvas = d3n.createCanvas(960, 500);
const context = canvas.getContext('2d');
canvas.pngStream().pipe(fs.createWrite
//d3.select(d3n.document.querySelector('#chart')).append('span') // insert span tag into #chart
//console.log(d3n.html())   // output: <html><body><div id="container"><div id="chart"><span></span></div></div></body></html>
//console.log(d3n.chartHTML())  // output: <div id="chart"><span></span></div>

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
		width = 460 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(d3n.document.querySelector('#chart'))
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(
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

        //data.forEach(d => console.log(xScale(d.date), yScale(d.value)));

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

				//console.log(d3n.html());

        })
