const git = require('simple-git');
const GITPATH = process.cwd();
const spinner = require('../lib/spinner');
const utils = require('../lib/utils');
const {AUTO_FILTER_MAJOR, AUTO_FILTER_MINOR} = require('../constants');

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

const determineVersion = ({cfg}) => {
  return new Promise((resolve, reject) => {
    getLogsFromLastTag(cfg)
      .then(data => {
        const VERSIONS = ['patch', 'minor', 'major'];
        let versionId = 0;
        data.all.map(item => {
          if (
            new RegExp(AUTO_FILTER_MINOR, 'i').test(item.message) &&
            versionId < 2
          ) {
            versionId = 1;
          }

          if (new RegExp(AUTO_FILTER_MAJOR, 'i').test(item.message)) {
            versionId = 2;
          }
        });

        resolve(VERSIONS[versionId]);
      })
      .catch(err => {
        utils.catchError(err, err, reject);
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

const tagAndPush = ({version, cfg}) => {
  spinner.create('Tag Release');
  return new Promise((resolve, reject) => {
    git(GITPATH)
      .addTag(version, (err, res) => {
        utils.catchError(err, err, reject);
      })
      .pushTags(cfg.getRemote(), (err, res) => {
        utils.catchError(err, err, reject);
        resolve('Tag created and pushed');
      });
  });
};

const commitAndPush = ({version, cfg}) => {
  spinner.create('Commit and Push Release');
  return new Promise((resolve, reject) => {
    git(GITPATH)
      .add('./*')
      .commit(`🎉 Release ${version}`)
      .push([cfg.getRemote(), 'master']);
    resolve();
  });
};

const tagExist = ({version}) => {
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
          reject(
            new Error(
              `Your master branch is not up-to-date with ${cfg.getRemote()}/master - Please pull/push first`
            )
          );
        }
        if (status.files.length > 0) {
          reject(
            new Error(
              'You have uncommitted changes - Please commit or stash them before release!'
            )
          );
        }
        if (status.current !== 'master') {
          reject(new Error('You are not on the master branch'));
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
  determineVersion,
  generateChangelog,
  tagAndPush,
  commitAndPush,
  checkRepo,
  tagExist
};
