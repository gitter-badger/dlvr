var proxyquire = require('proxyquire');
const dlvrPkg = require('../package.json');
const {configMock, eachConfig, setStubConfig} = require('./helper');
const config = proxyquire('../src/lib/config', configMock);

describe('#utils', function() {
  beforeEach(eachConfig);
  it('should want to update', function(done) {
    const VER = '20.0.0';
    const utils = proxyquire('../src/lib/utils.js', {
      request: {
        get: (a, func) =>
          func(null, {body: {collected: {metadata: {version: VER}}}},  null)
      }
    });

    utils.checkUpdate().then(data => {
      expect(data).toBe(VER);
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
