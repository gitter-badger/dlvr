const fs = require('fs');
const path = require('path');
const request = require('request');
const asyncLoop = require('node-async-loop');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');
const {GITHUB_API_URL} = require('../constants');
// TODO: write tests
// HACK: write this nicer ...
const uploadAssets = ({cfg, tokens}, projectId) => {
  return new Promise((resolve, reject) => {
    spinner.create('Upload assets to gitlab');
    if (cfg.isProvider('gitlab') && cfg.hasAssets()) {
      let releaseMarkdown = '**Releases:**  \n';
      asyncLoop(
        cfg.githost.release.assets,
        (item, next) => {
          let readStream = fs.readFileSync(path.join(process.cwd(), item.file));

          const opt = {
            url: `https://gitlab.com/api/v3/projects/${projectId}/uploads`,
            headers: {
              'PRIVATE-TOKEN': tokens.get('gitlab')
            }
          };

          let req = request.post(opt, (err, resp, body) => {
            if (err) next(err);
            releaseMarkdown += JSON.parse(body).markdown;
            next();
          });

          const form = req.form();
          form.append('file', readStream, {
            filename: item.name,
            contentType: 'text/plain' // TODO: check mimetype
          });
        },
        err => {
          // TODO: error handling
          resolve(releaseMarkdown);
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
      const releaseNotes = `${changelog || ''}  \n  ${releases || ''}`;
      var opt = {
        url: `${GITHUB_API_URL}/projects/${projectId}/repository/tags/${version}/release`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        body: {
          tag_name: version,
          description: releaseNotes
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
          reject(new Error('GitLab Login is wrong'));
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
        url: `${GITHUB_API_URL}/users/${userId}/projects`,
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
