var proxyquire = require('proxyquire');
const {configMock, eachConfig, setStubConfig} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);

describe('#config   parse', function () {
  beforeEach(eachConfig);

  it('Should parse the valid config', function (done) {
    config.boot().then((configs) => {
      done();
    });
  });

  it('Should fail with logfilter config missing', function (done) {
    setStubConfig({});
    config.boot().catch((err) => {
      expect(err.message).toBe('root.logfilter in your config is required \n');
      done();
    });
  });

  it('Should fail with githost.release and githost.repo config missing', function (done) {
    setStubConfig({
      logfilter: '.*#',
      githost: {}
    });

    config.boot().catch((err) => {
      expect(err.message).toBe('githost.provider in your config is required \ngithost.repo in your config is required \ngithost.release in your config is required \n');
      done();
    });
  });

  it('Should contain tokens and version', function (done) {
    config.boot().then((configs) => {
      expect(configs.tokens.github).toBe('ma github token');
      expect(configs.tokens.snyk).toBe('ma snyk token');
      expect(configs.pkg.version).toBe('0.0.1');
      done();
    });
  });
});
