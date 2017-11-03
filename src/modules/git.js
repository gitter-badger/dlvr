const git = require('simple-git');
const GITPATH = process.cwd();
const spinner = require('../lib/spinner');
const utils = require('../lib/utils');

const getLogsFromLastTag = cfg => {
  return new Promise((resolve, reject) => {
    git(GITPATH).tags((err, tags) => {
      utils.catchError(err, err, reject);
      const allTags = tags.all.reverse();
      const opt = allTags.length >= 1 ? {from: allTags[0], to: 'HEAD'} : {};
      git(GITPATH).log(opt, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  });
};

const generateChangelog = ({cfg}) => {
  var changelog = [];

  return new Promise((resolve, reject) => {
    getLogsFromLastTag(cfg)
      .then(data => {
        data.all
          .filter(
            item =>
              cfg.has('logfilter')
                ? new RegExp(cfg.logfilter).test(item.message)
                : true
          )
          .map(item => {
            const msg = item.message.replace(/\(.* -> .*\)/, '');
            changelog.push(`- ${msg}  `);
          });
        resolve(changelog);
      })
      .catch(err => {
        utils.catchError(err, err, reject);
      });
  });
};

const commitAndPush = ({version, cfg}) => {
  spinner.create('Commit, Tag and Push Release');
  return new Promise((resolve, reject) => {
    git(GITPATH)
      .add('./*')
      .commit(`🎉 Release ${version}`)
      .addTag(version, (err, res) => {
        utils.catchError(err, err, reject);
      })
      .push([cfg.getRemote(), 'master'], (err, res) => {
        utils.catchError(err, err, reject);
        git(GITPATH).pushTags(cfg.getRemote(), (err, res) => {
          utils.catchError(err, err, reject);
          resolve();
        });
      });
  });
};

const tagExist = ({version}) => {
  spinner.create('Check if Tag exists');
  return new Promise((resolve, reject) => {
    git(GITPATH).tags((err, tags) => {
      utils.catchError(err, err, reject);

      if (tags.all.indexOf(version) > -1) {
        reject(new Error(`Tag ${version} already exists`));
      }
      resolve(version);
    });
  });
};

const checkRepo = ({cfg}, quiet) => {
  return new Promise((resolve, reject) => {
    if (!quiet) {
      spinner.create('Check git Repository');
    }
    git(GITPATH)
      .status((err, status) => {
        utils.catchError(err, err, reject);
        if (status.ahead > 0 || status.behind > 0) {
          return reject(
            new Error(
              `Your master branch is not up-to-date with ${cfg.getRemote()}/master - Please pull/push first`
            )
          );
        }
        if (status.files.length > 0) {
          return reject(
            new Error(
              'You have uncommitted changes - Please commit or stash them before release!'
            )
          );
        }
        if (status.current !== 'master') {
          return reject(new Error('You are not on the master branch'));
        }
      })
      .exec(() => {
        git(GITPATH).getRemotes(true, (err, data) => {
          utils.catchError(err, err, reject);

          if (data.length < 0) {
            reject(new Error(`No Remote found`));
          }
          var remoteExists =
            data.filter(item => item.name === cfg.getRemote()).length > 0;

          if (!remoteExists) {
            reject(
              new Error(
                `Remote in config (${cfg.getRemote()}) is not available`
              )
            );
          }
          resolve();
        });
      });
  });
};

module.exports = {
  generateChangelog,
  commitAndPush,
  checkRepo,
  tagExist
};
