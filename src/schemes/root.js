exports.default = {
  properties: {
    dotenv: {
      type: 'string'
    },
    npmpublish: {
      type: 'boolean'
    },
    test: {
      type: 'string'
    },
    logfilter: {
      type: 'string'
    },
    notify: {
      type: 'boolean',
      required: true
    }
  },
  type: 'object'
};
