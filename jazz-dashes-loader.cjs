/*
 * jazz-dashes-loader.cjs
 *
 * Dash loader loads all requisite componentws using async oeprations and
 * returns a Dash object
 *
 * Copyright(c) 2021-2022, Vishal Verma <vish@slowpoison.net>
 */

const fs = require('fs');
const JazzStylesLoader = require('./jazz-styles-loader.cjs');
const JazzModsLoader = require('./jazz-mods-loader.cjs');

const Dash = require('./dash.cjs');

class JazzDashesLoader {
  static dashes = {};

  static async genLoadDash(jazz, dashId) {
    if (this.dashes[dashId] != undefined) {
      return this.dashes[dashId];
    }

    var dashDefinition = JSON.parse(
        fs.readFileSync(`dashboards/${dashId}.json`).toString());

    var loadMods = JazzModsLoader.genLoadJazzMods(
        jazz, dashDefinition.jazzMods);

    var loadStyle = JazzStylesLoader.genLoadStyle(
        jazz, dashDefinition.styleRef);

    var [jazzMods, style] = await Promise.all([loadMods, loadStyle]);

    this.dashes[dashId] =  new Dash(jazz, {
        dashId: dashId,
        styleRef: dashDefinition.styleRef,
        jazzModRefs: dashDefinition.jazzMods,
        jazzMods: jazzMods
        });

    return this.dashes[dashId];
  }

  static async genDashJson(jazz, dashRef) {
    return this.genLoadDash(jazz, dashRef)
      .then(dash => dash.genToJson());
  }
}

module.exports = JazzDashesLoader;
