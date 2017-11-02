const notify = require('./modules/notify');
const config = require('./lib/config');

process.on('unhandledRejection', reason => {
  console.log('Unhandled Reject Reason: \n' + reason);
});

config.boot().then(configs => {
  notify.success(configs);
});
