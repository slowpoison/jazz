/*
 * jazz-ref.cjs
 *
 * A Jazz reference that could be a url or package name to Mod, Dash or
 * a Widget
 *
 * Copyright(c) 2022, Vishal Verma <vish@slowpoison.net>
 */

const _ = require('lodash');

class JazzRef {
  static ROOT_URL = '/jazz';
  static typesMap = {s: 'Style', m: 'JazzMod'};
  static inverseTypesMap = _.invert(this.typesMap);
  static Style = class {
    static URL_PREFIX = '/' + JazzRef.inverseTypesMap[this.name];
    static makeUrl(pkgName, styleRef) {
      var url = [
        JazzRef.ROOT_URL,
        JazzRef.inverseTypesMap[this.name],
        pkgName,
      ].join('/');
      if (styleRef != undefined) {
        url = url + '/' + styleRef;
      }
      return url;
    }
  }

  // FIXME - create a ref interface and implement it for JazzMod and others as needed
  /**
   * Jazz Module reference
   * Knows the ins and outs of JazzMod URLs and references
   */
  static JazzMod = class {
    static URL_PREFIX = JazzRef.ROOT_URL + '/' + JazzRef.inverseTypesMap[this.name];

    static makeUrlFromRef(modRef) {
      return this.URL_PREFIX + '/' + modRef;
    }

    static makeRef(...args) {
      if (args.length < 1) {
        throw new Error('makeRef needs at least one argument');
      }

      if (args.length == 1) {
        // remove the url prefix if it exists, and convert all slashes to dots
        var modRef = args[0].replace(this.URL_PREFIX, '');
        modRef.replaceAll('/', '.');
        return modRef;
      }

      // we have at least 2 args
      // could get some combination of pkg name, class name and params
      if (args.length == 2) {
        if (typeof args[1] == 'object') {
          var modParams = args[1];
          var [modPkg, modClass] = this.#pkgAndModNameFromRef(args[0]);
        } else {
          var modPkg = args[0];
          var modClass = args[1];
          var modParams = null;
        }
      } else {
        var modPkg = args[0];
        var modClass = args[1];
        var modParams = args[2];
      }

      var ref = modPkg + '.' + modClass;
      if (modParams != undefined && modParams != null) {
        if (typeof modParams == 'string') {
          ref += '?' + modParams;
        } else {
          ref += '?' + this.serializeParams(modParams);
        }
      }

      return ref;
    }

    static explodeModRefOrUrl(jazzModRef) {
      jazzModRef = jazzModRef.replace(this.URL_PREFIX + '/', '');
      var pkgSeparatorLoc = jazzModRef.lastIndexOf('/');
      if (pkgSeparatorLoc == -1) {
        pkgSeparatorLoc = jazzModRef.lastIndexOf('.');
      }

      var paramsLoc = jazzModRef.indexOf('?');

      var explode =  [
        jazzModRef.substring(0, pkgSeparatorLoc),
        jazzModRef.substring(pkgSeparatorLoc + 1, paramsLoc != -1 ? paramsLoc : jazzModRef.length),
        paramsLoc != -1 ? jazzModRef.substring(paramsLoc + 1) : null];
      return explode;
    }

    static serializeParams(params = {}) {
      var paramsStr = '';
      var keys = params != null ? Object.keys(params) : [];
      if (keys.length > 0) {
        keys.sort();
        paramsStr = keys[0] + '=' + params[keys[0]];
        for (var i = 1; i < keys.length; i++) {
          paramsStr += '&' + keys[i] + '=' + params[keys[i]];
        }
      }
      return paramsStr;
    }

    static deserializeParams(paramsStr) {
      if (typeof paramsStr == 'object') {
        return paramsStr;
      }

      var params = {};
      if (paramsStr != null) {
        var pairs = paramsStr.split('&');
        pairs.forEach((pair) => {
          var [key, value] = pair.split('=');
          params[key] = value;
        });
      }
      return params;
    }

    static #pkgAndModNameFromRef(classRef) {
      var lastDot = classRef.lastIndexOf('.');
      return [
        classRef.substring(0, lastDot),
        classRef.substring(lastDot + 1)];
    }

    // Convert a mod name to a canonical form by removing everything after
    // the first slash (if any)
    static #canonicalModName(pkgName, modName) {
      if (modName.indexOf('/') !== -1) {
        // remove everything before the last slash
        modName = modName.substring(0, modName.indexOf('/'));
      }
      return pkgName.concat(`/${modName}`);
    }
  }

  static urlPattern = /jazz\/p\/(.*)\/(\w+)\/(\w+)\/(.*)/;

  static urlToPkgName(url) {
    var urlParts = url.match(this.urlPattern);
    return (urlParts != null && urlParts.length == 5) ? urlParts[1] + '.' + urlParts[3] : null;
  }

  constructor(refString) {
    this.refString= refString;
  }

  type() {
    var m = this.refString.match(JazzRef.urlPattern);
    return m[2];
  }
}

module.exports = JazzRef;
