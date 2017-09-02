const fs = require('fs');
const path = require('path');
const request = require('request');
const asyncLoop = require('node-async-loop');
const mime = require('mime');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');
const {GITHUB_API_URL} = require('../constants');

// TODO: write tests
const uploadAssets = ({cfg, tokens}, projectId) => {
  return new Promise((resolve, reject) => {
    spinner.create('Upload assets to gitlab');
    if (cfg.isProvider('gitlab') && cfg.hasAssets()) {
      let releases = [];
      const githubapi = tokens.get('gitlab-api');

      asyncLoop(
        cfg.githost.release.assets,
        (item, next) => {
          let readStream = fs.readFileSync(path.join(process.cwd(), item.file));
          let readMime = mime.lookup(item.file);

          const opt = {
            url: `${githubapi}/projects/${projectId}/uploads`,
            headers: {
              'PRIVATE-TOKEN': tokens.get('gitlab')
            }
          };

          let req = request.post(opt, (err, resp, body) => {
            if (err) next(err);
            releases.push(JSON.parse(body).markdown);

            next();
          });

          const form = req.form();
          form.append('file', readStream, {
            filename: item.name,
            contentType: readMime
          });
        },
        err => {
          utils.catchError(err, err, reject);
          resolve(releases);
        }
      );
    } else {
      resolve();
    }
  });
};

const release = ({cfg, version, changelog, tokens}, projectId, releases) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Publish release on gitlab');
      const githubapi = tokens.get('gitlab-api');

      var opt = {
        url: `${githubapi}/projects/${projectId}/repository/tags/${version}/release`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        body: {
          tag_name: version,
          description: utils.composeChangelog(changelog, releases)
        },
        json: true
      };

      request.post(opt, (err, res, body) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const getUser = ({cfg, tokens}) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Check gitlab token and get User');
      const githubapi = tokens.get('gitlab-api');

      var opt = {
        url: `${GITHUB_API_URL}/user`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        json: true
      };
      request.get(opt, (err, res, body) => {
        utils.catchError(err, err, reject);

        // TODO: write body errormessage
        if (res.statusCode !== 200) {
          reject(new Error('gitlab Token invalid'));
        }
        resolve(body.id);
      });
    } else {
      resolve();
    }
  });
};

const getProject = ({cfg, tokens}, userId) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Get gitlab project');
      var opt = {
        url: `${githubapi}/users/${userId}/projects`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        json: true
      };

      request.get(opt, (err, res, data) => {
        utils.catchError(err, err, reject);
        const repo = cfg.githost.repo.split('/')[1];
        resolve(data.filter(project => project.name === repo)[0].id);
      });
    } else {
      resolve();
    }
  });
};
module.exports = {
  getProject,
  getUser,
  release,
  uploadAssets
};
