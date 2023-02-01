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
      return [
        JazzRef.ROOT_URL,
        JazzRef.inverseTypesMap[this.name],
        [pkgName, 'style'].join('.'),
      ].join('/');
    }
  }

  static JazzMod = class {
    static URL_PREFIX = '/' + JazzRef.inverseTypesMap[this.name];
    static makeUrl(modClass, modRef) {
      var url = [
        JazzRef.ROOT_URL,
        JazzRef.inverseTypesMap[this.name],
        modClass,
        modRef
      ].join('/');
      return url;
    }

    static makeId(modClass, modInstance) {
      return [modClass, modInstance].join('/');
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
