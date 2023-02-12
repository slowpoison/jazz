/**
 * jazz-mods-loader.cjs
 * 
 * Loads all Jazz Modules from the jazzmods directory
 * Copyright (C) 2021-2023, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const Path = require('path');
const Fs = require('fs/promises');

const JAZZ_MODS_DIR = Path.join(__dirname, "jazzmods");

// TODO make idempotent
class JazzModsLoader {
  static #mods = {};
  static #jazz = null;

  static async genLoadJazzMods(jazz, jazzModRefs) {
    JazzModsLoader.#jazz = jazz;
    return Promise.all(
      jazzModRefs.map(
        async (jazzModRef) => JazzModsLoader.#genLoadJazzMod(jazzModRef)));
  }

  static async #genLoadJazzMod(jazzModRef) {
    if (JazzModsLoader.#mods[jazzModRef] !== undefined) {
      return JazzModsLoader.#mods[jazzModRef];
    }

    var [pkgName, modName] = JazzModsLoader.#pkgAndModNameFromRef(jazzModRef);

    var key = JazzModsLoader.#canonicalModName(pkgName, modName);
    var mod = require(Path.join(JAZZ_MODS_DIR, pkgName, modName.toLowerCase() + '.jazzmod.cjs'));
    JazzModsLoader.#mods[key] = new mod(JazzModsLoader.#jazz, jazzModRef);

    Logger.info(`Loaded JazzMod ${key} from ${pkgName}/${modName.toLowerCase()}.jazzmod.cjs`);
    return JazzModsLoader.#mods[key];
  }

  static getMod(modId) {
    return JazzModsLoader.#mods[modId];
  }

  static #canonicalModName(pkgName, modName) {
    if (modName.indexOf('/') !== -1) {
      // remove everything before the last slash
      modName = modName.substring(0, modName.indexOf('/'));
    }
    return pkgName.concat(`.${modName}`);
  }

  // FIXME chagne to getJazzMod and let the caller call genSvg
  static async genJazzModSvg(dashId, jazzModRef) {
    var [pkgName, modName] = JazzModsLoader.#pkgAndModNameFromRef(jazzModRef);
    var key = JazzModsLoader.#canonicalModName(pkgName, modName);
    var mod = JazzModsLoader.#mods[key];
    if (mod === undefined) {
      Logger.error(`JazzMod ${jazzModRef} not found`);
      return;
    }

    return await mod.genSvg(dashId);
  }

  static #pkgAndModNameFromRef(jazzModRef) {
    var lastDot = jazzModRef.lastIndexOf('.');
    return [
      jazzModRef.substring(0, lastDot),
      jazzModRef.substring(lastDot + 1)];
  }
}

module.exports = JazzModsLoader;