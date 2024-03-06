/**
 * jazz-mods-loader.cjs
 * 
 * Loads all Jazz Modules from the jazzmods directory
 * Copyright (C) 2021-2024, Vishal Verma <vish@slowpoison.net>
 */
const Logger = require('./logger.cjs').getLogger();
const Path = require('path');
const Fs = require('fs/promises');
const JazzRef = require('./jazz-ref.cjs');

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

  static async #genLoadJazzMod(jazzModRefOrUrl) {
    if (typeof jazzModRefOrUrl !== 'string') {
      return this.#genLoadJazzModFromDefinition(jazzModRefOrUrl);
    } else {
      var [modPkg, modClass, modParams] = JazzRef.JazzMod.explodeModRefOrUrl(jazzModRefOrUrl);
      return this.#genLoadJazzModFromName(modPkg, modClass, modParams);
    }
  }

  static async #genLoadJazzModFromDefinition(jazzModDef) {
    var name = jazzModDef.name;
    if (name == null) {
      Logger.throwError(`Invalid JazzMod name {jazzModDef}`);
    }

    var [modPkg, modClass] = JazzRef.JazzMod.explodeModRefOrUrl(name);
    return this.#genLoadJazzModFromName(modPkg, modClass, jazzModDef.params);
  }

  static async #genLoadJazzModFromName(modPkg, modClass, modParams = null) {
    var jazzModKey = JazzRef.JazzMod.makeRef(modPkg, modClass, modParams);
    if (JazzModsLoader.#mods[jazzModKey] !== undefined) {
      return JazzModsLoader.#mods[jazzModKey];
    }

    var path = Path.join(JAZZ_MODS_DIR, modPkg, modClass.toLowerCase() + '.jazzmod.cjs');
    var mod = require(path);
    var newMod = new mod(this.#jazz, modPkg, modParams);
    JazzModsLoader.#mods[jazzModKey] = newMod;

    Logger.info(`Loaded JazzMod ${jazzModKey} from ${modPkg}.${modClass.toLowerCase()}.jazzmod.cjs`);
    return JazzModsLoader.#mods[jazzModKey];
  }

  static async genModFromUrl(modUrl) {
    return await JazzModsLoader.genMod(JazzRef.JazzMod.makeRefFromUrl(modUrl));
  }

  static async genMod(modId) {
    if (JazzModsLoader.#mods[modId] !== undefined) {
      return JazzModsLoader.#mods[modId];
    }

    return await JazzModsLoader.#genLoadJazzMod(modId);
  }

  // FIXME chagne to getJazzMod and let the caller call genSvg
  static async genJazzModSvg(jazzModRef) {
    var mod = JazzModsLoader.#mods[jazzModRef];
    if (mod === undefined) {
      Logger.error(`JazzMod ${jazzModRef} not found`);
      return;
    }

    return await mod.genSvg();
  }
}

module.exports = JazzModsLoader;