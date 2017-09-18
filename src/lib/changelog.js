const fs = require('fs');
const {
  FILE_CHANGELOG,
  AUTO_FILTER_MINOR,
  AUTO_FILTER_MAJOR
} = require('../constants');
const git = require('../modules/git');
const utils = require('./utils');

const composeChangelog = (changelog, releases = []) => {
  changelog =
    changelog.length > 0 ? `**Changelog**  \n${changelog.join('\n')}  \n` : '';
  releases =
    releases.length > 0 ? `**Releases**  \n${releases.join('\n')}  ` : '';

  return `${changelog}\n${releases}`;
};

const determineVersion = changelog => {
  return new Promise((resolve, reject) => {
    const VERSIONS = ['patch', 'minor', 'major'];
    let versionId = 0;
    changelog.map(item => {
      if (new RegExp(AUTO_FILTER_MINOR, 'i').test(item) && versionId < 2) {
        versionId = 1;
      }

      if (new RegExp(AUTO_FILTER_MAJOR, 'i').test(item)) {
        versionId = 2;
      }
    });

    resolve(VERSIONS[versionId]);
  });
};

const writeAndOpen = changelog => {
  fs.writeFile(FILE_CHANGELOG, changelog.join('\n'), err => {
    if (err) {
      utils.fatal(err.message);
    }
    utils.openEditor(FILE_CHANGELOG);
  });
};

const read = () =>
  new Promise((resolve, reject) => {
    fs.readFile(FILE_CHANGELOG, 'utf8', (err, changelog) => {
      err ? reject(err) : resolve(changelog.split('\n'));
    });
  });

const getLog = configs =>
  new Promise((resolve, reject) => {
    fs.access(FILE_CHANGELOG, err => {
      if (err) {
        git
          .generateChangelog(configs)
          .then(changelog => {
            resolve(changelog);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        read()
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });

module.exports = {
  determineVersion,
  getLog,
  composeChangelog,
  writeAndOpen
};
