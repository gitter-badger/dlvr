const fs = require('fs');
const {FILE_CHANGELOG} = require('../constants');
const utils = require('./utils');

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

const read = () => new Promise((resolve, reject) => {
  fs.readFile(FILE_CHANGELOG, (err, changelog) => {
    err ? reject() : resolve(
      changelog
      .join('\n')
      .splice(2, changelog.length)
    );
  });
});


const getLog = () => new Promise((resolve, reject) => {
  fs.accessSync(FILE_CHANGELOG, err => {
    if (!err) {

      //utils.fatal(err.message);
    }
  })
});

module.exports = {
  composeChangelog,
  writeAndOpen
};
