const fs = require('fs');
const {FILE_CHANGELOG} = require('../constants');
const utils = require('./utils');
const git = require('../modules/git');

const composeChangelog = (changelog, releases = []) => {
  changelog =
    changelog.length > 0 ? `**Changelog**  \n${changelog.join('\n')}  \n` : '';
  releases =
    releases.length > 0 ? `**Releases**  \n${releases.join('\n')}  ` : '';

  return `${changelog}\n${releases}`;
};

const writeAndOpen = changelog => {
  fs.writeFile(FILE_CHANGELOG, composeChangelog(changelog), err => {
    if (err) {
      utils.fatal(err.message);
    }
    utils.openEditor(FILE_CHANGELOG);
  });
};

const read = () =>
  new Promise((resolve, reject) => {
    fs.readFile(FILE_CHANGELOG, (err, changelog) => {
      err
        ? reject(err)
        : resolve(changelog.join('\n').splice(2, changelog.length));
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
  getLog,
  composeChangelog,
  writeAndOpen
};
