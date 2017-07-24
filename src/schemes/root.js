exports.default = {
  properties: {
    snyk: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          required: true
        }
      }
    },
    logfilter: {
      type: 'string',
      required: true
    }
  },
  type: 'object'
};
