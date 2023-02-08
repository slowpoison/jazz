/**
 * jazz-mod.cjs
 * 
 * Jazz Module base class
 * Copyright (C) 2023, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const JazzRef = require('./jazz-ref.cjs');

class JazzMod {
  constructor(jazz, classRef) {
    this.jazz = jazz;
    this.classRef = classRef;

    // FIXME - replace literal values with correct formulae
    this.margin = {top: 10, right: 30, bottom: 30, left: 60};
    this.width = 460 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }
  async genSvg() {
    var svg =  d3.create('svg');
    var g = svg
      .attr("xmlns", "http://www.w3.org/2000/svg")
      // TODO width comes from dash
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
    await this.genFillSvg(g);
    return svg;
  }

  async genFillSvg(svg) {
    Logger.error(`genFillSvg not implemented for ${this.classRef}`);
  }

  async genUrl() {
    // FIXME - replace static 1 with modRef
    return JazzRef.JazzMod.makeUrl(this.classRef, '1');
  }
}

module.exports = JazzMod;