const git = require('simple-git');
const GITPATH = process.cwd();
const spinner = require('../lib/spinner');
const utils = require('../lib/utils');
const {AUTO_FILTER_MAJOR, AUTO_FILTER_MINOR} = require('../constants');

// TODO: internal method - getAllTags();

const determineVersion = ({cfg}) => {
  return new Promise((resolve, reject) => {
    git(GITPATH).tags((err, tags) => {
      utils.catchError(err, err, reject);
      const allTags = tags.all.reverse();
      const opt = allTags.length >= 1 ? {from: allTags[0], to: 'HEAD'} : {};
      const VERSIONS = ['patch', 'minor', 'major'];
      let versionId = 0;

      git(GITPATH)
        .log(opt, (err, data) => {
          utils.catchError(err, err, reject);
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
        })
        .exec(() => {
          resolve(VERSIONS[versionId]);
        });
    });
  });
};

// TODO: test this
// TODO: rename this to readTags or parseTags
const generateChangelog = ({cfg}) => {
  var changelog = [];
  return new Promise((resolve, reject) => {
    git(GITPATH).tags((err, tags) => {
      utils.catchError(err, err, reject);
      const allTags = tags.all.reverse();
      const opt = allTags.length >= 1 ? {from: allTags[0], to: 'HEAD'} : {};

      git(GITPATH)
        .log(opt, (err, data) => {
          utils.catchError(err, err, reject);
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
        })
        .exec(() => {
          // TODO: return object with filtered logs, and a suggest SEMVWER release based on the logs
          resolve(changelog);
        });
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

const checkChanges = () => {
  const concatFiles = stat => {
    let out = [];
    return out
      .concat(
        stat.not_added,
        stat.conflicted,
        stat.created,
        stat.deleted,
        stat.modified,
        stat.renamed
      )
      .join('\n');
  };

  return new Promise((resolve, reject) => {
    git(GITPATH).status((err, status) => {
      utils.catchError(err, err);
      // console.log(concatFiles(status));
      resolve(concatFiles(status));
    });
  });
};

const checkRepo = ({cfg}) => {
  return new Promise((resolve, reject) => {
    spinner.create('Check git Repository');
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
  checkChanges,
  generateChangelog,
  tagAndPush,
  commitAndPush,
  checkRepo,
  tagExist
};
