const fs = require('fs');
const path = require('path');
const utils = require('../lib/utils');

function copyHook() {
  // HACK: investigate how this is working when its really installed
  const srcHook = path.join('src', 'partials', 'post-merge');
  const destHook = path.join(process.cwd(), '.git', 'hooks', 'post-merge');

  fs.access(srcHook, err => {
    if (err) {
      utils.fatal(err);
    }

    fs.access(destHook, err => {
      if (!err) {
        utils.fatal('post-merge hook already exists, aborting.');
      }

      fs.createReadStream(srcHook).pipe(fs.createWriteStream(destHook));
      utils.quit('post-merge hook was created!');
    });
  });
}

module.exports = copyHook;
