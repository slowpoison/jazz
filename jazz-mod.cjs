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
    Logger.throwError('Child class must implement genSvg');
  }

  async genUrl() {
    // FIXME - replace static 1 with modRef
    return JazzRef.JazzMod.makeUrl(this.classRef, '1');
  }
}

module.exports = JazzMod;