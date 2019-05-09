'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const pkg = require('../package.json');

const {join} = path;
const {default: defaultConfig} = pkg.configuration;

class Config {
  constructor() {
    this._configFile = join(this.configExist(), '.taskbook.json');

    this._ensureConfigFile();
  }

  configExist() {
    return fs.readdirSync(process.cwd()).find(config => config === '.taskbook.json') ? process.cwd() : os.homedir();
  }

  _ensureConfigFile() {
    if (fs.existsSync(this._configFile)) {
      return;
    }

    const data = JSON.stringify(defaultConfig, null, 4);
    fs.writeFileSync(this._configFile, data, 'utf8');
  }

  _formatTaskbookDir(path) {
    return join(this.configExist(), path.replace(/^~/g, ''));
  }

  get() {
    let config = {};

    const content = fs.readFileSync(this._configFile, 'utf8');
    config = JSON.parse(content);

    if (config.taskbookDirectory.startsWith('~')) {
      config.taskbookDirectory = this._formatTaskbookDir(config.taskbookDirectory);
    } else if (config.taskbookDirectory.startsWith('/')) {
      config.taskbookDirectory = this._formatTaskbookDir(config.taskbookDirectory);
    }

    return Object.assign({}, defaultConfig, config);
  }
}

module.exports = new Config();
