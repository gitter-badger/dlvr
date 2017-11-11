var proxyquire = require('proxyquire');
const {
  configMock,
  gitMock,
  setStubGitLog,
  setStubGitStatus,
  setStubConfig,
  changelogStub
} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);
const git = proxyquire('../src/modules/git', gitMock);

const versionHelper = require('../src/lib/version');

process.env.DLVR_GITHUB = 'ma github token';

describe('#git determineVersion', function () {
  let changeLog = [];
  beforeEach(function () {
    setStubGitLog({
      all: [
        {message: 'some arbitary fix'},
        {message: 'make ci happy'},
        {message: 'linting sux'}
      ]
    });

    setStubConfig(
      {
        logfilter: 'hadouken'
      },
      true
    );
  });

  it('Should determine the correct version (patch)', function (done) {
    changelog = [
      'some stuff',
      'some other stuff',
      'fix bug',
      'change controller'
    ];
    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.0.2');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|feature)', function(done) {
    changelog = ['some stuff', 'feature X added', 'some other stuff'];
    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.1.0');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|plugin)', function(done) {
    changelog = ['some stuff', 'plugin X added', 'some other stuff'];
    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.1.0');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|module)', function(done) {
    changelog = ['some stuff', 'module X added', 'some other stuff'];
    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.1.0');
        done();
      });
    });
  });

  it('Should determine the correct version (major|breaking)', function(done) {
    changelog = ['some stuff', 'breaking X added', 'some other stuff'];

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('1.0.0');
        done();
      });
    });
  });

  it('Should determine the correct version (major|deprecated)', function(done) {
    changelog = ['some stuff', 'deprecated method X', 'some other stuff'];

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('1.0.0');
        done();
      });
    });
  });

  it('Should use prerelease versions', function(done) {
    changelog = ['break stuff', 'plugin X added', 'some other stuff'];
    config.boot({VERSION: 'auto', pre: 'test'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.0.2-test.0');
        done();
      });
    });
  });

  it('Should increment prerelease versions', function(done) {
    changelog = ['break stuff', 'plugin X added', 'some other stuff'];
    config.boot({VERSION: 'auto', pre: 'test'}).then(configs => {
      configs.pkg.version = '0.0.2-test.0';
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.0.2-test.1');
        done();
      });
    });
  });

  it('Should determine the correct version (patch) with custom filters', function(done) {
    changelog = ['some stuff', 'deprecated method X', 'some other stuff'];

    setStubConfig(
      {
        filterminor: ['wat'],
        filtermajor: ['rly']
      },
      true
    );

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.0.2');
        done();
      });
    });
  });

  it('Should determine the correct version (minor) with custom filters', function(done) {
    changelog = ['some stuff', 'wat method X', 'some other stuff'];

    setStubConfig(
      {
        filterminor: ['wat'],
        filtermajor: ['rly']
      },
      true
    );

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('0.1.0');
        done();
      });
    });
  });

  it('Should determine the correct version (major) with custom filters', function(done) {
    changelog = ['rly stuff', 'method X', 'wat other stuff'];

    setStubConfig(
      {
        filterminor: ['wat'],
        filtermajor: ['rly']
      },
      true
    );

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('1.0.0');
        done();
      });
    });
  });

  it('Should determine the correct version (major|multi) with custom filters', function(done) {
    changelog = ['rly stuff', 'wat one X', 'wat other stuff'];

    setStubConfig(
      {
        filterminor: ['wat', 'rly'],
        filtermajor: ['one', 'two']
      },
      true
    );

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('1.0.0');
        done();
      });
    });
  });

  it('Should determine the correct version (major|multi) with custom filters', function(done) {
    changelog = ['wat stuff', 'one method X', 'rly other stuff'];

    setStubConfig(
      {
        filterminor: ['wat', 'rly'],
        filtermajor: ['one', 'two']
      },
      true
    );

    config.boot({VERSION: 'auto'}).then(configs => {
      versionHelper.determineVersion(configs, changelog).then(data => {
        expect(data).toEqual('1.0.0');
        done();
      });
    });
  });

});
