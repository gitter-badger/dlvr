const fs = require('fs');
const path = require('path');
const asyncLoop = require('node-async-loop');
const og = require('octonode');

const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const uploadAssets = (config, id) => {
  return new Promise((resolve, reject) => {
    if (!config.github || config.github.release.assets.length < 1) {
      resolve();
    } else {
      var client = og.client(config.github.token),
        release = client.release(config.github.repo, id);

      asyncLoop(config.github.release.assets, (item, next) => {
        var asset = fs.readFileSync(path.join(process.cwd(), item.file));
        spinner.create(`Upload asset ${item.name} to GitHub`);

        release.uploadAssets(asset, {
          name: item.name
        }, (err, data) => {
          utils.catchError(err, err, reject);
          next();
        });
      }, (err) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    }
  });
};

const checkToken = (config) => {
  var client = og.client(config.github.token);

  return new Promise((resolve, reject) => {
    if (config.github) {
      spinner.create('Check GitHub Token');
      client.get('/user', {}, (err, status, body, headers) => {
        utils.catchError(err, err, reject);

        if (!body) {
          reject(new Error('Github Token invalid'));
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const release = (config, version, changelog) => {
  spinner.create('Publish Release on GitHub');

  return new Promise((resolve, reject) => {
    if (config.github) {
      var client = og.client(config.github.token),
        repo = client.repo(config.github.repo);

      repo.release({
        name: version,
        tag_name: version,
        body: changelog || '',
        draft: config.github.release.draft
      }, (err, data) => {
        utils.catchError(err, err, reject);
        resolve(data.id);
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  release,
  checkToken,
  uploadAssets
};
