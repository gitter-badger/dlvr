exports.default = {
  properties: {
    snyk: {
      type: 'boolean'
    },
    npmpublish: {
      type: 'boolean'
    },
    test: {
      type: 'string'
    },
    logfilter: {
      type: 'string',
      required: true
    }
  },
  type: 'object'
};
