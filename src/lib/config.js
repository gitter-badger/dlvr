const FILEPATH = `${process.cwd()}/.dlvr`;
const spinner = require('./spinner');
const utils = require('./utils');
const fs = require('fs');

let CONFIG = null;

const checkIntegrity = (cfg) => {
  spinner.create('Check Config integrity ...');

  const defGitHubConfig = {
    github: {
      token: false,
      repo: false,
      release: {
        assets: [],
        draft: true
      }
    }
  };

  if (!cfg.hasOwnProperty('github') || !cfg.github.token) {
    cfg.github = defGitHubConfig;
  }

  if (!cfg.hasOwnProperty('github') || !cfg.github.repo) {
    cfg.github = defGitHubConfig;
  }

  if (!cfg.hasOwnProperty('github') || Array.isArray(cfg.github.assets)) {
    cfg.github.release.assets = [];
  }

  if (!cfg.hasOwnProperty('test')) {
    cfg.test = false;
  }

  if (!cfg.hasOwnProperty('npmpublish')) {
    cfg.npmpublish = false;
  }

  return cfg;
};

const loadConfig = () => {
  spinner.create('Load Config ...');

  return new Promise((resolve, reject) => {
    fs.readFile(FILEPATH, (err, cfg) => {
      utils.catchError(err, err, reject);
      CONFIG = checkIntegrity(JSON.parse(cfg));
      resolve(CONFIG);
    });
  });
};

const getConfig = () => {
  return CONFIG;
};

module.exports = {
  getConfig,
  loadConfig
};
