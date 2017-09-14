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

module.exports = {
  composeChangelog,
  writeAndOpen
};
