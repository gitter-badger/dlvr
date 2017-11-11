const semver = require('semver');
const {FILTER_MAJOR_DEFAULT, FILTER_MINOR_DEFAULT} = require('../constants');

const getFilters = cfg => ({
  MINOR: `(${(cfg.has('filterminor')
    ? cfg.filterminor
    : FILTER_MINOR_DEFAULT
  ).join('|')})`,

  MAJOR: `(${(cfg.has('filtermajor')
    ? cfg.filtermajor
    : FILTER_MAJOR_DEFAULT
  ).join('|')})`
});

const determineVersion = ({pkg, cfg, args}, changelog) => {
  return new Promise((resolve, reject) => {
    const VERSIONS = ['patch', 'minor', 'major'];
    let versionId = 0;
    const FILTERS = getFilters(cfg);

    changelog.map(item => {
      if (new RegExp(FILTERS.MINOR, 'i').test(item) && versionId < 2) {
        versionId = 1;
      }

      if (new RegExp(FILTERS.MAJOR, 'i').test(item)) {
        versionId = 2;
      }
    });

    const useVersion =
      args.VERSION === 'auto' ? VERSIONS[versionId] : args.VERSION;

    resolve(
      args.pre
        ? semver.inc(pkg.version, 'prerelease', args.pre)
        : semver.inc(pkg.version, useVersion)
    );
  });
};

module.exports = {
  determineVersion,
  getFilters
};
