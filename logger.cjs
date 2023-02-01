/*
 * Logger.cjs
 *
 * Logger class with some bells and whistles
 *
 * Copyright(c) 2021-2023, Vishal Verma <vish@slowpoison.net>
 */

const [DEBUG, INFO, WARN, ERROR] = Array(4).keys();

class Logger {
  static singleton = null;

  constructor() {
    this.level = DEBUG;
    switch (process.env.NODE_ENV) {
    case 'production':
      this.level = WARN;
      break;

    case 'staging':
      this.level = INFO;
      break;
    }
  }

  static getLogger() {
    if (Logger.singleton != null)
      return Logger.singleton;

    Logger.singleton = new Logger();
    return Logger.singleton;
  }

  throwError(msg, cause) {
    var error = new Error(msg, {cause: cause});
    this.error(msg, error);
    throw error;
  }

  #log(level, msg, ...rest) {
    if (level < this.level)
      return;

    if (level < WARN) {
      console.log(msg, ...rest);
      return;
    }

    this.#logExtraDetails(msg, rest);
  }

  #logExtraDetails(msg, rest) {
    console.dir('rest', rest.map(r => r));
    var exception = rest.find(arg => arg instanceof Error);
    if (exception == null) {
      exception = new Error(msg);
    }

    console.log(exception);
    if (exception.cause != null) {
      console.log('Caused by:', exception.cause);
    }
  }

  tee(obj) {
    console.log(obj);
    return obj;
  }

  error(msg, ...rest) {
    this.#log(ERROR, msg, ...rest);
  }

  warn(msg, ...rest) {
    this.#log(WARN, msg, ...rest);
  }

  info(msg, ...rest) {
    this.#log(INFO, msg, ...rest);
  }

  debug(msg, ...rest) {
    this.#log(DEBUG, msg, ...rest);
  }
}

module.exports = Logger;
