var proxyquire = require('proxyquire');
const {configMock, setStubConfig, eachConfig} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);

describe('#config methods', function () {
  it('Should have sugar methods', function (done) {
    config.boot().then((configs) => {
      expect(typeof configs.cfg.has).toBe('function');
      expect(typeof configs.cfg.getRemote).toBe('function');
      expect(typeof configs.cfg.hasRelease).toBe('function');
      expect(typeof configs.cfg.hasAssets).toBe('function');
      done();
    });
  });
});

describe('#config minimal', function () {
  it('Optionals should return false', function (done) {
    config.boot().then((configs) => {
      expect(configs.cfg.isProvider('github')).toBe(true);
      expect(configs.cfg.has('compress')).toBe(false);
      expect(configs.cfg.hasAssets()).toBe(false);
      expect(configs.cfg.hasRelease()).toBe(true);
      done();
    });
  });

  it('Optionals should return false when prop is false', function (done) {
    setStubConfig({
      dotenv: '.env',
      logfilter: '.*#',
      githost: false,
      compress: false,
      npmpublish: false
    });

    config.boot().then((configs) => {
      expect(configs.cfg.has('githost')).toBe(false);
      expect(configs.cfg.has('compress')).toBe(false);
      expect(configs.cfg.has('npmpublish')).toBe(false);
      expect(configs.cfg.hasAssets()).toBe(false);
      expect(configs.cfg.hasRelease()).toBe(false);
      done();
    });
  });

  it('Optionals should return true', function (done) {
    setStubConfig({
      dotenv: '.env',
      compress: [
        {in: './dist/test.txt', out: './dist/test.zip'},
        {in: './dist/test2.txt', out: './dist/test2.zip'}
      ],
      logfilter: '.*#',
      githost: {
        provider: 'github',
        token: 'token',
        repo: 'freakzero/test-repo',
        release: {
          draft: true,
          assets: [{
            file: './dist/test.zip',
            name: 'test.zip'
          }, {
            file: './dist/test2.zip',
            name: 'test2.zip'
          }]
        }
      }
    });
    config.boot().then((configs) => {
      expect(configs.cfg.isProvider('github')).toBe(true);
      expect(configs.cfg.has('compress')).toBe(true);
      expect(configs.cfg.hasAssets()).toBe(true);
      expect(configs.cfg.hasRelease()).toBe(true);
      done();
    });
  });
});
