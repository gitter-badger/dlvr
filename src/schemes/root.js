exports.default = {
  properties: {
    dotenv: {
      type: 'string',
      required: true
    },
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
