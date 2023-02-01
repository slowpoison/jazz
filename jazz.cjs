/*
 * Jazz.cjs
 *
 * Main Jazz class
 * Copyright(c) 2021-23, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const JazzModsLoader = require('./jazz-mods-loader.cjs');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    //globalThis.Headers = Headers;
    //globalThis.Request = Request;
    //globalThis.Response = Response;
}
globalThis.document = new JSDOM('<!DOCTYPE html>').window.document;

var d3 = import('d3')
  .then(module => d3 = globalThis.d3 = module);
const D3Node = require('slowpoison-d3-node');

const JazzDataSourcesLoader = require('./jazz-data-sources-loader.cjs');
const JazzWidgetsLoader = require('./jazz-widgets-loader.cjs');
const JazzDashesLoader = require('./jazz-dashes-loader.cjs');

// TODO only call other classes when D3N is ready
class Jazz {
  // returns a promise with all pending work
  async #genInit() {
    var loadDataSources = JazzDataSourcesLoader.genLoadDataSources();
    var loadWidgets = JazzWidgetsLoader.genLoadWidgets();
    // JazzMods are a confluence of DataSources and Widgets, so are loaded after both 
    //var loadJazzMods = JazzModsLoader.genLoadJazzMods();

    var d3nOptions = {
      d3Widgetule: await d3,
      selector: '#jazz',
      container: '<html><head></head><body><div id="container"><div id="jazz"></div></div></body></html>'
    };
    this.d3n = new D3Node(d3nOptions); // initializes D3 with container element
    return Promise.all([loadDataSources, loadWidgets]);
  }

  constructor() {
    // TODO may not need
    this.ready = this.#genInit();
  }

  async genDashJson(dashId='default') {
    await this.ready;
    return JazzDashesLoader.genDashJson(this, dashId);
  }

  async genJazzModSvg(dashId, jazzModRef) {
    await this.ready;
    var svg = await JazzModsLoader.genJazzModSvg(dashId, jazzModRef);
    return svg.node().outerHTML;
  }
}

module.exports = Jazz;
