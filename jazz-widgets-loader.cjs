/*
 * JazzWidgetsLoader.cjs
 *
 * Loader to assist loading of widgets
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */

const Logger = require('./logger.cjs').getLogger();
const Path = require('path');
const Fs = require('fs/promises');
const JAZZ_WIDGETS_DIR = Path.join(__dirname, "widgets");

class JazzWidgetsLoader {
  static #widgets = {};

  static async genLoadWidgets() {
    var pkgs = await Fs.readdir(JAZZ_WIDGETS_DIR, {withFileTypes: true});
    await Promise.all(pkgs.map(pkg => JazzWidgetsLoader.#genLoadPkg(pkg)));
    return JazzWidgetsLoader.#widgets;
  }

  static  async #genLoadPkg(pkgDir) {
    if (!pkgDir.isDirectory()) {
      Logger.info(`Skipping ${pkgDir.name}`);
      return;
    }

    var files = await Fs.readdir(Path.join(JAZZ_WIDGETS_DIR, pkgDir.name));
    files.filter(fileName => fileName.endsWith('.jazzwidget.cjs'))
      .forEach(widgetName => JazzWidgetsLoader.#genLoadWidget(pkgDir.name, widgetName));
  }

  static async #genLoadWidget(pkgName, widgetKey) {
    var widget;
    
    // TODO loading should come after we check for already loaded widgets
    try {
      widget = require(Path.join(JAZZ_WIDGETS_DIR, pkgName, widgetKey));
    } catch (e) {
      Logger.throwError(`Couldn't load widget ${pkgName}.${widgetKey}`, e);
    }
    var widgetKey = JazzWidgetsLoader.#canonicalWidgetName(pkgName, widget.name);
    if (JazzWidgetsLoader.#widgets[widgetKey] !== undefined) {
      Logger.info(`Widget ${widget.name} already loaded`);
      return;
    }
    JazzWidgetsLoader.#widgets[widgetKey] = widget;
    Logger.info(`Loaded Widget ${widgetKey}`);
  }

  static #canonicalWidgetName(pkgName, widgetName) {
    return pkgName.concat(`.${widgetName}`);
  }
}

module.exports = JazzWidgetsLoader;