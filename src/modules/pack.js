const fs = require('fs');
const path = require('path');

const utils = require('../lib/utils');

const read = () => {
  var pack = path.join(process.cwd(), 'package.json');
  return new Promise((resolve, reject) => {
    fs.readFile(pack, (err, result) => {
      utils.catchError(err, err, reject);
      resolve(JSON.parse(result));
    });
  });
};

module.exports = {
  read
};
