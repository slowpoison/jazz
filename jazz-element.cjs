/*
 * jazz-element.cjs
 *
 * Individual element, that's capable of being loaded from the client
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */

class JazzElement {
  async genUrl() {
    throw new Error(`Class ${this.classname} should implement genUrl`)
  }
}

module.exports = JazzElement;
