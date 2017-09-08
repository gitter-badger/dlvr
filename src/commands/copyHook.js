const fs = require('fs');
const path = require('path');

function copyHook() {
 //HACK: investigate how this is working when its really installed
  const srcHook = path.join('src', 'partials', 'post-merge');
  const destHook = path.join(process.cwd(), '.git', 'hooks', 'post-merge');

  fs.access(srcHook, (err) => {
    if (err) console.log(err.message);
    return;
  });

  fs.access(destHook, (err) => {
  if (!err) {
    console.error('Hook already exists, aborting.');
    return;
  }
});

   fs.createReadStream(srcHook).pipe(fs.createWriteStream(destHook));
    if (fs.access())
   console.log('post-merge hook was created!');
   console.log(e.message);
}

module.exports = {
  copyHook
};
