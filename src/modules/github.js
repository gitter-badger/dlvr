const fs = require('fs');
const path = require('path');
const asyncLoop = require('node-async-loop');
const og = require('octonode');

const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const uploadAssets = ({cfg, tokens}, id) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('github') && cfg.hasAssets()) {
      var client = og.client(tokens.get('github')),
        release = client.release(cfg.githost.repo, id);

      asyncLoop(
        cfg.githost.release.assets,
        (item, next) => {
          var asset = fs.readFileSync(path.join(process.cwd(), item.file));
          spinner.create(`Upload asset ${item.name} to GitHub`);

          release.uploadAssets(
            asset,
            {
              name: item.name
            },
            (err, data) => {
              utils.catchError(err, err, reject);
              next();
            }
          );
        },
        err => {
          utils.catchError(err, err, reject);
          resolve();
        }
      );
    } else {
      resolve();
    }
  });
};

const checkToken = ({cfg, tokens}) => {
  var client = og.client(tokens.github),
    repo = client.repo(cfg.githost.repo);

  return new Promise((resolve, reject) => {
    if (cfg.isProvider('github')) {
      spinner.create('Check GitHub Token and Repository');
      client.get('/user', {}, (err, status, body, headers) => {
        utils.catchError(err, err, reject);
        if (!body || Object.keys(body).length === 0) {
          reject(new Error('Github Token invalid'));
        } else {
          repo.collaborators(err => {
            utils.catchError(err, err, reject);
            resolve(body);
          });
        }
      });
    } else {
      resolve();
    }
  });
};

const release = ({cfg, version, changelog, tokens}) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('github')) {
      spinner.create('Publish Release on GitHub');
      var client = og.client(tokens.get('github')),
        repo = client.repo(cfg.githost.repo);

      repo.release(
        {
          name: version,
          tag_name: version,
          body: changelog || '',
          draft: cfg.githost.release.draft || true
        },
        (err, data) => {
          utils.catchError(err, err, reject);
          resolve(data.id);
        }
      );
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
