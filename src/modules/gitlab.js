var request = require('request');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const release = ({cfg, version, changelog, tokens}, projectId) => {
  return new Promise((resolve, reject) => {
    if (cfg.isProvider('gitlab')) {
      spinner.create('Publish release on gitlab');
      var opt = {
        url: `https://gitlab.com/api/v3/projects/${projectId}/repository/tags/${version}/release`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        body: {
          tag_name: version,
          description: changelog
        },
        json: true
      };

      request.post(opt, (err, res, body) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    }
  });
};

const getUser = ({cfg, tokens}) => {
  return new Promise((resolve, reject) => {
    spinner.create('Check gitlab token and get User');
    if (cfg.isProvider('gitlab')) {
      var opt = {
        url: `https://gitlab.com/api/v3/user`,
        headers: {
          'PRIVATE-TOKEN': tokens.get('gitlab')
        },
        json: true
      };
      request.get(opt, (err, res, body) => {
        utils.catchError(err, err, reject);
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
        url: `https://gitlab.com/api/v3/users/${userId}/projects`,
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
    }
  });
};
module.exports = {
  getProject,
  getUser,
  release
};
