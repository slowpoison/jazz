/**
 * jazz-mod.cjs
 * 
 * Jazz Module base class
 * Copyright (C) 2023-24, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const JazzRef = require('./jazz-ref.cjs');
const Path = require('path');

class JazzMod {
  constructor(jazz, pkgName, params = null) {
    this.jazz = jazz;
    this.pkgName = pkgName;
    this.className = this.constructor.name;
    this.params = params;
    this.paramsObj = JazzRef.JazzMod.deserializeParams(params);

    // FIXME - replace literal values with correct formulae
    this.margin = {top: 10, right: 30, bottom: 30, left: 60};
    this.width = 460 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  async genSvg() {
    var svg =  d3.create('svg');
    svg
      .attr("xmlns", "http://www.w3.org/2000/svg")
      // TODO width comes from dash
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
    await this.genFillSvg(svg, this.params);
    return svg;
  }

  async genFillSvg(svg) {
    Logger.error(`genFillSvg not implemented for ${this.className}`);
  }

  /**
   * @returns {string} - URL for this JazzMod by encoding the module name and params
   */
  url() {
    return JazzRef.JazzMod.makeUrlFromRef(this.ref());
  }


  key() {
    return JazzRef.JazzMod.makeRef(this.pkgName, this.className, this.params);
  }

  ref() {
    return JazzRef.JazzMod.makeRef(this.pkgName, this.className, this.params);
  }
}

module.exports = JazzMod;