var proxyquire = require('proxyquire');
const dlvrPkg = require('../package.json');
const {configMock, eachConfig, setStubConfig} = require('./helper');
const config = proxyquire('../src/lib/config', configMock);

describe('#utils', function() {
  beforeEach(eachConfig);
  it('should want to update', function(done) {
    const utils = proxyquire('../src/lib/utils.js', {
      request: {
        get: (a, func) =>
          func(null, {body: {collected: {metadata: {version: '1.1.1'}}}},  null)
      }
    });

    utils.checkUpdate().then(data => {
      expect(data).toBe(true);
      done();
    });
  });

  it('should not want to update', function(done) {
    const utils = proxyquire('../src/lib/utils.js', {
      request: {
        get: (a, func) => func(null, {body: {collected: {metadata: {version: dlvrPkg.version}}}}, null)
      }
    });

    utils.checkUpdate().then(data => {
      expect(data).toBe(false);
      done();
    });
  });
});
