/*
 * Jazz.cjs
 *
 * Main Jazz class
 * Copyright(c) 2021-24, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const JazzModsLoader = require('./jazz-mods-loader.cjs');
var Yaml = require('yaml');
var fs = require('fs');

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

const JazzDataSourcesLoader = require('./jazz-data-sources-loader.cjs');
const JazzWidgetsLoader = require('./jazz-widgets-loader.cjs');
const JazzDashesLoader = require('./jazz-dashes-loader.cjs');

class Jazz {
  #secrets = {};

  // returns a promise with all pending work
  async #genInit() {
    return [
      this.genLoadSecrets().then(secrets => this.#secrets = secrets),

      // FIXME load data sources and widgets on demand
      JazzDataSourcesLoader.genLoadDataSources(),
      JazzWidgetsLoader.genLoadWidgets()
    ];
  }

  constructor() {
    this.ready = this.#genInit();

  }

  getSecret(key) {
    return this.#secrets[key];
  }

  async genLoadSecrets() {
    return Yaml.parse(await fs.promises.readFile('secrets.yaml', 'utf8'));
  }

  async genDashJson(dashId) {
    await this.ready;
    return JazzDashesLoader.genDashJson(this, dashId);
  }

  async genJazzModSvg(jazzModUrl) {
    await this.ready;
    var mod = await JazzModsLoader.genMod(jazzModUrl);
    var svg = await mod.genSvg();
    return svg.node().outerHTML;
  }

  async genJazzModUrl(jmId) {
    await this.ready;
    var jazzMod = await JazzModsLoader.genMod(jmId);
    return jazzMod.url();
  }
}

module.exports = Jazz;
