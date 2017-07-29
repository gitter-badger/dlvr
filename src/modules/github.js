const fs = require('fs');
const path = require('path');
const asyncLoop = require('node-async-loop');
const og = require('octonode');

const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const uploadAssets = (config, id, tokens) => {
  return new Promise((resolve, reject) => {
    if (!config.hasAssets()) {
      resolve();
    } else {
      var client = og.client(tokens.github),
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

const checkToken = (config, tokens) => {
  var client = og.client(tokens.github);

  return new Promise((resolve, reject) => {
    if (config.has('github')) {
      spinner.create('Check GitHub Token');
      client.get('/user', {}, (err, status, body, headers) => {
        utils.catchError(err, err, reject);
        if (!body || Object.keys(body).length === 0) {
          reject(new Error('Github Token invalid'));
        } else {
          resolve(body);
        }
      });
    } else {
      resolve();
    }
  });
};

const release = (config, version, changelog, tokens) => {
  spinner.create('Publish Release on GitHub');

  return new Promise((resolve, reject) => {
    if (config.has('github')) {
      var client = og.client(tokens.github),
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
