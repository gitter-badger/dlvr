const fs = require('fs');
const path = require('path');
const request = require('request');
const asyncLoop = require('node-async-loop');
const mime = require('mime');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');
const changelogHelper = require('../lib/changelog');

const uploadAssets = ({cfg, secrets}, projectId) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab') && cfg.hasAssets()) {
      spinner.create('Upload assets to gitlab');
      let releases = [];
      const gitlabapi = secrets.get('gitlab-api');

      asyncLoop(
        cfg.githost.release.assets,
        (item, next) => {
          let readStream = fs.readFileSync(path.join(process.cwd(), item.file));
          let readMime = mime.lookup(item.file);

          const opt = {
            url: `${gitlabapi}/projects/${projectId}/uploads`,
            headers: {
              'PRIVATE-TOKEN': secrets.get('gitlab')
            }
          };

          let req = request.post(opt, (err, resp, body) => {
            if (err) {
              next(err);
            }

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

const release = ({cfg, version, changelog, secrets}, projectId, releases) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Publish release on gitlab');
      const gitlabapi = secrets.get('gitlab-api');

      var opt = {
        url: `${gitlabapi}/projects/${projectId}/repository/tags/${version}/release`,
        headers: {
          'PRIVATE-TOKEN': secrets.get('gitlab')
        },
        body: {
          tag_name: version,
          description: changelogHelper.composeChangelog(changelog, releases)
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

const getUser = ({cfg, secrets}) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Check gitlab token and get User');
      const gitlabapi = secrets.get('gitlab-api');

      var opt = {
        url: `${gitlabapi}/user`,
        headers: {
          'PRIVATE-TOKEN': secrets.get('gitlab')
        },
        json: true
      };
      request.get(opt, (err, res, body) => {
        utils.catchError(err, err, reject);

        if (res.statusCode !== 200) {
          reject(new Error(`Something went wrong \n ${res.body.message}`));
        }
        resolve(body.id);
      });
    } else {
      resolve();
    }
  });
};

const getProject = ({cfg, secrets}, userId) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Get gitlab project');
      const gitlabapi = secrets.get('gitlab-api');

      var opt = {
        url: `${gitlabapi}/users/${userId}/projects`,
        headers: {
          'PRIVATE-TOKEN': secrets.get('gitlab')
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
